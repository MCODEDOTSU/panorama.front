import IAddress from '@/domain/interfaces/IAddress';
import IModule from '@/domain/interfaces/IModule';

export default interface IContractor {
    id: number;
    name: string;
    full_name: string;
    inn: string;
    kpp: string;
    address: IAddress;
    logo: string;
    modules?: IModule[];
    edited?: boolean;
    childElsVisibility?: boolean;
}