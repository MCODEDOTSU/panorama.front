import { baseUrlAPI } from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
export const state = {
    isTableExists: false,
    tableFields: [],
    additionalData: {},
    element: {
        id: 0,
        title: '',
    },
};
export const actions = {
    async checkIfTableExists({ dispatch }, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${payload.layerId}`);
            state.isTableExists = res.data;
            dispatch('getTableInfo', { id: payload.layerId });
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    async getTableInfo({ dispatch }, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${payload.id}`);
            state.tableFields = res.data;
            // TODO: Убрать дополнительный запрос - присваивать value здесь
            dispatch('getAdditionalData', { layerId: payload.id });
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Получить данные для дополнительных таблиц
     * По layerId - связанная таблица с дополнительными данными
     * По elementId - какому элементу они принадлежат
     */
    async getAdditionalData({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}additional_data/get_additional_data/${state.element.id}/${payload.layerId}`);
            state.additionalData = res.data;
            // TODO: Совместить tableFields и additionalData
            for (const tableField of state.tableFields) {
                Object.keys(state.additionalData).forEach((additionalDataItem) => {
                    if (tableField.tech_title === additionalDataItem) {
                        console.log(state.additionalData[additionalDataItem]);
                        tableField.value = state.additionalData[additionalDataItem];
                    }
                });
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const constructor = {
    state, actions,
};
//# sourceMappingURL=constructor.js.map