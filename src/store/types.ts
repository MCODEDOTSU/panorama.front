import ConstructorState from '@/store/modules/manager/constructor/types';
import LayerState from '@/store/modules/gis/layer/types';

// TODO: Подумать над типами данных
export default interface RootState {
    applicationName?: string;
    managerConstructor?: ConstructorState | any;
    gisLayer?: LayerState | any;
}
