export default interface IGeometry {
    id: number;
    title: string;
    description?: string;
    layer_id: number;
    length?: number;
    perimeter?: number;
    area?: number;
    address_id?: number;
    city?: string;
    street?: string;
    build?: string;
    geom?: string;
    type: string;
    element_id?: number;
}
