import axios from 'axios';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
export const state = {
    infomodule: {
        id: 0,
        title: '',
        description: '',
        layers: [],
    },
    infomodules: [],
    contractorModules: [],
};
export const actions = {
    /**
     * Получить модули пользователя
     */
    async getModules() {
        try {
            const res = await axios.get(`${baseUrlAPI}modules`);
            state.infomodules = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Получить все модули
     */
    async getAllModules() {
        try {
            const res = await axios.get(`${baseUrlAPI}all_modules`);
            state.infomodules = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const infomodule = {
    state, actions,
};
//# sourceMappingURL=infomodule.js.map