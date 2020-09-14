import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrl, baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import UserState from '@/store/modules/administrator/user/types';
import IAddress from '@/domain/interfaces/IAddress';

export const state: UserState = {
    user: {
        id: 0,
        email: '',
        post: '',
        photo: '',
        role: 'admin',
        password: '',
    },
    users: [],
};

export const actions: ActionTree<UserState, RootState> = {

    /**
     * Получить всех пользователей для контрагента
     */
    async administratorUserGetAllByContractor({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}user/${payload.contractorId}`);
            state.users = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Сохранить изменения в пользователе или создать нового
     */
    async administratorUserUpdate() {
        try {
            if (state.user.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}user`, state.user);
                SuccessNotifier.notify('Данные сохранены', `Пользователь "${state.user.email}" изменен`);
                state.users = editUpdatedItem(state.users, state.user);
            } else {
                const res = await axios.post(`${baseUrlAPI}user`, state.user);
                SuccessNotifier.notify('Данные сохранены', `Пользователь "${state.user.email}" создан`);
                state.users.push(state.user);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить пользователя
     */
    async administratorUserDelete() {
        try {
            if (state.user.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}user/${state.user.id}`);
                SuccessNotifier.notify('Данные удалены', `Пользователь "${state.user.email}" удален`);
                state.users = removeDeletedItem(state.users, state.user);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить пользователя
     * @param payload
     */
    administratorUserSetSingle({}, payload) {
        state.user = Object.assign({}, state.user, payload);
    },

    /**
     * Отменить выделение пользователя
     */
    administratorUserUnsetSingle({}, payload) {
        state.user = {
            id: 0,
            email: '',
            post: '',
            photo: '',
            password: '',
            role: 'admin',
            contractor_id: payload.contractorId,
        };
    },

};

export const administratorUser: Module<UserState, RootState> = {
    state, actions,
};
