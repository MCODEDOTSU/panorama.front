import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Gis from './views/gis/Gis.vue';
import Modules from './views/closed/Modules.vue';
import ClosedInformation from './views/closed/information/Information.vue';
import ClosedGis from './views/closed/gis/Gis.vue';
import KMZParser from './views/closed/parser/KMZParser.vue';
import XLSParser from './views/closed/parser/XLSParser.vue';

import Manager from './views/Manager.vue';
// Manager
import Cabinet from './views/manager/Cabinet.vue';
// Administrator
import AdministratorContractors from './views/administrator/contractors/Contractors.vue';
import AdministratorUsers from './views/administrator/contractors/Users.vue';
import AdministratorModules from './views/administrator/modules/Modules.vue';
import AdministratorLayers from './views/administrator/layers/Layers.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/', name: 'home', component: Home, meta: { roles: [] },
      },
      {
          path: '/gis', name: 'gis', component: Gis, meta: { roles: [] },
      },
      {
          path: '/manager',
          name: 'manager',
          component: Manager,
          children: [
              //  Administrator
              {
                  path: '/manager/contractors' , name: 'administrator-contractors', component: AdministratorContractors, meta: { roles: ['superadmin'] },
              },
              {
                  path: '/manager/contractors/users/:id' , name: 'administrator-users', component: AdministratorUsers, meta: { roles: ['superadmin'] },
              },
              {
                  path: '/manager/modules', name: 'administrator-modules', component: AdministratorModules, meta: { roles: ['superadmin'] },
              },
              {
                  path: '/manager/layers', name: 'administrator-layers', component: AdministratorLayers, meta: { roles: ['superadmin'] },
              },
              // Manager
              {
                  path: '/manager/cabinet', name: 'manager-cabinet', component: Cabinet, meta: { roles: ['superadmin', 'admin'] },
              },
              {
                  path: '/manager/contractors/modules', name: 'manager-contractors-modules', component: Modules, meta: { roles: ['superadmin', 'admin'] },
              },
              {
                  path: '/manager/information/:id', name: 'manager-data', component: ClosedInformation, meta: { roles: ['superadmin', 'admin'] },
              },
              {
                  path: '/manager/gis' , name: 'manager-gis', component: ClosedGis, meta: { roles: ['superadmin', 'admin'] },
              },
              {
                  path: '/manager/parse_kmz', name: 'parse-kmz', component: KMZParser, meta: { roles: ['superadmin', 'admin'] },
              },
              {
                  path: '/manager/parse_xls', name: 'parse-xls', component: XLSParser, meta: { roles: ['superadmin', 'admin'] },
              },
          ],
      },
  ],
});
