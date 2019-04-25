import ILayer from '@/domain/entities/interfaces/ILayer';
import IContractor from '@/domain/entities/interfaces/IContractor';

export default interface IModule {
    id: number;
    title: string;
    description: string;
    layers: ILayer[];
    contractors?: IContractor[];
    included?: boolean; // Атрибут - подключен ли модуль для контрагента
}
