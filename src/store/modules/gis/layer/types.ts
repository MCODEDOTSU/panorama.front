import ILayer from '@/domain/entities/interfaces/ILayer';
import IStyle from '@/domain/interfaces/IStyle';

export default interface LayerState {
    layers: ILayer[];
    currentLayerIndex?: number;
    currentElementIndex?: number;
    styles: IStyle[];
}
