import LeftMenuState from '@/store/modules/components/common/leftMenu/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';

export const state: LeftMenuState = {
    full: true,
};

export const actions: ActionTree<LeftMenuState, RootState> = {

    toggleLeftMenu() {
        state.full = !state.full;
    },

    getLeftMenuFull({}, payload) {
        state.full = payload.full;
    },

};

export const leftMenu: Module<LeftMenuState, RootState> = {
    state, actions,
};
