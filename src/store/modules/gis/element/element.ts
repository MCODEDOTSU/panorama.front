import ElementState from '@/store/modules/gis/element/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import {editUpdatedItem} from '@/domain/services/common/UpdateItemService';

export const state: ElementState = {
    element: {
        id: 0,
        layer_id: 0,
        title: 'Новый элемент',
        description: '',
        geometry: '',
        length: 0,
        area: 0,
        perimeter: 0,
    },
};

export const actions: ActionTree<ElementState, RootState> = {

    /**
     * Создать или сохранить элемент
     */
    async updateElement({rootState}) {
        try {
            // Дополнительные данные для элемента - с использованием конструктора
            state.element.additionalData = plainizeFields(rootState.managerConstructor.tableFields);
            if (state.element.id !== 0) {
                // const res = await axios.put(`${baseUrlAPI}gis/element/${state.element.id}`, {
                //     title: state.element.title,
                //     description: state.element.description,
                // });
                const res = await axios.put(`${baseUrlAPI}manager/element/${state.element.id}`, state.element);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" изменен`);
                if (rootState.gisLayer.currentLayerIndex !== undefined && rootState.gisLayer.currentElementIndex !== undefined) {
                    rootState.gisLayer.layers[rootState.gisLayer.currentLayerIndex].elements.splice(
                        rootState.gisLayer.currentElementIndex, 1, state.element);
                }
            } else {
                const res = await axios.post(`${baseUrlAPI}gis/element`, {
                    title: state.element.title,
                    description: state.element.description,
                    layer_id: state.element.layer_id,
                });
                state.element = Object.assign({}, state.element, res.data);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" создан`);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Изменить геометрию элемента
     */
    async updateGeometry({rootState}, payload) {
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
     * Выделить элемент
     * @param payload
     */
    setSingleElement({}, payload) {
        state.element = Object.assign({}, state.element, payload.element);
    },

    /**
     * Отменить выделение элемента
     */
    unsetSingleElement({}, payload) {
        state.element = {
            id: 0,
            layer_id: payload.layerId ? payload.layerId : 0,
            title: 'Новый элемент',
            description: '',
            geometry: '',
            length: 0,
            area: 0,
            perimeter: 0,
        };
    },

    /**
     * Удалить элемент
     */
    async deleteElement({}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}gis/element/${payload.elementId}`);
            SuccessNotifier.notify('Данные удалены', `Элемент "${payload.elementTitle}" удален`);
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const gisElement: Module<ElementState, RootState> = {
    state, actions,
};
