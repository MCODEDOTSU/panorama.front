import TableField from '@/domain/entities/constructor/TableField';
import IElementGraph from '@/domain/interfaces/IElementGraph';

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
    previous: IElementGraph | null;
    next?: IElementGraph;
    checked?: boolean;
    showGraph?: boolean;
    additionalData?: TableField[];
}
