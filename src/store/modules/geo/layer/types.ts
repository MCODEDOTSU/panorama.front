import ILayer from '@/domain/entities/interfaces/ILayer';
import IComposition from '@/domain/entities/interfaces/IComposition';

export default interface GeoLayerState {
    layer: ILayer;
    layers: any;
    compositions?: any;
}
