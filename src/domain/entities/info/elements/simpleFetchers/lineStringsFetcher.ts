import ILineString from '@/domain/entities/interfaces/geo/ILineString';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export const fetchLinestrings = (linestrings: ILineString[], resolvedItems: IInfoItem[]) => {
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
