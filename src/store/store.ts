import Vue from 'vue';
import Vuex from 'vuex';
import RootState from '@/store/types';
import {infomodule} from '@/store/modules/info/infomodule/infomodule';
import {user} from '@/store/modules/user/user';
import createPersistedState from 'vuex-persistedstate';

// Administrator
import {administratorModule} from '@/store/modules/administrator/module/module';
import {administratorLayer} from '@/store/modules/administrator/layer/layer';
import {administratorContractor} from '@/store/modules/administrator/contractor/contractor';
import {administratorUser} from '@/store/modules/administrator/user/user';

// Manager


// import {managerLayer} from '@/store/modules/manager/layer/layer';
import {managerLayer} from '@/store/modules/layer/layer';
import {managerElement} from '@/store/modules/element/element';

// gis
import {gisLayer} from '@/store/modules/gis/layer/layer';
import {gisElement} from '@/store/modules/gis/element/element';

// components
import {sureModal} from '@/store/modules/components/common/sureModal/sureModal';
import {includeList} from '@/store/modules/components/common/includeList/includeList';
import {styleEditor} from '@/store/modules/components/utils/styleEditor/styleEditor';
import {map} from '@/store/modules/components/utils/map/map';
import {fileuploader} from '@/store/modules/components/utils/fileuploader/fileuploader';

// constructor
import {managerConstructor} from '@/store/modules/constructor/constructor';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    state: {
        applicationName: '',
    },
    mutations: {},
    actions: {},
    getters: {},
    modules: {

        // Administrator
        administratorModule,
        administratorLayer,
        administratorContractor,
        administratorUser,

        // Manager

        infomodule,
        user,

        // manager
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
        fileuploader,

        // constructor
        managerConstructor,
    },

    plugins: [createPersistedState({
        paths: ['user.token'],
    })],

});
