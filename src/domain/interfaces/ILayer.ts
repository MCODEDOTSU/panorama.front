import IStyle from '@/domain/interfaces/IStyle';

export default interface ILayer {
    id: number;
    alias: string;
    title: string;
    description: string;
    parent_id: number;
    module_id: number;
    visibility: boolean;
    geometry_type: string;
    style?: IStyle;
}
