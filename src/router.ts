import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Gis from './views/gis/Gis.vue';
import Modules from './views/closed/Modules.vue';
import ClosedInformation from './views/closed/information/Information.vue';
import ClosedGis from './views/closed/gis/Gis.vue';
import KMZParser from './views/closed/parser/KMZParser.vue';

import Desktop from './views/Desktop.vue';
// Manager
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
          path: '/', name: 'home', component: Home,
      },
      {
          path: '/gis', name: 'gis', component: Gis,
      },
      {
          path: '/manager',
          name: 'manager',
          component: Desktop,
          children: [
              // Role: Administrator
              {
                  path: '/manager/contractors' , name: 'administrator-contractors', component: AdministratorContractors,
              },
              {
                  path: '/manager/contractors/users/:id' , name: 'administrator-users', component: AdministratorUsers,
              },
              {
                  path: '/manager/modules', name: 'administrator-modules', component: AdministratorModules,
              },
              {
                  path: '/manager/layers', name: 'administrator-layers', component: AdministratorLayers,
              },

              {
                  path: '/manager/contractors/modules', name: 'manager-contractors-modules', component: Modules,
              },
              {
                  path: '/manager/information/:id', name: 'manager-data', component: ClosedInformation,
              },
              {
                  path: '/manager/gis' , name: 'manager-gis', component: ClosedGis,
              },
              {
                  path: '/manager/parse_kmz', name: 'parse-kmz', component: KMZParser,
              },
          ],
      },
  ],
});
