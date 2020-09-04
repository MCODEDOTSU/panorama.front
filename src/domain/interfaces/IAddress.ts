import IRegion from '@/domain/interfaces/IRegion';

export default interface IAddress {
    id: number;
    build: string;
    city: string;
    region_id: number;
    region?: IRegion;
    street: string;
    district: string;
    index?: string | undefined;
}
