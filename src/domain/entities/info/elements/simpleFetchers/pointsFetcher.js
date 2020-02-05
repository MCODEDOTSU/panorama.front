export const fetchPoints = (points, resolvedItems) => {
    for (const point of points) {
        resolvedItems.push({
            id: point.id,
            geotype: 'point',
            title: point.title,
            description: point.description,
            address: point.address,
            edited: false,
            add: false,
            layer_id: point.layer_id,
        });
    }
    return resolvedItems;
};
//# sourceMappingURL=pointsFetcher.js.map