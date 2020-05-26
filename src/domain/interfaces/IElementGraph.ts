import IElement from '@/domain/interfaces/IElement';

export default interface IElementGraph {
    id: number;
    element_id: number;
    next_element_id: number;
    element?: IElement | null;
    next_element?: IElement | null;
}
