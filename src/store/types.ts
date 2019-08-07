import InfoModuleState from '@/store/modules/info/infomodule/types';
import GeoLayerState from '@/store/modules/geo/layer/types';
import GeoElementState from '@/store/modules/geo/element/types';
import GeoGeometryState from '@/store/modules/geo/geometry/types';
import ConstructorState from '@/store/modules/constructor/types';

// TODO: Подумать над типами данных
export default interface RootState {
    applicationName?: string;
    infomodule?: InfoModuleState | any;
    geoLayer?: GeoLayerState | any;
    geoElement?: GeoElementState | any;
    geoGeometry?: GeoGeometryState | any;
    constructor?: ConstructorState | any;
}
