import TableField from '@/domain/entities/constructor/TableField';

export default interface ConstructorState {
    isTableExists: boolean;
    tableFields: TableField[];
}
