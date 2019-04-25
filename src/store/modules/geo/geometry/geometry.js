import axios from 'axios';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
export const state = {
    geometry: {
        id: 0,
        geom: '',
        title: '',
        description: '',
        element_id: 0,
        layer_composition_id: 0,
        data: {},
    },
    selectedGeometry: {
        id: 0,
        geom: '',
        title: '',
        description: '',
        element_id: 0,
        layer_composition_id: 0,
        data: {},
    },
};
export const actions = {
    /**
     * Сохранить измененноую геометрию точки, линии или полигона
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async setGeometry({ rootState, dispatch }, payload) {
        try {
            const res = await axios.put(`${baseUrlAPI}geo/geometry/${payload.id}`, {
                geom: payload.geom,
                type: payload.type,
            });
            SuccessNotifier.notify('Географический редактор', 'Геометрия обновлена');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Сохранить измененные свойства точкии, линии или полигона
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async setGeometryProperties({ rootState, dispatch }, payload) {
        try {
            const res = await axios.put(`${baseUrlAPI}geo/geometry/${payload.id}`, {
                title: payload.title,
                description: payload.description,
                type: payload.type,
            });
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Инициализация созджания новой точки, линии или полигона (присовение свойств)
     * @param rootState
     * @param dispatch
     * @param payload
     */
    initGeometry({ rootState, dispatch }, payload) {
        state.geometry = {
            id: 0,
            geom: '',
            title: (payload.type === 'point' ? 'Новая точка' : (payload.type === 'linestring' ? 'Новая линия' : 'Новый полигон')),
            description: '',
            element_id: payload.elementId,
            layer_composition_id: payload.compositionId,
            type: payload.type,
            data: {},
        };
    },
    /**
     * Сохранение новой точки, линии или полигона
     * @param rootState
     * @param dispatch
     * @param payload
     */
    async createGeometry({ rootState, dispatch }, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}geo/geometry`, {
                title: state.geometry.title,
                description: state.geometry.description,
                geom: payload.geom,
                element_id: state.geometry.element_id,
                layer_composition_id: state.geometry.layer_composition_id,
                type: state.geometry.type,
            });
            state.geometry.id = res.data.id;
            SuccessNotifier.notify('Географический редактор', `${res.data.title} создана`);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const geoGeometry = {
    state, actions,
};
//# sourceMappingURL=geometry.js.map