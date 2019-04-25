import { makePages } from '@/domain/util/interface/Pagination';
export const state = {
    currentPage: 1,
    lastPage: 0,
    pagesArray: [],
    pageCursor: '',
};
export const actions = {
    formPagination(context, payload) {
        state.lastPage = payload.lastPage;
        state.pagesArray = makePages(state.currentPage, state.lastPage);
    },
};
export const pagination = {
    state, actions,
};
//# sourceMappingURL=pagination.js.map