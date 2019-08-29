import TableField from '@/domain/entities/constructor/TableField';

export default interface TableGroup {
    group: string;
    columns: TableField[];
}
