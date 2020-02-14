export default interface TableField {
    id?: number;
    type: string;
    title: string | [];
    tech_title: string;
    enums?: [];   // Значения для типов столбцов - один ко многим и многие ко многим
    required: boolean;
    value?: string;
    group?: string;
    is_deleted: boolean;
    table_identifier?: string;
    options?: IOptions; // Различные дополнительные опции
}

interface IOptions {
    quantity?: number; // Кол-во возможно загружаемых документов
    min?: number; // Минимальное кол-во для выбора опций многие из многих
    max?: number; // Максимальное кол-во для выбора опций многие из многих
    default?: any; // Опции выбранные изначально по умолчанию для многие из многих
}
