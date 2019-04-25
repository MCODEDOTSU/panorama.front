import IPaginationState from '@/store/modules/pagination/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import {makePages} from '@/domain/util/interface/Pagination';

export const state: IPaginationState = {
    currentPage: 1,
    lastPage: 0,
    pagesArray: [],
    pageCursor: '',
};

export const actions: ActionTree<IPaginationState, RootState> = {
    formPagination(context, payload) {
        state.lastPage = payload.lastPage;
        state.pagesArray = makePages(state.currentPage, state.lastPage);
    },
};

export const pagination: Module<IPaginationState, RootState> = {
    state, actions,
};
