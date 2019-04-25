import IComposition from '@/domain/entities/interfaces/IComposition';

export default interface LayerCompositionState {
    composition: IComposition;
    compositions: IComposition[];
}
