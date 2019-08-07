import { baseUrlAPI } from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
export const state = {
    isTableExists: false,
    tableFields: [],
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
    async getTableInfo({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${payload.id}`);
            state.tableFields = res.data;
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