import IElement from '@/domain/interfaces/IElement';

export default interface ElementState {
    element: IElement;
    elements: IElement[];
    magicElement: {
        active: boolean;
        index: number;
        element?: IElement;
    };
    // Параметры пагинации и поиска элементов
    paginator: {
        count: number;
        current: number;
        limit: number;
    },
    search: '',
}
