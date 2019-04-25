import IElement from '@/domain/entities/interfaces/geo/IElement';
import IInfoItemForInfoList from '@/domain/entities/interfaces/IInfoItemForInfoList';
import IPoint from '@/domain/entities/interfaces/geo/IPoint';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export const elementResolverForInfoLists = (elements: IElement[]) => {
    const resolvedItems: IInfoItemForInfoList[] = [];
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

const fetchPoints = (points: IPoint[]) => {
    const infoItem: IInfoItem[] = [];

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
