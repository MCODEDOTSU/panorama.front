import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import ConstructorState from '@/store/modules/constructor/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: ConstructorState = {
    isTableExists: false,
};

export const actions: ActionTree<ConstructorState, RootState> = {
    async isTableExists({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${payload.layerId}`);
            state.isTableExists = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const constructor: Module<ConstructorState, RootState> = {
    state, actions,
};
