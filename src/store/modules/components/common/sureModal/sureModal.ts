import SureModalState from '@/store/modules/components/common/sureModal/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';

export const state: SureModalState = {
    modal: {
        title: 'Вы уверены?',
        text: 'Вы уверены, что хотите удалить этот элемент?',
        buttonOk: 'Да, удалить',
        buttonCansel: 'Отменить',
        action: false,
        actionCansel: false,
    },
};

export const actions: ActionTree<SureModalState, RootState> = {

    /**
     * Установить параметры диалогового окна: заголовок, текст, текст кнопок, действие
     * @param payload
     */
    setSureModal({}, payload) {
        state.modal = Object.assign({}, {
            title: 'Вы уверены?',
            text: 'Вы уверены, что хотите удалить этот элемент?',
            buttonOk: 'Да, удалить',
            buttonCansel: 'Отменить',
            action: false,
            actionCansel: false,
        }, payload);
    },

};

export const sureModal: Module<SureModalState, RootState> = {
    state, actions,
};
