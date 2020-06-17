import IElement from '@/domain/interfaces/IElement';

export default interface ElementState {
    element: IElement;
    elements: IElement[];
    paginator: {
        count: number;
        current: number;
        limit: number;
    },
    magicElement: {
        active: boolean;
        index: number;
        element?: IElement;
    };
}
