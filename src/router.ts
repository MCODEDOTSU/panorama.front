import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

import Manager from './views/Manager.vue';

// Administrator
import AdministratorContractors from './views/administrator/contractors/Contractors.vue';
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
                    path: '/administrator/contractors/users/:id', name: 'administrator-users',
                    component: AdministratorUsers, meta: {roles: ['superadmin']},
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
