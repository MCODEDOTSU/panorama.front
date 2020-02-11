import InfoModuleState from '@/store/modules/info/infomodule/types';
import ConstructorState from '@/store/modules/constructor/types';

// TODO: Подумать над типами данных
export default interface RootState {
    applicationName?: string;
    infomodule?: InfoModuleState | any;
    konstructor?: ConstructorState | any;
}
