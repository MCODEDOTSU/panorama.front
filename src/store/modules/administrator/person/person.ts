import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrl, baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {editUpdatedItem, removeDeletedItem} from '@/domain/services/common/UpdateItemService';
import PersonState from '@/store/modules/administrator/person/types';

export const state: PersonState = {
    person: {
        id: 0,
        firstname: '',
        lastname: '',
        middlename: '',
        date_of_birth: '',
        phones: '',
        post: '',
        photo: '',
        fias_address_id: 0,
        address: {
            id: 0,
            unrestricted_value: '',
        },
    },
    persons: [],
};

export const actions: ActionTree<PersonState, RootState> = {

    /**
     * Получить список физических лиц
     */
    async administratorPersonGetAll() {
        try {
            const res = await axios.get(`${baseUrlAPI}person`);
            state.persons = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить ФЛ по ИД
     */
    async administratorPersonGetById({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}person/${payload.id}`);
            state.person = Object.assign({}, res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Создать или обновить ФЛ
     */
    async administratorPersonUpdate() {
        try {
            if (state.person.id !== 0) {
                const res = await axios.put(`${baseUrlAPI}person/${state.person.id}`, state.person);
                SuccessNotifier.notify('Данные сохранены', `Физическое Лицо "${state.person.lastname} ${state.person.firstname}" изменено`);
                state.persons = editUpdatedItem(state.persons, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}person`, state.person);
                SuccessNotifier.notify('Данные сохранены', `Создано Физическое Лицо "${state.person.lastname} ${state.person.firstname}"`);
                state.persons.push(res.data);
                state.person.id = res.data.id;
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Удалить ФЛ
     * @returns {Promise<void>}
     */
    async administratorPersonDelete() {
        try {
            if (state.person.id !== 0) {
                const res = await axios.delete(`${baseUrlAPI}person/${state.person.id}`);
                SuccessNotifier.notify('Данные удалены', `Физическое Лицо "${state.person.lastname} ${state.person.firstname}" удалено`);
                state.persons = removeDeletedItem(state.persons, state.person);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить
     * @param payload
     */
    administratorPersonSetSingle({}, payload) {
        state.person = Object.assign({}, state.person, payload);
    },

    /**
     * Отменить выделение
     */
    administratorPersonUnsetSingle() {
        state.person = {
            id: 0,
            firstname: '',
            lastname: '',
            middlename: '',
            date_of_birth: '',
            phones: '',
            post: '',
            photo: '',
            fias_address_id: 0,
            address: {
                id: 0,
                unrestricted_value: '',
            },
        };
    },

    /**
     * Загрузка фотографии
     * @param payload
     */
    async administratorPersonUploadPhoto({}, payload) {

        const formData = new FormData();
        formData.append('file', payload.file);

        try {
            const res = await axios.post(`${baseUrlAPI}person/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            state.person.photo = res.data.filename;
            SuccessNotifier.notify('Загрузка завершена', `Изображение "${payload.file.name}" загружено на сервер`);
        } catch {
            ErrorNotifier.notify();
        }

    },

};

export const administratorPerson: Module<PersonState, RootState> = {
    state, actions,
};
