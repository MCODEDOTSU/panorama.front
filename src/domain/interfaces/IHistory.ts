import IUser from '@/domain/interfaces/IUser';

interface IHistory {
    id: number;
    text: string;
    type: string;
    create_user_id: number;
    update_user_id: number | null;
    create_user: IUser | null;
    update_user: IUser | null;
    created_at: string;
    updated_at: string;
}

export default IHistory;
