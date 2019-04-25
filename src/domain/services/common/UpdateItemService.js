export const editUpdatedItem = (items, newItem) => {
    return items.map((item) => {
        if (item.id === newItem.id) {
            item = Object.assign({}, item, newItem);
        }
        return item;
    });
};
export const removeDeletedItem = (items, deleteItem) => {
    return items.filter((item) => {
        return (item.id !== deleteItem.id);
    });
};
//# sourceMappingURL=UpdateItemService.js.map