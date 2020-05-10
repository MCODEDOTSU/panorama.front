interface IUser {
    id?: number | undefined;
    email: string | undefined;
    firstname: string | undefined;
    lastname: string | undefined;
    middlename: string | undefined;
    post: string | undefined;
    photo: string | undefined;
    role: string | undefined;
    password?: string | undefined;
    repassword?: string | undefined;
    edited?: boolean;
    contractor_id?: number;
}

export default IUser;
