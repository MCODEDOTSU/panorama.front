interface IUser {
    id?: number | undefined;
    email: string | undefined;
    password?: string | undefined;
    repassword?: string | undefined;
    edited?: boolean;
    contractor_id?: number;
}

export default IUser;
