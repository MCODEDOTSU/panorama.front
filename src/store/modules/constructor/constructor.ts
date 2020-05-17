import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import ConstructorState from '@/store/modules/constructor/types';
import {baseUrl, baseUrlAPI} from '@/globals';
import {plainizeFields} from '@/domain/services/common/AdditionalFieldsService';
import axios from 'axios';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import TableGroup from '@/domain/entities/constructor/TableGroup';

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


function resolveAdditionalData(tableFields: TableGroup[]) {
    return tableFields.map((field: TableGroup) => {
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
