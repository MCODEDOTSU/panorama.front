import IPoint from '@/domain/entities/interfaces/geo/IPoint';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export const fetchPoints = (points: IPoint[], resolvedItems: IInfoItem[]) => {
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
