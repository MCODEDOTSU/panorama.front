import IModule from '@/domain/entities/interfaces/IModule';

export const manageContractorModules = (allModules: IModule[], includedModules: IModule[]) => {

    allModules.map((module: IModule) => {
        module.included = false;
    });

    allModules.map((module: IModule) => {
        for (const includedModule of includedModules) {
            if (module.id === includedModule.id) {
                module.included = true;
                break;
            }
        }
    });

    allModules.sort((x: any, y: any) => {
        return y.included - x.included;
    });

    return allModules;
};
