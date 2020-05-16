import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrl, baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import UserState from '@/store/modules/administrator/user/types';


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
};

export const actions: ActionTree<UserState, RootState> = {

    /**
     * Получить всех пользователей для контрагента
     */
    async administratorUserGetAllByContractor({}, payload) {
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
    async administratorUserUpdate() {
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
    async administratorUserDelete() {
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
            firstname: '',
            lastname: '',
            middlename: '',
            post: '',
            photo: '',
            password: '',
            role: 'admin',
            contractor_id: payload.contractorId,
        };
    },

    /**
     * Загрузка фотографии
     * @param payload
     */
    async administratorUserUploadPhoto({}, payload) {

        const formData = new FormData();
        formData.append('file', payload.file);

        try {
            const res = await axios.post(`${baseUrlAPI}manager/user/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            state.user.photo = `${baseUrl}${res.data.filename}`;
            SuccessNotifier.notify('Загрузка завершена', `Изображение "${payload.file.name}" загружено на сервер`);
        } catch {
            ErrorNotifier.notify();
        }

    },

};

export const administratorUser: Module<UserState, RootState> = {
    state, actions,
};
