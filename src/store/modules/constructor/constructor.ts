import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import ConstructorState from '@/store/modules/constructor/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: ConstructorState = {
    isTableExists: false,
    tableFields: [],
};

export const actions: ActionTree<ConstructorState, RootState> = {
    async checkIfTableExists({dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${payload.layerId}`);
            state.isTableExists = res.data;
            dispatch('getTableInfo', { id: payload.layerId });
        } catch {
            ErrorNotifier.notify();
        }
    },

    async getTableInfo({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${payload.id}`);
            state.tableFields = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const constructor: Module<ConstructorState, RootState> = {
    state, actions,
};
