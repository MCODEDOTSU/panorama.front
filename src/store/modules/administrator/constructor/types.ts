import IConstructorTableGroup from '@/domain/interfaces/IConstructorTableGroup';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: IConstructorTableGroup[];
}
