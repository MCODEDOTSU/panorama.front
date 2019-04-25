import GeometryState from '@/store/modules/manager/geometry/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import axios from 'axios';

export const state: GeometryState = {
    geometry: {
        id: 0,
        title: '',
        description: '',
        layer_composition_id: 0,
        type: 'point',
        element_id: 0,
    },
    geometries: [],
};

export const actions: ActionTree<GeometryState, RootState> = {

    /**
     * Получить всю геометрию эоемента
     */
    async managerGetGeometries({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/geometry/${payload.elementId}`);
            state.geometries = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить геометрию
     */
    async managerUpdateGeometry() {
        try {
            if (state.geometry.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/geometry/${state.geometry.type}/${state.geometry.id}`, state.geometry);
                SuccessNotifier.notify('Данные сохранены', `Геоэлемент "${state.geometry.title}" изменен`);
                state.geometries = editUpdatedItem(state.geometries, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}manager/geometry/${state.geometry.type}`, state.geometry);
                SuccessNotifier.notify('Данные сохранены', `Геоэлемент "${state.geometry.title}" создан`);
                state.geometries.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить геометрию
     * @returns {Promise<void>}
     */
    async managerDeleteGeometry() {
        try {
            if (state.geometry.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/geometry/${state.geometry.type}/${state.geometry.id}`);
                SuccessNotifier.notify('Данные удалены', `Геоэлемент "${state.geometry.title}" удален`);
                state.geometries = removeDeletedItem(state.geometries, state.geometry);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить геометрию
     * @param payload
     */
    managerSetSingleGeometry({}, payload) {
        state.geometry = Object.assign({}, state.geometry, payload);
    },

    /**
     * Отменить выделение геометрии
     */
    managerUnsetSingleGeometry({}, payload) {
        state.geometry = {
            id: 0,
            title: '',
            description: '',
            layer_composition_id: 0,
            type: 'point',
            element_id: payload.elementId,
        };
    },

};

export const managerGeometry: Module<GeometryState, RootState> = {
    state, actions,
};
