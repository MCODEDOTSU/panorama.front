import ElementState from '@/store/modules/manager/element/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import axios from 'axios';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';

export const state: ElementState = {
    element: {
        id: 0,
        layer_id: 0,
        title: 'Новый элемент',
        description: '',
        address_id: 0,
        geometry: '',
        length: 0,
        area: 0,
        perimeter: 0,
        element_next_id: 0,
    },
    elements: [],
};

export const actions: ActionTree<ElementState, RootState> = {

    /**
     * Получить все элементы слоя
     */
    async managerElementGetAll({}, payload) {
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
            state.element = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Изменить геометрию элемента
     */
    async managerUpdateGeometry({rootState}, payload) {
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
    async deleteManagerElement({rootState}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}gis/element/${payload.elementId}`);
            SuccessNotifier.notify('Данные удалены', `Элемент "${payload.elementTitle}" удален`);
        } catch {
            ErrorNotifier.notify();
        }
    },

    // /**
    //  * Получить элемент по ИД
    //  */
    // async managerGetElementById({}, payload) {
    //     try {
    //         const res = await axios.get(`${baseUrlAPI}manager/element/${payload.id}`);
    //         state.element = Object.assign({}, res.data);
    //     } catch {
    //         ErrorNotifier.notify();
    //     }
    // },

    /**
     * Создать или обновить элемент
     */
    async managerUpdateElement({ rootState }) {
        try {
            // Дополнительные данные для элемента - с использованием конструктора
            state.element.additionalData = plainizeFields(rootState.managerConstructor.tableFields);
            if (state.element.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/element/${state.element.id}`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" изменен`);
                state.elements = editUpdatedItem(state.elements, res.data);
                // if (rootState.gisLayer.currentLayerIndex !== undefined && rootState.gisLayer.currentElementIndex !== undefined) {
                //     rootState.gisLayer.layers[rootState.gisLayer.currentLayerIndex].elements.splice(
                //         rootState.gisLayer.currentElementIndex, 1, state.element);
            } else {
                const res = await axios.post(`${baseUrlAPI}gis/element`, {
                    title: state.element.title,
                    description: state.element.description,
                    layer_id: state.element.layer_id,
                });
                state.element = Object.assign({}, state.element, res.data);
                state.elements.push(res.data);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" создан`);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    // /**
    //  * Удалить элемент
    //  * @returns {Promise<void>}
    //  */
    // async managerDeleteElement() {
    //     try {
    //         if (state.element.id !== 0) {
    //             const res = await axios.delete(`${baseUrlAPI}manager/element/${state.element.id}`);
    //             SuccessNotifier.notify('Данные удалены', `Элемент "${state.element.title}" удален`);
    //             state.elements = removeDeletedItem(state.elements, state.element);
    //         }
    //     } catch {
    //         ErrorNotifier.notify();
    //     }
    // },

    /**
     * Выделить
     * @param payload
     */
    setSingleManagerElement({}, payload) {
        state.element = Object.assign({}, payload.element);
    },

    /**
     * Отменить выделение
     */
    unsetSingleManagerElement({}, payload) {
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
            element_next_id: 0,
        };
    },

    //
    // /**
    //  * Выделить элемент
    //  * @param payload
    //  */
    // managerSetSingleElement({}, payload) {
    //     state.element = Object.assign({}, state.element, payload);
    // },
    //
    // /**
    //  * Отменить выделение элемента
    //  */
    // managerUnsetSingleElement({}, payload) {
    //     state.element = {
    //         id: 0,
    //         layer_id: payload.layerId ?  payload.layerId : 0,
    //         title: '',
    //         description: '',
    //         length: 0,
    //         area: 0,
    //         perimeter: 0,
    //     };
    // },

};

export const managerElement: Module<ElementState, RootState> = {
    state, actions,
};
