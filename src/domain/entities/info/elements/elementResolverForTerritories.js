export const elementResolverForTerritories = (elements) => {
    const resolvedItems = [];
    const elementsArray = Object.values(elements);
    for (const element of elementsArray) {
        resolvedItems.push({
            id: element.id,
            title: element.title,
            description: element.description,
            geometries: fetchPoints(element),
            visiblePoints: false,
            layer_id: element.layer_id,
            edited: false,
        });
    }
    return resolvedItems;
};
const fetchPoints = (geometries) => {
    const infoItem = [];
    const geotypes = [
        { type: 'point', name: 'points' },
        { type: 'linestring', name: 'linestrings' },
        { type: 'polygon', name: 'polygons' },
    ];
    for (const geotype of geotypes) {
        for (const geo of geometries[geotype.name]) {
            infoItem.push({
                id: geo.id,
                geotype: geotype.type,
                title: geo.title,
                description: geo.description,
                address: geo.address,
                edited: false,
                add: false,
            });
        }
    }
    return infoItem;
};
//# sourceMappingURL=elementResolverForTerritories.js.map