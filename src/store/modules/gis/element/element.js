import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { baseUrlAPI } from '@/globals';
import axios from 'axios';
export const state = {
    element: {
        id: 0,
        title: 'Новый элемент',
        description: '',
        layer_id: 0,
        geometries: [],
        geometries_count: 0,
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
            title: 'Новый элемент',
            description: '',
            layer_id: payload.layerId,
            geometries: [],
            geometries_count: 0,
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