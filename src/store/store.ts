import Vue from 'vue';
import Vuex from 'vuex';
import RootState from '@/store/types';
import {infomodule} from '@/store/modules/info/infomodule/infomodule';
import {infoelement} from '@/store/modules/info/element/element';
import {user} from '@/store/modules/user/user';
import createPersistedState from 'vuex-persistedstate';
import {infoitem} from '@/store/modules/info/infoitem/infoitem';

// manager
import {managerContractor} from '@/store/modules/manager/contractor/contractor';
import {managerUser} from '@/store/modules/manager/user/user';
import {managerModule} from '@/store/modules/manager/module/module';
import {managerLayer} from '@/store/modules/manager/layer/layer';
import {managerElement} from '@/store/modules/manager/element/element';

// gis
import {gisLayer} from '@/store/modules/gis/layer/layer';
import {gisElement} from '@/store/modules/gis/element/element';

// components
import {sureModal} from '@/store/modules/components/common/sureModal/sureModal';
import {includeList} from '@/store/modules/components/common/includeList/includeList';
import {styleEditor} from '@/store/modules/components/utils/styleEditor/styleEditor';
import {map} from '@/store/modules/components/utils/map/map';

// constructor
import {konstructor} from '@/store/modules/constructor/constructor';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    state: {
        applicationName: '',
        infomodule: '',
        constructor: '',
    },
    mutations: {

    },
    actions: {

    },

    modules: {
        infomodule,
        infoelement,
        infoitem, // частное от infoelement: point, polygon, linestring
        user,

        // manager
        managerContractor,
        managerUser,
        managerModule,
        managerLayer,
        managerElement,

        // gis
        gisLayer,
        gisElement,

        // components
        includeList,
        sureModal,
        styleEditor,
        map,

        // constructor
        konstructor,
    },

    plugins: [createPersistedState({
        paths: ['user.token'],
    })],

});
