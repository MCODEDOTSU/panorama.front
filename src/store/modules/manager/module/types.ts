import IModule from '@/domain/entities/interfaces/IModule';

export default interface ModuleState {
    module: IModule;
    modules: IModule[];
}
