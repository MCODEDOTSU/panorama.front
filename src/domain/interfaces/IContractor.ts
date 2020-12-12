import IFiasAddress from '@/domain/interfaces/IFiasAddress';
import IModule from '@/domain/interfaces/IModule';

export default interface IContractor {
    id: number;
    name: string;
    full_name: string;
    inn?: string;
    kpp?: string;
    fias_address_id?: number;
    address?: IFiasAddress;
    addresses: IFiasAddress[];
    logo?: string;
    modules?: IModule[];
    edited?: boolean;
    childElsVisibility?: boolean;
    parent_id?: number;
}
