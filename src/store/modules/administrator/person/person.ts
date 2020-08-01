import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
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
        address_id: 0,
        phones: '',
        note: '',
        address: {
            id: 0,
            build: '',
            city: '',
            region: '',
            street: '',
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
                const res = await axios.put(`${baseUrlAPI}person`, state.person);
                SuccessNotifier.notify('Данные сохранены', `Физическое Лицо "${state.person.lastname} ${state.person.firstname}" изменено`);
                state.persons = editUpdatedItem(state.persons, res.data);
            } else {
                const res = await axios.post(`${baseUrlAPI}person`, state.person);
                SuccessNotifier.notify('Данные сохранены', `Создано Физическое Лицо "${state.person.lastname} ${state.person.firstname}"`);
                state.persons.push(res.data);
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
            address_id: 0,
            phones: '',
            note: '',
            address: {
                id: 0,
                build: '',
                city: '',
                region: '',
                street: '',
            },
        };
    },

};

export const administratorPerson: Module<PersonState, RootState> = {
    state, actions,
};
