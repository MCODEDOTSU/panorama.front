export const manageContractorModules = (allModules, includedModules) => {
    allModules.map((module) => {
        module.included = false;
    });
    allModules.map((module) => {
        for (const includedModule of includedModules) {
            if (module.id === includedModule.id) {
                module.included = true;
                break;
            }
        }
    });
    allModules.sort((x, y) => {
        return y.included - x.included;
    });
    return allModules;
};
//# sourceMappingURL=ContractorServices.js.map