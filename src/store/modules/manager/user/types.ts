import IUser from '@/domain/entities/interfaces/IUser';

export default interface UserState {
    user: IUser;
    users: IUser[];
}
