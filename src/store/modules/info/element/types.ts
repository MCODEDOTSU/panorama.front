import IElement from '@/domain/entities/interfaces/IElement';
import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export default interface ElementState {
    element: IElement;
    elements: IElement[];
    infoItems: IInfoItem[];
    infoItemsLists?: any; // TODO : xarrper
    compositions?: any;
}
