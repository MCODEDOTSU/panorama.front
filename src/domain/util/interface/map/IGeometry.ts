export default interface IGeometry {
    id: number;
    title: string;
    description?: string;
    geom: string;
    layer_composition_id: number;
    olFeature?: any;
}
