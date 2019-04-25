import axios from 'axios';
import GeoLayerState from '@/store/modules/geo/layer/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: GeoLayerState = {
    layer: {
        id: 0,
        module_id: 0,
        title: '',
        description: '',
        parent_id: 0,
        elements: [],
        style: {},
    },
    layers: {},
    compositions: {},
};

export const actions: ActionTree<GeoLayerState, RootState> = {

    /**
     * Получить список всех слоев
     */
    async getLayers() {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/layers`);
            const layers = Object.assign({}, res.data);

            Object.keys(layers).forEach((i: any) => {
                layers[i].checked = false;

                Object.keys(layers[i].elements).forEach((j: any) => {
                    layers[i].elements[j].checked = false;
                });
            });

            // TODO: Переделать на коллекцию объектов. Попробовать убрать вложенность for
            // for (const i in layers) {
            //     layers[i].checked = false;
            //     for (const j in layers[i].elements) {
            //         layers[i].elements[j].checked = false;
            //     }
            // }
            state.layers = Object.assign({}, layers);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить список всех слоев для менеджера (редактирование)
     */
    async getManagerLayers() {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/layers/manager`);
            const layers = Object.assign({}, res.data);

            Object.keys(layers).forEach((i: any) => {
                layers[i].checked = false;

                Object.keys(layers[i].elements).forEach((j: any) => {
                    layers[i].elements[j].checked = false;
                });
            });

            // TODO: Переделать на коллекцию объектов. Попробовать убрать вложенность for
            // for (const i in layers) {
            //     layers[i].checked = false;
            //     for (const j in layers[i].elements) {
            //         layers[i].elements[j].checked = false;
            //     }
            // }
            state.layers = Object.assign({}, layers);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить данные одного элемента слоя
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async getLayersElement({rootState, dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/element/${payload.elementId}`);
            state.layers[res.data.layer_id].elements[res.data.id] = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить всю геометрию слоя
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async getGeometriesByLayer({rootState, dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/elements/${payload.layerId}`);
            state.layers[payload.layerId].elements = Object.assign({}, res.data);
            state.layers[payload.layerId].checked = true;

            Object.keys(state.layers[payload.layerId].elements).forEach((i: any) => {
                state.layers[payload.layerId].elements[i].checked = true;
            });

            // TODO: Исправить for на Object.keys
            // for (const i in state.layers[payload.layerId].elements) {
            //     state.layers[payload.layerId].elements[i].checked = true;
            // }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить всю геометрию элемента
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async getGeometriesByElement({rootState, dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/element/${payload.elementId}`);
            const layer = state.layers[payload.layerId];

            layer.elements = Object.assign({}, state.layers[payload.layerId].elements);
            layer.elements[payload.elementId] = res.data;
            layer.elements[payload.elementId].checked = true;
            layer.checked = true;

            // TODO: Переделать на коллекцию объектов.
            for (const i in layer.elements) {
                if (layer.elements[i].checked === false) {
                    layer.checked = false;
                    break;
                }
            }
            state.layers[payload.layerId] = Object.assign({}, layer);

            // Выделяем элемент в списке
            rootState.geoElement.selectedElement = res.data;
            // Выделяем геометрию элемента
            if (res.data.points_count !== 0) {

                // TODO: Переделать на коллекцию объектов.
                const key = Object.keys(res.data.geometries.points)[0];
                rootState.geoGeometry.selectedGeometry = Object.assign({}, res.data.geometries.points[key]);
            } else if (res.data.linestrings_count !== 0) {
                const key = Object.keys(res.data.geometries.linestrings)[0];
                rootState.geoGeometry.selectedGeometry = Object.assign({}, res.data.geometries.linestrings[key]);
            } else if (res.data.polygons_count !== 0) {
                const key = Object.keys(res.data.geometries.polygons)[0];
                rootState.geoGeometry.selectedGeometry = Object.assign({}, res.data.geometries.polygons[key]);
            }

        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Снять отметку слоя
     * TODO: Переименовать слой - назвать uncheckLayer
     * @param rootState
     * @param dispatch
     * @param payload
     */
    uncheckedLayer({rootState, dispatch}, payload) {
        const layer = state.layers[payload.layerId];
        layer.checked = false;

        // Переделано на Object.keys
        Object.keys(layer.elements).forEach((i: any) => {
            layer.elements[i].checked = false;
        });

        // TODO: Переделать in на for
        // for (const i in layer.elements) {
        //     layer.elements[i].checked = false;
        // }

        state.layers[payload.layerId] = Object.assign({}, layer);
    },

    /**
     * Снять отмутку с элемента
     * @param rootState
     * @param dispatch
     * @param payload
     */
    uncheckedElement({rootState, dispatch}, payload) {
        const layer = state.layers[payload.layerId];
        layer.checked = false;
        layer.elements[payload.elementId].checked = false;
        state.layers[payload.layerId] = Object.assign({}, layer);
    },

    /**
     * Отменить выделение всех элементов
     */
    uncheckAllElements() {
        // TODO: Переделать на коллекцию объектов. Убрать вложенность for. Вывести в отдельный класс.
        Object.keys(state.layers).forEach((key) => {
            const layer = state.layers[key];
            layer.checked = false;

            Object.keys(layer.elements).forEach((el) => {
                layer.elements[el].checked = false;
            });

            state.layers[key] = Object.assign({}, layer);
        });
    },

    /**
     * Получить список всех композиций
     */
    async getAllLayerComposition() {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/composition`);
            state.compositions = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const geoLayer: Module<GeoLayerState, RootState> = {
    state, actions,
};
