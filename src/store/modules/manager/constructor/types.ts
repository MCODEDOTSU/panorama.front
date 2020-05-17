import IConstructorTableGroup from '@/domain/interfaces/IConstructorTableGroup';
import IElement from '@/domain/interfaces/IElement';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: IConstructorTableGroup[];
    additionalData: any;
    element: IElement;
}
