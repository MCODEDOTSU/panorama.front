import IUser from '@/domain/interfaces/IUser';

export default interface UserState {
    user: IUser;        // Пользователь
    token: string;      // Токен для проверки возможности обращения к определенным маршрутам
    users: IUser[];     // Перечень пользователей
    role: string;
}
