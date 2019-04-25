import IElement from './IElement';
import IComposition from './IComposition';

export default interface ILayer {
    id: number;
    title: string;
    description: string;
    parent_id: number;
    module_id?: number;
    elements?: IElement[];
    composition?: IComposition[];
    style?: object;
    alias?: string;
    checked?: boolean;
    hidden?: boolean;
}
