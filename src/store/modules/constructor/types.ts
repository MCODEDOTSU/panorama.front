import TableField from '@/domain/entities/constructor/TableField';
import IElement from '@/domain/util/interface/map/IElement';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: TableField[];
    additionalData: any;
    element: IElement;
}
