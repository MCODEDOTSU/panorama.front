import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import ConstructorState from '@/store/modules/constructor/types';
import {baseUrlAPI} from '@/globals';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';

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
    unsetAdditionalInfoValues() {
        state.element = {
            id: 0,
            title: '',
        };
        for (const group of state.tableFields) {
            for (const column of group.columns) {
                column.value = '';
            }
        }
    },
};

export const actions: ActionTree<ConstructorState, RootState> = {

    /***
     * Проверить, сущетсвует ли таблица с доп. полями
     * @param dispatch
     * @param payload
     */
    async getConstructorByLayer({dispatch}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/${payload.layerId}`);
            state.isTableExists = res.data.length === 0 ? false : true;
            state.tableFields = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /***
     * Создать или обновить таблицу
     * @param payload
     */
    async updateConstructorTable({}, payload) {
        try {
            const plainizedFields = plainizeFields(state.tableFields);
            if (state.isTableExists === true) {
                const res = await axios.put(`${baseUrlAPI}constructor/${payload.layerId}`, {
                    columns: plainizedFields,
                });
                SuccessNotifier.notify('Данные сохранены', `Метаданные слоя обновлены`);
            } else {
                const res = await axios.post(`${baseUrlAPI}constructor/${payload.layerId}`, {
                    columns: plainizedFields,
                });
                state.isTableExists = true;
                SuccessNotifier.notify('Данные сохранены', `Метаданные слоя созданы`);
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /***
     * Очистить конструкт для нового слоя
     */
    unsetConstructorByLayer() {
        try {
            state.isTableExists = false;
            state.tableFields = [];
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
            const res = await axios.get(`${baseUrlAPI}constructor/${payload.layerId}/${state.element.id}`);
            state.isTableExists = res.data.length === 0 ? false : true;
            state.tableFields = res.data.map((field) => {
                field.columns = field.columns.map((column) => {
                    if (column.type === 'many_from_many_field') {
                        column.value = JSON.parse(column.value);
                    }
                    return column;
                });
                return field;
            });
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const konstructor: Module<ConstructorState, RootState> = {
    state, actions, mutations,
};
