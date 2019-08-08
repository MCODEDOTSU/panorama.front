export default interface TableField {
    type: string;
    title: string;
    tech_title: string;
    new_tech_title?: string;
    required: boolean;
    value?: string;
}
