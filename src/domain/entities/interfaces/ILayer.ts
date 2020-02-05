import IElement from './IElement';
import IStyle from '@/domain/util/interface/map/IStyle';

export default interface ILayer {
    id: number;
    alias?: string;
    title: string;
    description: string;
    parent_id: number;
    module_id?: number;
    elements?: IElement[];
    visibility: boolean;
    geometry_type: string;
    style?: IStyle;
    // ???
    checked?: boolean;
    hidden?: boolean;
}
