import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Manager from './views/Manager.vue';

// Administrator
import AdministratorContractors from './views/administrator/contractors/Contractors.vue';
import AdministratorSingleContractor from './views/administrator/contractors/SingleContractor.vue';
import AdministratorContractorsMo from './views/administrator/contractorsMo/ContractorsMo.vue';
import AdministratorSingleContractorsMo from './views/administrator/contractorsMo/SingleContractorMo.vue';
import AdministratorContractorsTos from './views/administrator/contractorsTos/ContractorsTos.vue';
import AdministratorSingleContractorsTos from './views/administrator/contractorsTos/SingleContractorTos.vue';
import AdministratorContractorsTszh from './views/administrator/contractorsTszh/ContractorsTszh.vue';
import AdministratorSingleContractorsTszh from './views/administrator/contractorsTszh/SingleContractorTszh.vue';
import AdministratorPersons from './views/administrator/persons/Persons.vue';
import AdministratorSinglePerson from './views/administrator/persons/SinglePerson.vue';
import AdministratorUsers from './views/administrator/contractors/Users.vue';
import AdministratorModules from './views/administrator/modules/Modules.vue';
import AdministratorLayers from './views/administrator/layers/Layers.vue';
import KMZParser from './views/administrator/parser/KMZParser.vue';
import XLSParser from './views/administrator/parser/XLSParser.vue';

// Manager
import Cabinet from './views/manager/Cabinet.vue';
import ManagerLayers from './views/manager/layers/Layers.vue';
import ManagerElements from './views/manager/layers/Elements.vue';
import ManagerGis from './views/manager/gis/Gis.vue';

Vue.use(Router);

export default new Router({

    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/', name: 'home', component: Home, meta: {roles: []},
        },
        {
            path: '/manager', name: 'manager', component: Manager,
            children: [

                //  Administrator
                {
                    path: '/administrator/contractors', name: 'administrator-contractors',
                    component: AdministratorContractors, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/contractor/:id', name: 'administrator-single-contractor',
                    component: AdministratorSingleContractor, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/mo', name: 'administrator-contractors-mo',
                    component: AdministratorContractorsMo, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/mo/:id', name: 'administrator-single-contractors-mo',
                    component: AdministratorSingleContractorsMo, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/tos', name: 'administrator-contractors-tos',
                    component: AdministratorContractorsTos, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/tos/:id', name: 'administrator-single-contractors-tos',
                    component: AdministratorSingleContractorsTos, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/tszh', name: 'administrator-contractors-tszh',
                    component: AdministratorContractorsTszh, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/tszh/:id', name: 'administrator-single-contractors-tszh',
                    component:  AdministratorSingleContractorsTszh, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/contractors/users/:id', name: 'administrator-users',
                    component: AdministratorUsers, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/persons', name: 'administrator-persons',
                    component: AdministratorPersons, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/person/:id', name: 'administrator-single-person',
                    component: AdministratorSinglePerson, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/modules', name: 'administrator-modules',
                    component: AdministratorModules, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/layers', name: 'administrator-layers',
                    component: AdministratorLayers, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/parse/kmz', name: 'administrator-parse-kmz',
                    component: KMZParser, meta: {roles: ['superadmin']},
                },
                {
                    path: '/administrator/parse/xls', name: 'administrator-parse-xls',
                    component: XLSParser, meta: {roles: ['superadmin']},
                },

                // Manager
                {
                    path: '/manager/cabinet', name: 'manager-cabinet',
                    component: Cabinet, meta: {roles: ['superadmin', 'admin']},
                },
                {
                    path: '/manager/layers', name: 'manager-layers',
                    component: ManagerLayers, meta: {roles: ['superadmin', 'admin']},
                },
                {
                    path: '/manager/elements/:id', name: 'manager-elements',
                    component: ManagerElements, meta: {roles: ['superadmin', 'admin']},
                },
                {
                    path: '/manager/gis', name: 'manager-gis',
                    component: ManagerGis, meta: {roles: ['superadmin', 'admin']},
                },

            ],
        },
    ],
});
