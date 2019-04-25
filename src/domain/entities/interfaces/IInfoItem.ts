import IAddress from '@/domain/entities/interfaces/IAddress';

export default interface IInfoItem {
    id: number;
    geotype: string;    // point, linestring, polygon
    title: string;
    description: string;
    address?: IAddress;
    edited?: boolean;
    add?: boolean;
    translated_title?: string; // Переведенное название элемента (например, для слоя "отключений")
    layer_composition_id?: number;
}
