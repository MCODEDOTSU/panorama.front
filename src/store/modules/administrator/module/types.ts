import IModule from '@/domain/interfaces/IModule';

export default interface ModuleState {
    module: IModule;
    modules: IModule[];
}
