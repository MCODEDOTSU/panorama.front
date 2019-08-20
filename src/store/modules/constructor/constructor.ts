import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import ConstructorState from '@/store/modules/constructor/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import UserState from '@/store/modules/user/types';
import Router from '@/router';

export const state: ConstructorState = {
    isTableExists: false,
    tableFields: [],
    additionalData: {},
    element: {
        id: 0,
        title: '',
    },
};

export const mutations: MutationTree<ConstructorState> = {
    getTableInfo(state, payload) {
        const resolvedResult = [];

        for (const singleField of payload.data) {
            if (singleField.enums) {
                singleField.enums = JSON.parse(singleField.enums);
            }

            resolvedResult.push(singleField);
        }

        state.tableFields = resolvedResult;
    },

};

export const actions: ActionTree<ConstructorState, RootState> = {
    async checkIfTableExists({dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${payload.layerId}`);
            state.isTableExists = res.data;
            dispatch('getTableInfo', {id: payload.layerId});
        } catch {
            ErrorNotifier.notify();
        }
    },

    async getTableInfo({commit, dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${payload.id}`);
            commit('getTableInfo', res);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить данные для дополнительных таблиц
     * По layerId - связанная таблица с дополнительными данными
     * По elementId - какому элементу они принадлежат
     */
    async getAdditionalData({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}additional_data/get_additional_data/${state.element.id}/${payload.layerId}`);
            if (res.data) {
                state.isTableExists = true;
            }

            state.tableFields = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const constructor: Module<ConstructorState, RootState> = {
    state, actions, mutations,
};
