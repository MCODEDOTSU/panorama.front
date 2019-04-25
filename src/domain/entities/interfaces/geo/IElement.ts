import IGeometry from './IGeometry';
import IPoint from './IPoint';
import ILineString from './ILineString';
import IPolygon from './IPolygon';

export default interface IElement {
    id: number;
    title: string;
    description: string;
    layer_id: number;
    geometries: {
        points: IPoint[];
        linestrings: ILineString[];
        polygons: IPolygon[];
    };
    geometries_count: number;
    points_count: number;
    linestrings_count: number;
    polygons_count: number;
    checked?: boolean;
    points?: IPoint[];
    linestrings?: ILineString[];
    polygons?: IPolygon[];
}
