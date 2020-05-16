import IUser from '@/domain/interfaces/IUser';

export default interface UserState {
    user: IUser;
    users: IUser[];
}
