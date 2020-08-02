export interface IIncludeList {
    id: number;
    title: string;
    checked: boolean;
    validByParent: boolean;
}

export default interface IncludeListState {
    parent: number;
    list: IIncludeList[];
    actions: {
        attach?: any;
        detach?: any;
    };
}
