import InfoModuleState from '@/store/modules/info/infomodule/types';
import ConstructorState from '@/store/modules/constructor/types';
import LayerState from '@/store/modules/gis/layer/types';

// TODO: Подумать над типами данных
export default interface RootState {
    applicationName?: string;
    infomodule?: InfoModuleState | any;
    konstructor?: ConstructorState | any;
    gisLayer?: LayerState | any;
}
