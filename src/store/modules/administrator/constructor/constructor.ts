import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrl, baseUrlAPI} from '@/globals';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import ConstructorState from '@/store/modules/constructor/types';
import IConstructorTableGroup from '@/domain/interfaces/IConstructorTableGroup';

export const state: ConstructorState = {
    isTableExists: false,
    tableFields: [],
    additionalData: {},
    element: {
        id: 0,
        layer_id: 0,
        title: 'Новый элемент',
        description: '',
        address_id: 0,
        geometry: '',
        length: 0,
        area: 0,
        perimeter: 0,
        element_next_id: 0,
    },
};

export const mutations: MutationTree<ConstructorState> = {
    unsetAdditionalInfoValues() {
        state.element = {
            id: 0,
            layer_id: 0,
            title: 'Новый элемент',
            description: '',
            address_id: 0,
            geometry: '',
            length: 0,
            area: 0,
            perimeter: 0,
            element_next_id: 0,
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
            state.tableFields = resolveAdditionalData(res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const managerConstructor: Module<ConstructorState, RootState> = {
    state, actions, mutations,
};


function resolveAdditionalData(tableFields: IConstructorTableGroup[]) {
    return tableFields.map((field: IConstructorTableGroup) => {
        // TODO: Implement pattern to get rid of if code smell
        field.columns = field.columns.map((column) => {
            if (column.type === 'many_from_many_field') {
                column.value = JSON.parse(column.value);
            }
            return column;
        });

        field.groupTechName = field.group.replace(/\s+/g, '');
        return field;
    });
}
