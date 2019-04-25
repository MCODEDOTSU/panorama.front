import IElement from '@/domain/entities/interfaces/geo/IElement';

export default interface GeoElementState {
    element: IElement;
    elements: any;
    selectedElement: IElement;
}
