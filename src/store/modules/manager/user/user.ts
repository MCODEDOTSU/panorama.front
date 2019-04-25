import axios from 'axios';
import {ActionTree, Module} from 'vuex';
import {baseUrlAPI} from '@/globals';
import UserState from '@/store/modules/manager/user/types';
import RootState from '@/store/types';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';


export const state: UserState = {
    user: {
        id: 0,
        email: '',
        password: '',
    },
    users: [],
};

export const actions: ActionTree<UserState, RootState> = {

    /**
     * Получить всех пользователей для контрагента
     */
    async getUsersByContractor({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}manager/user/${payload.contractorId}`);
            state.users = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Сохранить изменения в пользователе или создать нового
     */
    async updateUser() {
        try {
            if (state.user.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}manager/user`, state.user);
                SuccessNotifier.notify('Данные сохранены', `Пользователь "${state.user.email}" изменен`);
                state.users = editUpdatedItem(state.users, state.user);
            } else {
                const res = await axios.post(`${baseUrlAPI}manager/user`, state.user);
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
    async deleteUser() {
        try {
            if (state.user.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}manager/user/${state.user.id}`);
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
    setSingleUser({}, payload) {
        state.user = Object.assign({}, state.user, payload);
    },

    /**
     * Отменить выделение пользователя
     */
    unsetSingleUser({}, payload) {
        state.user = { id: 0, email: '', password: '', contractor_id: payload.contractorId };
    },

};

export const managerUser: Module<UserState, RootState> = {
    state, actions,
};
