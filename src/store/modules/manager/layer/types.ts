import ILayer from '@/domain/interfaces/ILayer';
import IStyle from '@/domain/interfaces/IStyle';

export default interface LayerState {
    layer: ILayer;
    layers: ILayer[];
    styles: IStyle[];
}
