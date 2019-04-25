import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { editUpdatedItem, removeDeletedItem } from '@/domain/services/common/UpdateItemService';
import axios from 'axios';
export const state = {
    module: {
        id: 0,
        title: '',
        description: '',
        layers: [],
        contractors: [],
    },
    modules: [],
};
export const actions = {
    /**
     * Получить все модули
     */
    async managerGetModules() {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/module`);
            state.modules = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Создать или обновить модуль
     */
    async updateModule() {
        try {
            if (state.module.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/module/${state.module.id}`, state.module);
                SuccessNotifier.notify('Данные сохранены', `Модуль "${state.module.title}" изменен`);
                state.modules = editUpdatedItem(state.modules, state.module);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}manager/module`, state.module);
                SuccessNotifier.notify('Данные сохранены', `Модуль "${state.module.title}" создан`);
                state.modules.push(Object.assign({}, state.module, res.data));
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить модуль
     * @returns {Promise<void>}
     */
    async deleteModule() {
        try {
            if (state.module.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/module/${state.module.id}`);
                SuccessNotifier.notify('Данные удалены', `Модуль "${state.module.title}" удален`);
                state.modules = removeDeletedItem(state.modules, state.module);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить модуль
     * @param payload
     */
    setSingleModule({}, payload) {
        state.module = Object.assign({}, state.module, payload);
    },
    /**
     * Отменить выделение модуля
     */
    unsetSingleModule() {
        state.module = {
            id: 0,
            title: '',
            description: '',
            layers: [],
            contractors: [],
        };
    },
};
export const managerModule = {
    state, actions,
};
//# sourceMappingURL=module.js.map