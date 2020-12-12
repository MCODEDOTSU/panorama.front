import PhonesState from '@/store/modules/components/utils/phones/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';

export const state: PhonesState = {
    phone: {
        type: 'Мобильный',
        value: '',
    },
    phones: [],
};

export const actions: ActionTree<PhonesState, RootState> = {
    /**
     * Задать список телефонов
     * @param state
     * @param payload
     */
    setPhones({state}, payload) {
        if (!payload.phones) {
            state.phones = [];
        } else {
            const phones = JSON.parse(payload.phones);
            state.phones = typeof phones !== 'object' ? [ { type: 'Мобильный', value: phones } ] : phones;
        }
    },
    /**
     * Добавить телефон в список
     * @param state
     * @param payload
     */
    addPhone({state}, payload) {
        if (!state.phone.value && !payload.phone) {
            return;
        }
        state.phone.value = payload.phone ? payload.phone : state.phone.value;
        state.phones.push(state.phone);
    },
    /**
     * Удалить телефон по индексу
     * @param state
     * @param payload
     */
    removePhone({state}, payload) {
        state.phones.splice(payload.index, 1);
    },
    /**
     * Очистить поле ввода нового телефона
     */
    unsetPhone() {
        state.phone = {
            type: state.phone.type,
            value: '',
        };
    },
};

export const phones: Module<PhonesState, RootState> = {
    state, actions,
};
