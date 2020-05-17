import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import ConstructorState from '@/store/modules/administrator/constructor/types';

export const state: ConstructorState = {
    isTableExists: false,
    tableFields: [],
};

export const actions: ActionTree<ConstructorState, RootState> = {

    /***
     * Проверить, сущетсвует ли таблица с доп. полями
     * @param dispatch
     * @param payload
     */
    async administratorConstructorGetByLayer({dispatch}, payload) {
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
    async administratorConstructorUpdate({}, payload) {
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
    administratorConstructorUnsetSingle() {
        try {
            state.isTableExists = false;
            state.tableFields = [];
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const administratorConstructor: Module<ConstructorState, RootState> = {
    state, actions,
};

