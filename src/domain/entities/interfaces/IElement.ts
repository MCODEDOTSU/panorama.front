import IGeometry from './IGeometry';

export default interface IElement {
    id: number;
    title: string;
    description: string;
    layer_id: number;
    geometries: IGeometry[];
    geometries_count: number;
    checked?: boolean;
}
