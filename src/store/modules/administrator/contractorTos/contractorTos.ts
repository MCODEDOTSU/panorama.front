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
            full_name: ''
        },
    },
    contractorToses: [],
};

export const actions: ActionTree<ContractorTosState, RootState> = {

    async administratorContractorTosGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}tos`);
            state.contractorToses = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosUpdate({}, payload) {
        try {
            if (state.contractorTos.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}tos/${state.contractorTos.id}`, state.contractorTos);
                SuccessNotifier.notify('Данные сохранены', `ТОС изменён`);
                state.contractorToses = editUpdatedItem(state.contractorToses, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}tos`, state.contractorTos);
                SuccessNotifier.notify('Данные сохранены', `Создан новый ТОС`);
                state.contractorToses.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTosDelete() {
        try {
            if (state.contractorTos.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}tos/${state.contractorTos.id}`);
                SuccessNotifier.notify('Данные удалены', `ТОС удалён`);
                state.contractorToses = removeDeletedItem(state.contractorToses, state.contractorTos);
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
                full_name: ''
            },
        };
    },

};

export const administratorContractorTos: Module<ContractorTosState, RootState> = {
    state, actions,
};
