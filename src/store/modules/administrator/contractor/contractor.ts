import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrl, baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import ContractorState from '@/store/modules/administrator/contractor/types';

export const state: ContractorState = {
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
        logo: '',
        parent_id: 0,
    },
    contractors: [],
};

export const actions: ActionTree<ContractorState, RootState> = {

    /**
     * Получить всех контрагентов
     */
    async administratorContractorGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}contractor`);
            state.contractors = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить контрагента по ИД
     */
    async administratorContractorGetById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}contractor/${payload.id}`);
            state.contractor = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить контрагента
     */
    async administratorContractorUpdate() {
        try {
            if (state.contractor.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}contractor`, state.contractor);
                SuccessNotifier.notify('Данные сохранены', `Контрагент "${state.contractor.name}" изменен`);
                state.contractors = editUpdatedItem(state.contractors, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}contractor`, state.contractor);
                SuccessNotifier.notify('Данные сохранены', `Контрагент "${state.contractor.name}" создан`);
                state.contractors.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить контрагента
     * @returns {Promise<void>}
     */
    async administratorContractorDelete() {
        try {
            if (state.contractor.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}contractor/${state.contractor.id}`);
                SuccessNotifier.notify('Данные удалены', `Контрагент "${state.contractor.name}" удален`);
                state.contractors = removeDeletedItem(state.contractors, state.contractor);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить
     * @param payload
     */
    administratorContractorSetSingle({}, payload) {
        state.contractor = Object.assign({}, state.contractor, payload);
    },

    /**
     * Отменить выделение
     */
    administratorContractorUnsetSingle() {
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
            logo: '',
        };
    },

    /**
     * Привязать модуль к контрагенту
     * @param context
     * @param payload
     */
    async administratorContractorAttachToModule(context, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}contractor/${payload.parent}/attach/module/${payload.item}`);
            SuccessNotifier.notify('', 'Модуль подключен к контрагенту');
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Отвязать модуль от контрагента
     * @param context
     * @param payload
     */
    async administratorContractorDetachToModule(context, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}contractor/${payload.parent}/detach/module/${payload.item}`);
            SuccessNotifier.notify('', 'Модуль отключен от контрагента');
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Загрузка логотипа
     * @param payload
     */
    async administratorContractorUploadLogo({}, payload) {

        const formData = new FormData();
        formData.append('file', payload.file);

        try {
            const res = await axios.post(`${baseUrlAPI}contractor/upload`, formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            state.contractor.logo = `${baseUrl}${res.data.filename}`;
            SuccessNotifier.notify('Загрузка завершена', `Изображение "${payload.file.name}" загружено на сервер`);
        } catch {
            ErrorNotifier.notify();
        }

    },

    async detachParentContractor({state}, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}contractor/detach_parent_contractor`, payload);
            SuccessNotifier.notify('', 'Родительский контрагент удален');
            state.contractor.parent_id = null;
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const administratorContractor: Module<ContractorState, RootState> = {
    state, actions,
};
