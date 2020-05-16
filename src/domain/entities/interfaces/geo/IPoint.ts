import IAddress from '@/domain/interfaces/IAddress';

export default interface IPoint {
    id: number;
    title: string;
    description: string;
    address: IAddress;
    layer_id?: number;
}
