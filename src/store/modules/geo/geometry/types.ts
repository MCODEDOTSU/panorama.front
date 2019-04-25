import IGeometry from '@/domain/entities/interfaces/geo/IGeometry';

export default interface GeoGeometryState {
    geometry: IGeometry;
    selectedGeometry: IGeometry;
}
