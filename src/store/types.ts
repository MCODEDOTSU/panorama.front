import ConstructorState from '@/store/modules/manager/constructor/types';

// TODO: Подумать над типами данных
export default interface RootState {
    applicationName?: string;
    managerConstructor?: ConstructorState | any;
}
