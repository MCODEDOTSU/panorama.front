import IInfoItem from '@/domain/entities/interfaces/IInfoItem';

export default interface IElementForTerritories {
    id: number;
    title: string;
    description: string;
    geometries?: IInfoItem[];
    edited?: boolean;
    add?: boolean;
    visiblePoints: boolean;
    layer_id: number;
}
