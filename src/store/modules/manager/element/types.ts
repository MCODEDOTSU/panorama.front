import IElement from '@/domain/entities/interfaces/IElement';

export default interface ElementState {
    element: IElement;
    elements: IElement[];
}
