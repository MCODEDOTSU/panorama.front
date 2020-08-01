import IAddress from '@/domain/interfaces/IAddress';
import IContractor from '@/domain/interfaces/IContractor';
import IPerson from '@/domain/interfaces/IPerson';

interface IUser {
    id?: number | undefined;
    email: string | undefined;
    password?: string | undefined;
    repassword?: string | undefined;
    post: string | undefined;
    photo: string | undefined;
    role: string | undefined;
    edited?: boolean;
    contractor_id?: number;
    contractor?: IContractor | undefined;
    contractor_address?: IAddress | undefined;
    person_id?: number | undefined;
    person?: IPerson;
}

export default IUser;
