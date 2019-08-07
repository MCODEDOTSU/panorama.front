import IGeometry from './IGeometry';
import TableField from '@/domain/entities/constructor/TableField';

export default interface IElement {
    id: number;
    title: string;
    description: string;
    layer_id: number;
    geometries: IGeometry[];
    geometries_count: number;
    checked?: boolean;
    additionalData?: TableField[];
}
