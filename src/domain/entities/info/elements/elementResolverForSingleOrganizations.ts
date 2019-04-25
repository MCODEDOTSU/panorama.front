import IElement from '@/domain/entities/interfaces/geo/IElement';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';
import {fetchPoints} from '@/domain/entities/info/elements/simpleFetchers/pointsFetcher';
import {fetchLinestrings} from '@/domain/entities/info/elements/simpleFetchers/lineStringsFetcher';
import {fetchPolygons} from '@/domain/entities/info/elements/simpleFetchers/polygonsFetcher';

export const elementResolverForSingleOrganizations = (elements: IElement[]) => {
    let resolvedItems: IInfoItem[] = [];

    for (const element of elements) {
        if (element.points) {
            resolvedItems = fetchPoints(element.points, resolvedItems);
        }

        if (element.linestrings) {
            resolvedItems = fetchLinestrings(element.linestrings, resolvedItems);
        }

        if (element.polygons) {
            resolvedItems = fetchPolygons(element.polygons, resolvedItems);
        }

    }

    return resolvedItems;
};
