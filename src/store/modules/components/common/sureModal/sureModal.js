export const state = {
    modal: {
        title: 'Вы уверены?',
        text: 'Вы уверены, что хотите удалить этот элемент?',
        buttonOk: 'Да, удалить',
        buttonCansel: 'Отменить',
        action: ({}),
    },
};
export const actions = {
    /**
     * Установить параметры диалогового окна: заголовок, текст, текст кнопок, действие
     * @param payload
     */
    setSureModal({}, payload) {
        state.modal = Object.assign({}, state.modal, payload);
    },
};
export const sureModal = {
    state, actions,
};
//# sourceMappingURL=sureModal.js.map