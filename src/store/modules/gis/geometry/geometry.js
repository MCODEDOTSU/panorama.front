import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { baseUrlAPI } from '@/globals';
import axios from 'axios';
export const state = {
    geometry: {
        id: 0,
        title: 'Новый геообъект',
        description: '',
        layer_composition_id: 0,
        geom: '',
        type: 'point',
    },
};
export const actions = {
    /**
     * Создать или сохранить геометрию
     */
    async updateGeometry({}, payload) {
        try {
            if (state.geometry.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}gis/geometry/${payload.type}/${state.geometry.id}`, {
                    title: state.geometry.title,
                    description: state.geometry.description,
                    geom: state.geometry.geom,
                });
                state.geometry = Object.assign({}, state.geometry, res.data);
                SuccessNotifier.notify('Данные сохранены', `Геообъект "${state.geometry.title}" изменен`);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}gis/geometry/${payload.type}`, {
                    title: state.geometry.title,
                    description: state.geometry.description,
                    element_id: payload.elementId,
                    layer_composition_id: state.geometry.layer_composition_id,
                    geom: state.geometry.geom,
                });
                state.geometry = Object.assign({}, state.geometry, res.data);
                SuccessNotifier.notify('Данные сохранены', `Новый геообъект "${state.geometry.title}" создан`);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить геометрию
     * @param payload
     */
    async deleteGeometry({}, payload) {
        try {
            await axios.delete(`${baseUrlAPI}gis/geometry/${payload.type}/${state.geometry.id}`);
            SuccessNotifier.notify('Данные удалены', `Геообъект "${state.geometry.title}" удален`);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить геометрию
     * @param payload
     */
    setSingleGeometry({}, payload) {
        state.geometry = Object.assign({}, state.geometry, payload);
    },
    /**
     * Отменить выделение геометрии
     */
    unsetSingleGeometry({}, payload) {
        state.geometry = {
            id: 0,
            title: 'Новый геообъект',
            description: '',
            layer_composition_id: payload.layer_composition_id,
            geom: '',
            type: payload.type,
        };
    },
};
export const gisGeometry = {
    state, actions,
};
//# sourceMappingURL=geometry.js.map