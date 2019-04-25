export const editUpdatedItem = (items: any, newItem: any) => {
    return items.map( (item: any) => {
        if (item.id === newItem.id) {
            item = Object.assign({}, item, newItem);
        }
        return item;
    });
};
export const removeDeletedItem = (items: any, deleteItem: any) => {
    return items.filter( (item: any) => {
        return (item.id !== deleteItem.id);
    });
};
