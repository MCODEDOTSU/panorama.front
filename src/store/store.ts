import Vue from 'vue';
import Vuex from 'vuex';
import RootState from '@/store/types';
import {user} from '@/store/modules/user/user';
import createPersistedState from 'vuex-persistedstate';

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

// components
import {sureModal} from '@/store/modules/components/common/sureModal/sureModal';
import {includeList} from '@/store/modules/components/common/includeList/includeList';

import {map} from '@/store/modules/components/utils/map/map';
import {fileuploader} from '@/store/modules/components/utils/fileuploader/fileuploader';

// constructor
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

        // constructor
        directoryForConstructor,

    },

    plugins: [createPersistedState({
        paths: ['user.token'],
    })],

});
