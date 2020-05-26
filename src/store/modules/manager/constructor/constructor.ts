import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import IConstructorTableGroup from '@/domain/interfaces/IConstructorTableGroup';
import ConstructorState from '@/store/modules/manager/constructor/types';

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
        previous: null,
    },
};

export const actions: ActionTree<ConstructorState, RootState> = {

    /***
     * Проверить, сущетсвует ли таблица с доп. полями
     * @param dispatch
     * @param payload
     */
    async managerConstructorGetByLayer({dispatch}, payload) {
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
    async managerConstructorGetAdditionalData({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}constructor/${payload.layerId}/${state.element.id}`);
            state.isTableExists = res.data.length === 0 ? false : true;
            state.tableFields = resolveAdditionalData(res.data);
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Очистить все дополнительные данные
     */
    managerConstructorUnsetAdditionalData() {
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
            previous: null,
        };
        for (const group of state.tableFields) {
            for (const column of group.columns) {
                column.value = '';
            }
        }
    },
};

export const managerConstructor: Module<ConstructorState, RootState> = {
    state, actions,
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
