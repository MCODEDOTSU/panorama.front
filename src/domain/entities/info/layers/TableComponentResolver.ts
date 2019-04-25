import ILayer from '@/domain/entities/interfaces/ILayer';

export const tableComponentResolver = (layer: ILayer) => {
    for (const singleOrganizationComponentType of singleOrganizationComponentTypes) {
        if (layer.alias === singleOrganizationComponentType) {
            return 'single_organizations';
        }
    }

    for (const infoListsComponentType of infoListsComponentTypes) {
        if (layer.alias === infoListsComponentType) {
            return 'info_lists';
        }
    }

    for (const territoriesComponentType of territoriesComponentTypes) {
        if (layer.alias === territoriesComponentType) {
            return 'territories';
        }
    }

    for (const shutdownType of shutdownTypes) {
        if (layer.alias === shutdownType) {
            return 'shutdowns';
        }
    }
};

const singleOrganizationComponentTypes = [
    'safety_emergency',
    'safety_police_stations',
    'safety_police_men',
    'transport_stops',
    'trading_objects',
    'utilities_prog_repair',
    'utilities_prog_development',
];

const infoListsComponentTypes = [
    'transport_routes',
];

const territoriesComponentTypes = [
    'utilities_companies',
    'tos_area',
    'elections_points',
];

const shutdownTypes = [
    'disconnections_planned',
    'disconnections_emergency',
];


