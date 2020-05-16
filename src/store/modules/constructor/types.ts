import IElement from '@/domain/interfaces/IElement';
import TableGroup from '@/domain/entities/constructor/TableGroup';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: TableGroup[];
    additionalData: any;
    element: IElement;
}
