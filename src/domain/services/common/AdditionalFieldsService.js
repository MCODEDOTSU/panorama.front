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
/**
 * Превратить погрупповой массив в простой
 * @param tableGroups
 */
export function plainizeFields(tableGroups) {
    const plainizedColumns = [];
    for (const tableGroup of tableGroups) {
        for (const column of tableGroup.columns) {
            if (column.type === 'many_from_many_field') {
                column.value = JSON.stringify(column.value);
            }
            plainizedColumns.push(column);
        }
    }
    return plainizedColumns;
}
//# sourceMappingURL=AdditionalFieldsService.js.map