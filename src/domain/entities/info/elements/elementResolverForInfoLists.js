export const elementResolverForInfoLists = (elements) => {
    const resolvedItems = [];
    const elementsArray = Object.values(elements);
    for (const element of elementsArray) {
        resolvedItems.push({
            id: element.id,
            title: element.title,
            description: element.description,
            points: fetchPoints(element.points),
            visiblePoints: false,
            layer_id: element.layer_id,
            edited: false,
        });
    }
    return resolvedItems;
};
const fetchPoints = (points) => {
    const infoItem = [];
    for (const point of points) {
        infoItem.push({
            id: point.id,
            geotype: 'point',
            title: point.title,
            description: point.description,
            address: point.address,
            edited: false,
            add: false,
        });
    }
    return infoItem;
};
//# sourceMappingURL=elementResolverForInfoLists.js.map