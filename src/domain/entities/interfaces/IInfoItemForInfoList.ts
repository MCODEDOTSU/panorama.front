import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export default interface IInfoItemForInfoList {
    id: number;
    title: string;
    description: string;
    points?: IInfoItem[];
    edited?: boolean;
    add?: boolean;
    visiblePoints: boolean;
    layer_id: number;
}
