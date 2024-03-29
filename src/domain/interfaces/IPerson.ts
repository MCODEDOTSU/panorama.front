import IFiasAddress from '@/domain/interfaces/IFiasAddress';
import IHistory from '@/domain/interfaces/IHistory';

export default interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
    middlename: string;
    date_of_birth?: string;
    fias_address_id: number;
    address?: IFiasAddress;
    phones?: string;
    history?: IHistory[];
    post?: string;
    photo?: string;
    passport_series?: string;
    passport_number?: string;
    passport_issued_by?: string;
    passport_issued_when?: string;
    passport_department_number?: string;
    own?: string;
    status?: string;
}
