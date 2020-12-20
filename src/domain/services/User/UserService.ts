import IUser from '@/domain/interfaces/IUser';

export const userSignature = (user: IUser) => {
    if (!user || !user.email) {
        return '';
    }
    if (!user.person) {
        return `${user.email}`;
    }
    return `${user.post}, ${user.person.lastname} ${user.person.firstname} ${user.person.middlename}`;
};