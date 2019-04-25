import InfoModuleState from '@/store/modules/info/infomodule/types';
import GeoLayerState from '@/store/modules/geo/layer/types';
import GeoElementState from '@/store/modules/geo/element/types';
import GeoGeometryState from '@/store/modules/geo/geometry/types';

export default interface RootState {
    applicationName?: string;
    infomodule?: InfoModuleState;
    geoLayer?: GeoLayerState;
    geoElement?: GeoElementState;
    geoGeometry?: GeoGeometryState;
}
