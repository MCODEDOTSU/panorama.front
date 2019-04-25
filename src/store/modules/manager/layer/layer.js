import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { editUpdatedItem, removeDeletedItem } from '@/domain/services/common/UpdateItemService';
import axios from 'axios';
export const state = {
    layer: {
        id: 0,
        title: '',
        description: '',
        parent_id: 0,
        module_id: 0,
    },
    layers: [],
};
export const actions = {
    /**
     * Получить все слои
     */
    async managerGetLayers() {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer`);
            state.layers = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Получить слой по ИД
     */
    async getLayerById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/layer/${payload.id}`);
            state.layer = Object.assign({}, res.data);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Создать или обновить слой
     */
    async updateLayer() {
        try {
            if (state.layer.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/layer/${state.layer.id}`, state.layer);
                SuccessNotifier.notify('Данные сохранены', `Слой "${state.layer.title}" изменен`);
                state.layers = editUpdatedItem(state.layers, res.data);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}manager/layer`, state.layer);
                SuccessNotifier.notify('Данные сохранены', `Слой "${state.layer.title}" создан`);
                state.layers.push(res.data);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить слой
     * @returns {Promise<void>}
     */
    async deleteLayer() {
        try {
            if (state.layer.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/layer/${state.layer.id}`);
                SuccessNotifier.notify('Данные удалены', `Слой "${state.layer.title}" удален`);
                state.layers = removeDeletedItem(state.layers, state.layer);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить слой
     * @param payload
     */
    setSingleLayer({}, payload) {
        state.layer = Object.assign({}, state.layer, payload);
    },
    /**
     * Отменить выделение слоя
     */
    unsetSingleLayer() {
        state.layer = {
            id: 0,
            title: '',
            description: '',
            parent_id: 0,
            module_id: 0,
        };
    },
};
export const managerLayer = {
    state, actions,
};
//# sourceMappingURL=layer.js.map