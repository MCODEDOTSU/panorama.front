import ILayer from '@/domain/entities/interfaces/ILayer';
import IStyle from '@/domain/util/interface/map/IStyle';

export default interface LayerState {
    layers: ILayer[];
    currentLayerIndex?: number;
    currentElementIndex?: number;
    styles: IStyle[];
}
