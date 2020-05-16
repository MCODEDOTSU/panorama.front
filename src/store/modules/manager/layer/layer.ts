import LayerState from '@/store/modules/manager/layer/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import axios from 'axios';

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
    async managerGetLayers() {
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
     * Получить слой по ИД
     */
    async getLayerById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer/${payload.id}`);
            state.layer = Object.assign({}, res.data, { style: JSON.parse(res.data.style) });
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const managerLayer: Module<LayerState, RootState> = {
    state, actions,
};
