import IFiasAddress from '@/domain/interfaces/IFiasAddress';

export default interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
    middlename: string;
    date_of_birth?: string;
    fias_address_id: number;
    address?: IFiasAddress;
    phones?: string;
    note?: string;
    post?: string;
    photo?: string;
    passport_series?: string;
    passport_number?: string;
    passport_issued_by?: string;
    passport_issued_when?: string;
    passport_department_number?: string;
    own?: string;
}
