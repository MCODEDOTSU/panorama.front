import IInfoItem from '@/domain/entities/interfaces/IInfoItem';
import IInfoItemForInfoList from '@/domain/entities/interfaces/IInfoItemForInfoList';

export default interface InfoItemState {
    infoItems: IInfoItem[];
    infoItemsLists: IInfoItemForInfoList[];
}
