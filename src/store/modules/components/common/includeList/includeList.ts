import IncludeListState from '@/store/modules/components/common/includeList/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import {arrayFindFirst} from '@/domain/services/common/ArrayActions';

export const state: IncludeListState = {
    parent: 0,
    list: [],
    actions: {},
};

export const actions: ActionTree<IncludeListState, RootState> = {

    /**
     * Установить значения списка
     * @param payload
     */
    setIncludeList({}, payload) {

        state.list = [];
        payload.list.forEach((item) => {

            const findItem = arrayFindFirst(item[payload.key], payload.parent);

            state.list.push({
                id: item.id,
                title: item.title,
                checked: (findItem !== false),
            });
        });

        state.parent = payload.parent;

    },

    /**
     * Установить методы, срабатываемые при переключении
     * @param payload
     */
    setIncludeListActions({}, payload) {
        if (payload.attach) {
            state.actions.attach = payload.attach;
        }
        if (payload.detach) {
            state.actions.detach = payload.detach;
        }
    },

    /**
     * Переключение
     * @param payload
     */
    toggleIncludeItem({}, payload) {
        if (payload.item.checked && state.actions.attach) {
            if (state.actions.attach) {
                state.actions.attach({parent: state.parent, item: payload.item.id});
            }
        } else if (state.actions.detach) {
            state.actions.detach({parent: state.parent, item: payload.item.id});
        }
    },

};

export const includeList: Module<IncludeListState, RootState> = {
    state, actions,
};
