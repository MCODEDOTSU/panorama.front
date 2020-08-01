import IAddress from '@/domain/interfaces/IAddress';

export default interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
    middlename: string;
    date_of_birth: string;
    address_id: number | undefined;
    address?: IAddress;
    phones: string;
    note: string;
}
