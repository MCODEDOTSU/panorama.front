export const fetchPolygons = (polygons, resolvedItems) => {
    for (const polygon of polygons) {
        resolvedItems.push({
            id: polygon.id,
            geotype: 'polygon',
            title: polygon.title,
            description: polygon.description,
            address: polygon.address,
            edited: false,
            add: false,
        });
    }
    return resolvedItems;
};
//# sourceMappingURL=polygonsFetcher.js.map