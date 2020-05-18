import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import LayerState from '@/store/modules/administrator/layer/types';

export const state: LayerState = {
    layer: {
        id: 0,
        alias: '',
        title: '',
        description: '',
        parent_id: 0,
        module_id: 0,
        visibility: false,
        geometry_type: 'point',
    },
    layers: [],
};

export const actions: ActionTree<LayerState, RootState> = {

    /**
     * Получить все слои
     */
    async administratorLayerGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer`);
            // Получаем стиль
            const layers = [];
            res.data.forEach((layer) => {
                layers.push(Object.assign({}, layer, { style: JSON.parse(layer.style) }));
            });
            state.layers = layers;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить все слои
     */
    async administratorLayerGetByType({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer/type/${payload.type}`);
            state.layers = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить слой
     */
    async administratorLayerUpdate() {
        try {
            if (state.layer.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/layer/${state.layer.id}`,
                    Object.assign({}, state.layer, { style: JSON.stringify(state.layer.style)}));
                SuccessNotifier.notify('Данные сохранены', `Слой "${state.layer.title}" изменен`);
                state.layers = editUpdatedItem(state.layers, Object.assign({}, res.data, { style: JSON.parse(res.data.style) }));
            } else {
                const res = await axios.post(`${baseUrlAPI}manager/layer`,
                    Object.assign({}, state.layer, { style: JSON.stringify(state.layer.style)}));
                SuccessNotifier.notify('Данные сохранены', `Слой "${state.layer.title}" создан`);
                state.layer = Object.assign({}, res.data, { style: JSON.parse(res.data.style) });
                state.layers.push(state.layer);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить слой
     * @returns {Promise<void>}
     */
    async administratorLayerDelete() {
        try {
            if (state.layer.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/layer/${state.layer.id}`);
                SuccessNotifier.notify('Данные удалены', `Слой "${state.layer.title}" удален`);
                state.layers = removeDeletedItem(state.layers, state.layer);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить слой
     * @param payload
     */
    administratorLayerSetSingle({}, payload) {
        state.layer = Object.assign({}, state.layer, payload);
    },

    /**
     * Отменить выделение слоя
     */
    administratorLayerUnsetSingle() {
        state.layer = {
            id: 0,
            alias: '',
            title: '',
            description: '',
            parent_id: 0,
            module_id: 0,
            visibility: false,
            geometry_type: 'point',
        };
    },

};

export const administratorLayer: Module<LayerState, RootState> = {
    state, actions,
};
