import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import ContractorTosState from '@/store/modules/administrator/contractorTos/types';

export const state: ContractorTosState = {
    contractorTos: {
        id: 0,
        contractor_id: 0,
        contractor: {
            id: 0,
            name: '',
            full_name: '',
        },
    },
    contractorsTos: [],
};

export const actions: ActionTree<ContractorTosState, RootState> = {

    async administratorContractorTosGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}tos`);
            state.contractorsTos = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosGetById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}tos/${payload.id}`);
            state.contractorTos = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosUpdate({}, payload) {
        try {
            if (state.contractorTos.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}tos/${state.contractorTos.id}`, state.contractorTos);
                SuccessNotifier.notify('Данные сохранены', `ТОС изменён`);
                state.contractorsTos = editUpdatedItem(state.contractorsTos, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}tos`, state.contractorTos);
                SuccessNotifier.notify('Данные сохранены', `Создан новый ТОС`);
                state.contractorsTos.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosAddAddress({}, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}tos/address/${state.contractorTos.id}`, { address: payload.address} );
            state.contractorTos.addresses.push(res.data);
            SuccessNotifier.notify('Адрес добавлен', `Адрес добавлен в список адресов ТОС`);
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosDeleteAddress({}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}tos/address/${state.contractorTos.id}/${payload.address.id}`);
            state.contractorTos.addresses = removeDeletedItem(state.contractorTos.addresses, payload.address);
            SuccessNotifier.notify('Адрес удален', `Адрес удален из списка адресов ТОС`);
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosDelete() {
        try {
            if (state.contractorTos.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}tos/${state.contractorTos.id}`);
                SuccessNotifier.notify('Данные удалены', `ТОС удалён`);
                state.contractorsTos = removeDeletedItem(state.contractorsTos, state.contractorTos);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    administratorContractorTosSetSingle({}, payload) {
        state.contractorTos = Object.assign({}, state.contractorTos, payload);
    },

    administratorContractorTosUnsetSingle() {
        state.contractorTos = {
            id: 0,
            contractor_id: 0,
            contractor: {
                id: 0,
                name: '',
                full_name: '',
            },
        };
    },

};

export const administratorContractorTos: Module<ContractorTosState, RootState> = {
    state, actions,
};
