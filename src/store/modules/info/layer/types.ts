import ILayer from '../../../../domain/entities/interfaces/ILayer';

export default interface LayerState {
    layer: ILayer;
    layers: ILayer[];
}
