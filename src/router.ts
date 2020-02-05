import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
// import Login from './views/closed/Login.vue';
import Desktop from './views/closed/Desktop.vue';
import Gis from './views/gis/Gis.vue';
import Modules from './views/closed/Modules.vue';
import ClosedInformation from './views/closed/information/Information.vue';
import ClosedModules from './views/closed/modules/Modules.vue';
import ClosedGis from './views/closed/gis/Gis.vue';
import ClosedContractors from './views/closed/contractors/Contractors.vue';
import ClosedUsers from './views/closed/users/Users.vue';
import ClosedLayers from './views/closed/layers/Layers.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/', name: 'home', component: Home,
      },
      // {
      //     path: '/login', name: 'login', component: Login,
      // },
      {
          path: '/gis', name: 'gis', component: Gis,
      },
      {
          path: '/manager',
          name: 'manager',
          component: Desktop,
          children: [
              {
                  path: '/manager/contractors/modules', name: 'manager-contractors-modules', component: Modules,
              },
              {
                  path: '/manager/information/:id', name: 'manager-data', component: ClosedInformation,
              },
              {
                  path: '/manager/contractors' , name: 'manager-contractors', component: ClosedContractors,
              },
              {
                  path: '/manager/contractors/users/:id' , name: 'manager-users', component: ClosedUsers,
              },
              {
                  path: '/manager/gis' , name: 'manager-gis', component: ClosedGis,
              },
              {
                  path: '/manager/modules', name: 'manager-modules', component: ClosedModules,
              },
              {
                  // Функционал конструктора находится здесь
                  path: '/manager/layers', name: 'manager-layers', component: ClosedLayers,
              },
          ],
      },
  ],
});
