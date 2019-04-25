import axios from 'axios';
import { baseUrlAPI } from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import { editUpdatedItem, removeDeletedItem } from '@/domain/services/common/UpdateItemService';
export const state = {
    contractor: {
        id: 0,
        name: '',
        full_name: '',
        inn: '',
        kpp: '',
        address: {
            id: 0,
            build: '',
            city: '',
            region: '',
            street: '',
        },
    },
    contractors: [],
};
export const actions = {
    /**
     * Получить всех контрагентов
     */
    async getContractors() {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/contractor`);
            state.contractors = res.data;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Получить контрагента по ИД
     */
    async geContractorById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/contractor/${payload.id}`);
            state.contractor = Object.assign({}, res.data);
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Создать или обновить контрагента
     */
    async updateContractor() {
        try {
            if (state.contractor.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/contractor/${state.contractor.id}`, state.contractor);
                SuccessNotifier.notify('Данные сохранены', `Контрагент "${state.contractor.name}" изменен`);
                state.contractors = editUpdatedItem(state.contractors, res.data);
            }
            else {
                const res = await axios.post(`${baseUrlAPI}manager/contractor`, state.contractor);
                SuccessNotifier.notify('Данные сохранены', `Контрагент "${state.contractor.name}" создан`);
                state.contractors.push(res.data);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Удалить контрагента
     * @returns {Promise<void>}
     */
    async deleteContractor() {
        try {
            if (state.contractor.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/contractor/${state.contractor.id}`);
                SuccessNotifier.notify('Данные удалены', `Контрагент "${state.contractor.name}" удален`);
                state.contractors = removeDeletedItem(state.contractors, state.contractor);
            }
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Выделить
     * @param payload
     */
    setSingleContractor({}, payload) {
        state.contractor = Object.assign({}, state.contractor, payload);
    },
    /**
     * Отменить выделение
     */
    unsetSingleContractor() {
        state.contractor = {
            id: 0,
            name: '',
            full_name: '',
            inn: '',
            kpp: '',
            address: {
                id: 0,
                build: '',
                city: '',
                region: '',
                street: '',
            },
        };
    },
    /**
     * Привязать модуль к контрагенту
     * @param context
     * @param payload
     */
    async attachContractorToModule(context, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/contractor/${payload.parent}/attach/module/${payload.item}`);
            SuccessNotifier.notify('', 'Модуль подключен к контрагенту');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
    /**
     * Отвязать модуль от контрагента
     * @param context
     * @param payload
     */
    async detachContractorToModule(context, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/contractor/${payload.parent}/detach/module/${payload.item}`);
            SuccessNotifier.notify('', 'Модуль отключен от контрагента');
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const managerContractor = {
    state, actions,
};
//# sourceMappingURL=contractor.js.map