import Router from '@/router';
import {ActionTree, Module, MutationTree} from 'vuex';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import RootState from '@/store/types';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import UserState from '@/store/modules/user/types';

export const state: UserState = {
    user: {
        id: 0,
        email: '',
        password: '',
    },
    users: [],
    token: '',
    role: '',
};

export const mutations: MutationTree<UserState> = {

    /**
     * Получение пользователя - и после этого редирект на рабочий стол
     * @param state
     * @param payload
     */
    getUser(state, payload) {
        state.user = payload;
        if (state.role === 'superadmin') {
            Router.push({name: 'manager-contractors'});
        } else {
            Router.push({name: 'manager-contractors-modules'});
        }
    },

};

export const actions: ActionTree<UserState, RootState> = {

    /**
     * Получение залогиненного пользователя с сервера
     * @param {any} commit
     * @param state
     * @param dispatch
     * @returns {any}
     */
    getUser({commit, state, dispatch}): any {
        axios.get(baseUrlAPI + 'user').then((response) => {
            const payload = response.data;
            commit('getUser', payload);
        }, () => {
            ErrorNotifier.notify();
        });
    },

    async getNewToken({}, payload) {
        try {
            const url = `${baseUrlAPI}refresh`;
            const result = await axios.post(url, state.user);
            state.token = 'Bearer ' + result.data.token;
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const user: Module<UserState, RootState> = {
    state,
    mutations,
    actions,
};
