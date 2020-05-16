import IConstructorTableField from '@/domain/interfaces/IConstructorTableField';

export default interface IConstructorTableGroup {
    group: string;
    groupTechName?: string;
    columns: IConstructorTableField[];
}
