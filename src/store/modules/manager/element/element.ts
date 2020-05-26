import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import ElementState from '@/store/modules/manager/element/types';

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
            id: 0, element_id: 0, next_element_id: 0, element: null
        },
    },
    elements: [],
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
            state.element = Object.assign({}, state.element, res.data, { previous });
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить граф элемента
     */
    async managerElementGetGraph({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/element/graph/${state.elements[payload.i].id}`);
            const element = Object.assign({}, state.elements[payload.i], { next: res.data });
            state.elements.splice(payload.i, 1, element);
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
            state.elements = removeDeletedItem(state.elements, {id: payload.element_id});
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
                id: 0, element_id: 0, next_element_id: 0, element: null
            },
        };
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

};

export const managerElement: Module<ElementState, RootState> = {
    state, actions,
};
