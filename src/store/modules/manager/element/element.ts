import ElementState from '@/store/modules/manager/element/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import axios from 'axios';

export const state: ElementState = {
    element: {
        id: 0,
        title: '',
        description: '',
        layer_id: 0,
        geometries: [],
        geometries_count: 0,
    },
    elements: [],
};

export const actions: ActionTree<ElementState, RootState> = {

    /**
     * Получить все элементы слоя
     */
    async managerGetElements({}, payload) {
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
    async managerGetElementById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/element/${payload.id}`);
            state.element = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить элемент
     */
    async managerUpdateElement({rootState}) {
        try {
            // Дополнительные данные для элемента - с использованием конструктора
            state.element.additionalData = rootState.constructor.tableFields;

            if (state.element.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/element/${state.element.id}`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" изменен`);
                state.elements = editUpdatedItem(state.elements, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}manager/element`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" создан`);
                state.elements.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить элемент
     * @returns {Promise<void>}
     */
    async managerDeleteElement() {
        try {
            if (state.element.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/element/${state.element.id}`);
                SuccessNotifier.notify('Данные удалены', `Элемент "${state.element.title}" удален`);
                state.elements = removeDeletedItem(state.elements, state.element);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить элемент
     * @param payload
     */
    managerSetSingleElement({}, payload) {
        state.element = Object.assign({}, state.element, payload);
    },

    /**
     * Отменить выделение элемента
     */
    managerUnsetSingleElement({}, payload) {
        state.element = {
            id: 0,
            title: '',
            description: '',
            layer_id: payload.layerId,
            geometries: [],
            geometries_count: 0,
        };
    },

};

export const managerElement: Module<ElementState, RootState> = {
    state, actions,
};
