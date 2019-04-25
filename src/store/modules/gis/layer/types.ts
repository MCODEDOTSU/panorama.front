import ILayer from '@/domain/entities/interfaces/ILayer';

export default interface LayerState {
    layers: ILayer[];
    currentLayerIndex?: number;
    currentElementIndex?: number;
}
