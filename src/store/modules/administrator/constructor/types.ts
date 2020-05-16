import IElement from '@/domain/interfaces/IElement';
import IConstructorTableGroup from '@/domain/interfaces/IConstructorTableGroup';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: IConstructorTableGroup[];
    additionalData: any;
    element: IElement;
}
