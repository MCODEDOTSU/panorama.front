import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import ContractorTszhState from '@/store/modules/administrator/contractorTszh/types';

export const state: ContractorTszhState = {
    contractorTszh: {
        id: 0,
        contractor_id: 0,
        contractor: {
            id: 0,
            name: '',
            full_name: ''
        },
    },
    contractorTszhes: [],
};

export const actions: ActionTree<ContractorTszhState, RootState> = {

    async administratorContractorTszhGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}tszh`);
            state.contractorTszhes = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTszhUpdate({}, payload) {
        try {
            if (state.contractorTszh.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}tszh/${state.contractorTszh.id}`, state.contractorTszh);
                SuccessNotifier.notify('Данные сохранены', `ТСЖ изменено`);
                state.contractorTszhes = editUpdatedItem(state.contractorTszhes, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}tszh`, state.contractorTszh);
                SuccessNotifier.notify('Данные сохранены', `Создано новое ТСЖ`);
                state.contractorTszhes.push(res.data);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    async administratorContractorTszhDelete() {
        try {
            if (state.contractorTszh.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}tszh/${state.contractorTszh.id}`);
                SuccessNotifier.notify('Данные удалены', `ТСЖ удалёно`);
                state.contractorTszhes = removeDeletedItem(state.contractorTszhes, state.contractorTszh);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    administratorContractorTszhSetSingle({}, payload) {
        state.contractorTszh = Object.assign({}, state.contractorTszh, payload);
    },

    administratorContractorTszhUnsetSingle() {
        state.contractorTszh = {
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

export const administratorContractorTszh: Module<ContractorTszhState, RootState> = {
    state, actions,
};
