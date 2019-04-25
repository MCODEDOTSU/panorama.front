import IPolygon from '@/domain/entities/interfaces/geo/IPolygon';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export const fetchPolygons = (polygons: IPolygon[], resolvedItems: IInfoItem[]) => {
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
