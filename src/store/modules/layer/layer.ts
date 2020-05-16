import LayerState from '@/store/modules/layer/types';
import {ActionTree, Module} from 'vuex';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
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
    styles: [],
};

export const actions: ActionTree<LayerState, RootState> = {

    /**
     * Получить все доступные для контрагента слои
     */
    async managerLayerGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}gis/layer/contractor`);
            state.layers = res.data;
            // Получаем стиль
            state.styles = res.data.map((layer) => {
                return Object.assign({}, JSON.parse(layer.style), { id: layer.id });
            });
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить
     * @param payload
     */
    setSingleManagerLayer({}, payload) {
        state.layer = Object.assign({}, payload.layer);
    },

    /**
     * Отменить выделение
     */
    unsetSingleManagerLayer() {
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

export const managerLayer: Module<LayerState, RootState> = {
    state, actions,
};
