import axios from 'axios';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
export const state = {
    element: {
        id: 0,
        title: '',
        description: '',
        layer_id: 0,
        geometries: { points: [], linestrings: [], polygons: [] },
        points_count: 0,
        linestrings_count: 0,
        polygons_count: 0,
        geometries_count: 0,
    },
    elements: {},
    selectedElement: {
        id: 0,
        title: '',
        description: '',
        layer_id: 0,
        geometries: { points: [], linestrings: [], polygons: [] },
        points_count: 0,
        linestrings_count: 0,
        polygons_count: 0,
        geometries_count: 0,
    },
};
export const actions = {
    /**
     * Получить Элемент по ИД
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async getElementById({ rootState, dispatch }, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/element/${payload.elementId}`);
            state.element = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Получить элементы для слоя
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async getElementByLayer({ rootState, dispatch }, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}geo/elements/${payload.layerId}`);
            state.elements = Object.assign({}, res.data);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Сохранить элемент
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async setElementById({ rootState, dispatch }, payload) {
        try {
            const res = await axios.put(`${baseUrlAPI}geo/element/${payload.elementId}`, {
                title: state.element.title,
                description: state.element.description,
            });
            state.element = {
                id: 0,
                title: '',
                description: '',
                layer_id: 0,
                geometries: { points: [], linestrings: [], polygons: [] },
                points_count: 0,
                linestrings_count: 0,
                polygons_count: 0,
                geometries_count: 0,
            };
            SuccessNotifier.notify('Географический редактор', 'Элемент сохранен');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Очистить выбранный элемент
     */
    cleanElement() {
        state.element = {
            id: 0,
            title: '',
            description: '',
            layer_id: 0,
            geometries: { points: [], linestrings: [], polygons: [] },
            points_count: 0,
            linestrings_count: 0,
            polygons_count: 0,
            geometries_count: 0,
        };
    },
    /**
     * Создать новый элемент
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async createElement({ rootState, dispatch }, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}geo/element`, {
                title: 'Новый элемент',
                description: '',
                layer_id: payload.layerId,
            });
            state.element = {
                id: 0,
                title: '',
                description: '',
                layer_id: 0,
                geometries: { points: [], linestrings: [], polygons: [] },
                points_count: 0,
                linestrings_count: 0,
                polygons_count: 0,
                geometries_count: 0,
                checked: true,
            };
            state.element = Object.assign({}, state.element, res.data);
            SuccessNotifier.notify('Географический редактор', 'Новый элемент создан');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Поисе элементов по названию
     * @param rootState
     * @param payload
     */
    async searchElementsByTitle({ rootState }, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}geo/elements/search_by_title`, {
                title: payload.title,
            });
            const elements = res.data;
            // TODO: Убрать в сервис (подумать как дать осмысленное название)
            // TODO: Переделать на коллекцию объектов
            Object.keys(elements).forEach((key) => {
                const element = elements[key];
                const layer = rootState.geoLayer.layers[element.layer_id];
                layer.elements = Object.assign({}, rootState.geoLayer.layers[element.layer_id].elements, res.data);
                layer.elements[element.id].checked = true;
                layer.checked = true;
                Object.keys(layer.elements).forEach((i) => {
                    if (layer.elements[i].checked === false) {
                        layer.checked = false;
                    }
                });
                // TODO: Убрать for...in
                // for (let i in layer.elements) {
                //     if (layer.elements[i].checked === false) {
                //         layer.checked = false;
                //         break;
                //     }
                // }
                rootState.geoLayer.layers[element.layer_id] = Object.assign({}, layer);
            });
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Поисе элементов по названию
     * @param rootState
     * @param payload
     */
    async searchElementsByAddress({ rootState }, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}geo/elements/search_by_address`, {
                address: payload.address,
            });
            const elements = res.data;
            // TODO: Убрать в сервис (подумать как дать осмысленное название)
            // TODO: Переделать на коллекцию объектов
            Object.keys(elements).forEach((key) => {
                const element = elements[key];
                const layer = rootState.geoLayer.layers[element.layer_id];
                layer.elements = Object.assign({}, rootState.geoLayer.layers[element.layer_id].elements, res.data);
                layer.elements[element.id].checked = true;
                layer.checked = true;
                Object.keys(layer.elements).forEach((i) => {
                    if (layer.elements[i].checked === false) {
                        layer.checked = false;
                    }
                });
                // TODO: Убрать foreach
                // for (let i in layer.elements) {
                //     if (layer.elements[i].checked === false) {
                //         layer.checked = false;
                //         break;
                //     }
                // }
                rootState.geoLayer.layers[element.layer_id] = Object.assign({}, layer);
            });
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить элемент
     * @param rootState
     * @param payload
     */
    async deleteGeoElement({ rootState }, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}geo/element/${payload.elementId}`);
            SuccessNotifier.notify('Географический редактор', 'Элемент удален');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const geoElement = {
    state, actions,
};
//# sourceMappingURL=element.js.map