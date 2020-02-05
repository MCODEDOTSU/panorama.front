import TableGroup from '@/domain/entities/constructor/TableGroup';

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

/**
 * Превратить погрупповой массив в простой
 * @param tableGroups
 */
export function plainizeFields(tableGroups: TableGroup[]) {
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


