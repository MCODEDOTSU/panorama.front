import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { editUpdatedItem, removeDeletedItem } from '@/domain/services/common/UpdateItemService';
import axios from 'axios';
export const state = {
    composition: {
        id: 0,
        title: '',
        description: '',
        geometry_type: 'point',
        layer_id: 0,
        style: '',
    },
    compositions: [],
};
export const actions = {
    /**
     * Получить состав слоя
     */
    async getLayerCompositions({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/composition/${payload.layerId}`);
            state.compositions = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Создать или обновить композицию слоя
     */
    async updateLayerComposition() {
        try {
            if (state.composition.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/composition/${state.composition.id}`, state.composition);
                SuccessNotifier.notify('Данные сохранены', `Компонент слоя "${state.composition.title}" изменен`);
                state.compositions = editUpdatedItem(state.compositions, res.data);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}manager/composition`, state.composition);
                SuccessNotifier.notify('Данные сохранены', `Компонент слоя "${state.composition.title}" создан`);
                state.compositions.push(res.data);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить компонент слоя
     * @returns {Promise<void>}
     */
    async deleteLayerComposition() {
        try {
            if (state.composition.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/composition/${state.composition.id}`);
                SuccessNotifier.notify('Данные удалены', `Компонент слоя "${state.composition.title}" удален`);
                state.compositions = removeDeletedItem(state.compositions, state.composition);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить компонент слоя
     * @param payload
     */
    setSingleLayerComposition({}, payload) {
        state.composition = Object.assign({}, state.composition, payload);
    },
    /**
     * Отменить выделение компонента слоя
     */
    unsetSingleLayerComposition({}, payload) {
        state.composition = {
            id: 0,
            title: '',
            description: '',
            geometry_type: 'point',
            layer_id: payload.layerId,
            style: '',
        };
    },
};
export const managerLayerComposition = {
    state, actions,
};
//# sourceMappingURL=layerComposition.js.map