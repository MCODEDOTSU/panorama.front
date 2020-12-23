import HistoryState from '@/store/modules/components/utils/history/types';
import { ActionTree, Module } from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: HistoryState = {
    history: {
        id: 0,
        text: '',
        type: 'user',
        create_user_id: 0,
        update_user_id: null,
        create_user: null,
        update_user: null,
        created_at: '',
        updated_at: '',
    },
    histories: [],
};

export const actions: ActionTree<HistoryState, RootState> = {

    /**
     * Получить историю
     *
     * @param state
     * @param payload
     */
    setHistories({state}, payload) {
        state.histories = payload.histories;
    },

    async addHistory({state}, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}${payload.object}/history/${payload.id}`, {
                text: state.history.text,
            });
            state.histories = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async removeHistory({state}, payload) {
        try {
            const res = await axios.delete(`${baseUrlAPI}${payload.object}/history/${payload.id}/${state.history.id}`);
            if (res.data === false) {
                ErrorNotifier.notifyWithCustomMessage('Невозможно удалить системную запись');
            } else {
                state.histories = res.data;
            }
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Выделить
     */
    setHistory({}, payload) {
        state.history = Object.assign({}, state.history, payload);
    },

    /**
     * Снять выделение
     */
    unsetHistory() {
        state.history = {
            id: 0,
            text: '',
            type: 'user',
            create_user_id: 0,
            update_user_id: null,
            create_user: null,
            update_user: null,
            created_at: '',
            updated_at: '',
        };
    },
};

export const history: Module<HistoryState, RootState> = {
    state, actions,
};
