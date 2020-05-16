export default interface IElement {
    id: number;
    layer_id: number;
    title: string;
    description: string;
    address_id: number;
    geometry: string;
    length: number;
    area: number;
    perimeter: number;
    element_next_id: number;
    checked?: boolean;
}
