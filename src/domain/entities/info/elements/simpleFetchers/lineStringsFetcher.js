export const fetchLinestrings = (linestrings, resolvedItems) => {
    for (const linestring of linestrings) {
        resolvedItems.push({
            id: linestring.id,
            geotype: 'linestring',
            title: linestring.title,
            description: linestring.description,
            address: linestring.address,
            edited: false,
            add: false,
        });
    }
    return resolvedItems;
};
//# sourceMappingURL=lineStringsFetcher.js.map