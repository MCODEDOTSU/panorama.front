export const newElementFormatter = (data) => {
    return {
        id: data.id,
        geotype: 'point',
        title: data.title,
        description: data.description,
        address: data.address,
        edited: false,
        add: false,
    };
};
export const translateElementFieldsForShutdowns = (infoElements) => {
    return infoElements.map((infoItem) => {
        switch (infoItem.title) {
            case 'hot_water':
                infoItem.translated_title = 'Горячая вода';
                break;
            case 'cold_water':
                infoItem.translated_title = 'Холодная вода';
                break;
            case 'gas':
                infoItem.translated_title = 'Газ';
                break;
            case 'heating':
                infoItem.translated_title = 'Отопление';
                break;
        }
        return infoItem;
    });
};
//# sourceMappingURL=ElementFormatter.js.map