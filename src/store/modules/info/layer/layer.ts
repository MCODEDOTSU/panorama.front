import {ActionTree, Module} from 'vuex';
import RootState from '../../../types';
import LayerState from './types';

export const state: LayerState = {
    layer: {
        id: 0,
        title: '',
        elements: [],
        style: {},
        description: '',
        parent_id: 0,
    },
    layers: [],
};

export const layer: Module<LayerState, RootState> = {
    state,
};
