import {ActionTree, Module, MutationTree} from 'vuex';
import RootState from '@/store/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import RegionState from '@/store/modules/region/types';

export const state: RegionState = {
    regions: [],
};

export const actions: ActionTree<RegionState, RootState> = {

    /**
     * Список регионов
     */
    async getRegions({}, payload) {
        axios.get(`${baseUrlAPI}regions`).then((response) => {
            state.regions = response.data;
        }, () => {
            ErrorNotifier.notify();
        });
    },

};

export const region: Module<RegionState, RootState> = {
    state,
    actions,
};
