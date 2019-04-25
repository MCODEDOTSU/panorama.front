import IGeometry from './IGeometry';

export default interface IElement {
    id: number;
    title: string;
    geometries: IGeometry[];
}
