export default interface IGeometry {
    id: number;
    geom: string;
    title: string;
    description: string;
    element_id: number;
    layer_id: number;
    data: any;
    type?: string;
    address?: string;
}
