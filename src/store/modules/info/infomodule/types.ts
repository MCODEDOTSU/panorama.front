import IModule from '@/domain/interfaces/IModule';

export default interface InfoModuleState {
    infomodule: IModule;            // Модуль (например, безопаность)
    infomodules: IModule[];         // Модули (например, безопасность; тос; и т.д.)
    contractorModules: IModule[];   // Модули отдельного контрагента
}
