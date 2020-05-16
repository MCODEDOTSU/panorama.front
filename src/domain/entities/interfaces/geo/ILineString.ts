import IAddress from '@/domain/interfaces/IAddress';

export default interface ILineString {
    id: number;
    title: string;
    description: string;
    address: IAddress;
}
