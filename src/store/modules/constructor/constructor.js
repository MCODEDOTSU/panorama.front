import { baseUrlAPI } from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
export const state = {
    isTableExists: false,
};
export const actions = {
    async isTableExists({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${payload.layerId}`);
            state.isTableExists = res.data;
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