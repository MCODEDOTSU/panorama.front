/**
 * @param data - любой набор элементов
 * @param childEls - дочерние элементы
 */
export const addEditField = (data: any, childEls: any = null) => {
    return data.map( (item: any) => {
        item.edited = false;
        item.childElsVisibility = false;

        if (item[childEls].length !== 0) {
            item[childEls].map((childEl: any) => {
                childEl.edited = false;
            });
        }

        return item;
    });
};

export const addEditFieldToSingleItem = (item: any) => {
    item.edited = false;
    item.childElsVisibility = false;
    return item;
};
