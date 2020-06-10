import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import Router from '@/router';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import UserState from '@/store/modules/user/types';

export const state: UserState = {
    user: {
        id: 0,
        email: '',
        firstname: '',
        lastname: '',
        middlename: '',
        post: '',
        photo: '',
        role: 'admin',
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
        if (Router.currentRoute.name === 'home') {
            Router.push({name: 'manager-cabinet'});
            // if (state.role === 'superadmin') {
            //     Router.push({name: 'administrator-contractors'});
            // } else {
            //     Router.push({name: 'manager-cabinet'});
            // }
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
        axios.get(`${baseUrlAPI}user`).then((response) => {
            const payload = response.data;
            state.role = response.data.role;
            commit('getUser', payload);
        }, () => {
            state.token = '';
            Router.push({name: 'home'});
            // ErrorNotifier.notify();
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

    async logout({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}logout`);
            state.user = {
                id: 0,
                email: '',
                firstname: '',
                lastname: '',
                middlename: '',
                post: '',
                photo: '',
                role: 'admin',
                password: '',
            };
            state.users = [];
            state.token = '';
            state.role = '';
            Router.push({name: 'home'});
        } catch {
            Router.push({name: 'home'});
        }
    },

};

export const user: Module<UserState, RootState> = {
    state,
    mutations,
    actions,
};
