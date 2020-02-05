import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { baseUrlAPI } from '@/globals';
import axios from 'axios';
export const state = {
    element: {
        id: 0,
        layer_id: 0,
        title: 'Новый элемент',
        description: '',
        geometry: '',
        length: 0,
        area: 0,
        perimeter: 0,
    },
};
export const actions = {
    /**
     * Создать или сохранить элемент
     */
    async updateElement({ rootState }) {
        try {
            if (state.element.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}gis/element/${state.element.id}`, {
                    title: state.element.title,
                    description: state.element.description,
                });
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" изменен`);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}gis/element`, {
                    title: state.element.title,
                    description: state.element.description,
                    layer_id: state.element.layer_id,
                });
                state.element = Object.assign({}, state.element, res.data);
                SuccessNotifier.notify('Данные сохранены', `Элемент "${state.element.title}" создан`);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Изменить геометрию элемента
     */
    async updateGeometry({ rootState }, payload) {
        try {
            if (payload.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}gis/geometry/${payload.id}`, {
                    geometry: payload.geometry,
                });
                SuccessNotifier.notify('Данные сохранены', `Геометрия элемента обновлена`);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить элемент
     * @param payload
     */
    setSingleElement({}, payload) {
        state.element = Object.assign({}, state.element, payload.element);
    },
    /**
     * Отменить выделение элемента
     */
    unsetSingleElement({}, payload) {
        state.element = {
            id: 0,
            layer_id: payload.layerId ? payload.layerId : 0,
            title: 'Новый элемент',
            description: '',
            geometry: '',
            length: 0,
            area: 0,
            perimeter: 0,
        };
    },
    /**
     * Удалить элемент
     */
    async deleteElement({}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}gis/element/${payload.elementId}`);
            SuccessNotifier.notify('Данные удалены', `Элемент "${payload.elementTitle}" удален`);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const gisElement = {
    state, actions,
};
//# sourceMappingURL=element.js.map