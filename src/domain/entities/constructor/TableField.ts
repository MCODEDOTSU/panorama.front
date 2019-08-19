export default interface TableField {
    type: string;
    title: string | [];
    tech_title: string;
    enums?: [];   // Значения для типов столбцов - один ко многим и многие ко многим
    required: boolean;
    value?: string;
}
