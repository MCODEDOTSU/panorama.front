import Vue from 'vue';
import Vuex from 'vuex';
import RootState from '@/store/types';
import createPersistedState from 'vuex-persistedstate';

import {user} from '@/store/modules/user/user';
import {region} from '@/store/modules/region/region';

// Administrator
import {administratorModule} from '@/store/modules/administrator/module/module';
import {administratorLayer} from '@/store/modules/administrator/layer/layer';
import {administratorContractor} from '@/store/modules/administrator/contractor/contractor';
import {administratorPerson} from '@/store/modules/administrator/person/person';
import {administratorUser} from '@/store/modules/administrator/user/user';
import {administratorConstructor} from '@/store/modules/administrator/constructor/constructor';
import {styleEditor} from '@/store/modules/administrator/styleEditor/styleEditor';

// Manager
import {managerLayer} from '@/store/modules/manager/layer/layer';
import {managerElement} from '@/store/modules/manager/element/element';
import {managerConstructor} from '@/store/modules/manager/constructor/constructor';

// Components
import {sureModal} from '@/store/modules/components/common/sureModal/sureModal';
import {includeList} from '@/store/modules/components/common/includeList/includeList';
import {leftMenu} from '@/store/modules/components/common/leftMenu/leftMenu';

import {map} from '@/store/modules/components/utils/map/map';
import {fileuploader} from '@/store/modules/components/utils/fileuploader/fileuploader';

// Constructor
import {directoryForConstructor} from '@/store/modules/administrator/constructor/directory/directory';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    state: {
        applicationName: '',
    },
    mutations: {},
    actions: {},
    getters: {},
    modules: {

        user,
        region,

        // Administrator
        administratorModule,
        administratorLayer,
        administratorContractor,
        administratorPerson,
        administratorUser,
        administratorConstructor,
        styleEditor,

        // Manager
        managerLayer,
        managerElement,
        managerConstructor,

        // components
        includeList,
        sureModal,
        map,
        fileuploader,
        leftMenu,

        // constructor
        directoryForConstructor,

    },

    plugins: [createPersistedState({
        paths: ['user.token'],
    })],

});
