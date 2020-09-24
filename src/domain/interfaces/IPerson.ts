import IFiasAddress from '@/domain/interfaces/IFiasAddress';

export default interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
    middlename: string;
    date_of_birth?: string;
    fias_address_id: number;
    address: IFiasAddress;
    phones?: string;
    note?: string;
    post?: string;
    photo?: string;
}
