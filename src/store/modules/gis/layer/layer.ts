import LayerState from '@/store/modules/gis/layer/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import {arrayIndexOf} from '@/domain/services/common/ArrayActions';

export const state: LayerState = {
    layers: [],
};

export const actions: ActionTree<LayerState, RootState> = {

    /**
     * Получить все доступные для чтения слои
     */
    async gisGetLayers() {
        try {
            const res = await axios.get(`${baseUrlAPI}gis/layer`);
            state.layers = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить все доступные для редактирования слои
     */
    async gisGetLayersToContractor() {
        try {
            const res = await axios.get(`${baseUrlAPI}gis/layer/contractor`);
            state.layers = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделяем элемент
     */
    async selectedElement({}, payload) {
        const i = payload.i;
        const j = payload.j;
        try {
            const element = state.layers[i].elements[j];
            if (!element.geometries) {
                const res = await axios.get(`${baseUrlAPI}gis/element/geometries/${element.id}`);
                element.geometries = res.data;
                state.layers[i].elements[j] = Object.assign({}, element);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделяем слой
     */
    async selectedLayer({}, payload) {
        const i = payload.i;
        try {
            const layer = state.layers[payload.i];
            const res = await axios.get(`${baseUrlAPI}gis/layer/geometries/${layer.id}`);
            res.data.forEach((geometry) => {
                const j = arrayIndexOf(layer.elements, geometry.element_id);
                layer.elements[j].geometries.push(geometry);
            });
            state.layers[payload.i] = Object.assign({}, layer);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Индекс текущего выбранного слоя и элемента
     * @param payload
     */
    setCurrentIndex({}, payload) {
        state.currentLayerIndex = payload.layerIndex;
        state.currentElementIndex = payload.elementIndex;
    },

    /**
     * Сбросить индекс текущего выбранного слоя и элемента
     */
    unsetCurrentIndex() {
        delete state.currentLayerIndex;
        delete state.currentElementIndex;
    },

};

export const gisLayer: Module<LayerState, RootState> = {
    state, actions,
};
