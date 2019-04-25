/**
 * @param data - любой набор элементов
 * @param childEls - дочерние элементы
 */
export const addEditField = (data, childEls = null) => {
    return data.map((item) => {
        item.edited = false;
        item.childElsVisibility = false;
        if (item[childEls].length !== 0) {
            item[childEls].map((childEl) => {
                childEl.edited = false;
            });
        }
        return item;
    });
};
export const addEditFieldToSingleItem = (item) => {
    item.edited = false;
    item.childElsVisibility = false;
    return item;
};
//# sourceMappingURL=AdditionalFieldsService.js.map