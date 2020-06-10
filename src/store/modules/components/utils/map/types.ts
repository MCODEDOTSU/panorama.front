import IStyle from '@/domain/interfaces/IStyle';
import IInteraction from '@/domain/util/interface/map/IInteraction';

export default interface MapState {
    properties: {
        longitude: number;
        latitude: number;
        zoom: number;
        selectorMapContainer: string;
    };
    map: any;
    source: any;
    layer: any;
    styles: IStyle[];
    interaction: IInteraction;
}
