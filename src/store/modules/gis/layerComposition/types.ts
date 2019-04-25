import IComposition from '@/domain/entities/interfaces/IComposition';
import IStyle from '@/domain/util/interface/map/IStyle';

export default interface LayerCompositionState {
    compositions: IComposition[];
    styles: IStyle[];
}
