import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import ElementState from '@/store/modules/manager/element/types';
import IElement from '@/domain/interfaces/IElement';

export const state: ElementState = {
    element: {
        id: 0,
        layer_id: 0,
        title: '',
        description: '',
        address_id: 0,
        geometry: '',
        length: 0,
        area: 0,
        perimeter: 0,
        previous: {
            id: 0, element_id: 0, next_element_id: 0, element: null,
        },
    },
    elements: [],
    magicElement: {
        active: false,
        index: 1,
    },
};

export const actions: ActionTree<ElementState, RootState> = {

    /**
     * Получить все элементы слоя
     */
    async managerElementGetByLayer({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/element/layer/${payload.layerId}`);
            state.elements = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить элемент по ИД
     */
    async managerElementById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/element/${payload.id}`);
            const previous = res.data.previous !== null ? res.data.previous : {
                id: 0, element_id: 0, next_element_id: 0, element: null,
            };
            state.element = Object.assign({}, state.element, res.data, {previous});
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить элемент
     */
    async managerElementUpdate({rootState}) {
        try {
            // Дополнительные данные для элемента - с использованием конструктора
            state.element.additionalData = plainizeFields(rootState.managerConstructor.tableFields);
            if (state.element.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/element/${state.element.id}`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" изменен`);
                state.elements = editUpdatedItem(state.elements, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}manager/element`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" создан`);
                state.element = Object.assign({}, res.data);
                state.elements.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Обновить геометрию элемента
     */
    async managerElementUpdateGeometry({rootState}, payload) {
        try {
            if (payload.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}gis/geometry/${payload.id}`, {
                    geometry: payload.geometry,
                });
                SuccessNotifier.notify('Данные сохранены', `Геометрия элемента обновлена`);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить элемент
     * @returns {Promise<void>}
     */
    async managerElementDelete({}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}manager/element/${payload.element_id}`);
            SuccessNotifier.notify('Данные удалены', `Элемент "${payload.element_title}" удален`);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить отмеченные элементы
     * @returns {Promise<void>}
     */
    async managerElementDeleteChecked({}, payload) {
        try {
            const elements = state.elements.filter((item: any) => {
                return (item.checked === true);
            }).map((item: any) => {
                return item.id;
            });
            const res = await axios.post(`${baseUrlAPI}manager/element/delete/some`, { elements, layer_id: payload.layer_id });
            SuccessNotifier.notify('Данные удалены', `Все выделенные элементы удалены из системы`);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить элемент
     * @param payload
     */
    managerElementSetSingle({}, payload) {
        state.element = Object.assign({}, state.element, payload.element);
    },

    /**
     * Отменить выделение элемента
     */
    managerElementUnsetSingle({}, payload) {
        state.element = {
            id: 0,
            layer_id: payload.layer_id,
            title: 'Новый элемент',
            description: '',
            address_id: 0,
            geometry: '',
            length: 0,
            area: 0,
            perimeter: 0,
            previous: {
                id: 0, element_id: 0, next_element_id: 0, element: null,
            },
        };
    },

    /**
     * Получить граф элемента
     */
    async managerElementGetGraph({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/element/graph/${state.elements[payload.i].id}`);
            const element = Object.assign({}, state.elements[payload.i], {next: res.data});
            state.elements.splice(payload.i, 1, element);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Очистить поле "Предыдущий Элемент"
     * @param payload
     */
    managerElementPreviousUnsetSingle({}, payload) {
        state.element.previous = Object.assign({}, state.element.previous, {
            element_id: 0,
            next_element_id: 0,
            element: null,
        });
    },

    /**
     * Создать или элемент по шаблону
     */
    async managerMagicElementUpdate({rootState}) {
        try {

            const element = Object.assign({}, state.magicElement.element, {id: 0});

            // Дополнительные данные для элемента - с использованием конструктора
            element.additionalData = plainizeFields(rootState.managerConstructor.tableFields);

            // Формируем название по шаблону
            element.title = element.title.replace('%i', state.magicElement.index.toString());

            const res = await axios.post(`${baseUrlAPI}manager/element`, element);
            SuccessNotifier.notify('Данные сохранены', `Элемент "${element.title}" создан`);
            state.elements.push(res.data);

            // ИД Элемента
            state.magicElement.element.id = res.data.id;

            // Формируем цепочку
            state.magicElement.element.previous.element_id = res.data.id;

            state.magicElement.index++;

        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Задать шаблон для массового создания элементов
     * @param payload
     */
    managerMagicElementSetSingle({}, payload) {
        state.magicElement = {
            active: true,
            index: 1,
            element: {
                id: 0,
                layer_id: payload.layer_id,
                title: '',
                description: '',
                address_id: 0,
                geometry: '',
                length: 0,
                area: 0,
                perimeter: 0,
                previous: {
                    id: 0, element_id: 0, next_element_id: 0, element: null,
                },
            },
        };
    },

    /**
     * Очистить шаблон
     * @param payload
     */
    managerMagicElementUnsetSingle({}, payload) {
        state.magicElement = {
            active: false,
            index: 1,
        };
    },

};

export const managerElement: Module<ElementState, RootState> = {
    state, actions,
};
