import {ActionTree, Module} from 'vuex';
import RootState from '../../../types';
import LayerState from './types';

export const state: LayerState = {
    layer: {
        id: 0,
        alias: '',
        title: '',
        description: '',
        parent_id: 0,
        elements: [],
        visibility: false,
        geometry_type: 'point',
    },
    layers: [],
};

export const layer: Module<LayerState, RootState> = {
    state,
};
