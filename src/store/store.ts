import Vue from 'vue';
import Vuex from 'vuex';
import RootState from '@/store/types';
import {infomodule} from '@/store/modules/info/infomodule/infomodule';
import {infoelement} from '@/store/modules/info/element/element';
import {user} from '@/store/modules/user/user';
import createPersistedState from 'vuex-persistedstate';
import {infoitem} from '@/store/modules/info/infoitem/infoitem';
import {geoLayer} from '@/store/modules/geo/layer/layer';
import {geoElement} from '@/store/modules/geo/element/element';
import {geoGeometry} from '@/store/modules/geo/geometry/geometry';

// manager
import {managerContractor} from '@/store/modules/manager/contractor/contractor';
import {managerUser} from '@/store/modules/manager/user/user';
import {managerModule} from '@/store/modules/manager/module/module';
import {managerLayer} from '@/store/modules/manager/layer/layer';
import {managerLayerComposition} from '@/store/modules/manager/layerComposition/layerComposition';
import {managerElement} from '@/store/modules/manager/element/element';
import {managerGeometry} from '@/store/modules/manager/geometry/geometry';

// gis
import {gisLayer} from '@/store/modules/gis/layer/layer';
import {gisLayerComposition} from '@/store/modules/gis/layerComposition/layerComposition';
import {gisElement} from '@/store/modules/gis/element/element';
import {gisGeometry} from '@/store/modules/gis/geometry/geometry';

// components
import {sureModal} from '@/store/modules/components/common/sureModal/sureModal';
import {includeList} from '@/store/modules/components/common/includeList/includeList';
import {styleEditor} from '@/store/modules/components/utils/styleEditor/styleEditor';
import {map} from '@/store/modules/components/utils/map/map';

// constructor
import {constructor} from '@/store/modules/constructor/constructor';
import InfoModuleState from '@/store/modules/info/infomodule/types';
import GeoLayerState from '@/store/modules/geo/layer/types';
import GeoElementState from '@/store/modules/geo/element/types';
import GeoGeometryState from '@/store/modules/geo/geometry/types';
import ConstructorState from '@/store/modules/constructor/types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    state: {
        applicationName: '',
        infomodule: '',
        geoLayer: '',
        geoElement: '',
        geoGeometry: '',
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
        geoLayer,
        geoElement,
        geoGeometry,

        // manager
        managerContractor,
        managerUser,
        managerModule,
        managerLayer,
        managerLayerComposition,
        managerElement,
        managerGeometry,

        // gis
        gisLayer,
        gisLayerComposition,
        gisElement,
        gisGeometry,

        // components
        includeList,
        sureModal,
        styleEditor,
        map,

        // constructor
        constructor,
    },

    plugins: [createPersistedState({
        paths: ['user.token'],
    })],

});
