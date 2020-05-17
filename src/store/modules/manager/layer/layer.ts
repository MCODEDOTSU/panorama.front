import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import LayerState from '@/store/modules/manager/layer/types';

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
     * Получить все доступные контрагенту слои слои
     */
    async managerLayerGetByContractor() {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer/contractor/get`);
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
     * Получить слой по ИД
     */
    async managerLayerGetById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer/${payload.id}`);
            state.layer = Object.assign({}, res.data, { style: JSON.parse(res.data.style) });
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить
     * @param payload
     */
    managerLayerSetSingle({}, payload) {
        state.layer = Object.assign({}, payload.layer);
    },

    /**
     * Отменить выделение
     */
    managerLayerUnsetSingle() {
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
