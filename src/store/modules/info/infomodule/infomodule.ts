import axios from 'axios';
import InfoModuleState from './types';
import {ActionTree, Module} from 'vuex';
import RootState from '../../../types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';

export const state: InfoModuleState = {
    infomodule: {
        id: 0,
        title: '',
        description: '',
        layers: [],
    },
    infomodules: [],
    contractorModules: [],
};

export const actions: ActionTree<InfoModuleState, RootState> = {

    /**
     * Получить модули пользователя
     */
    async getModules() {
        try {
            const res = await axios.get(`${baseUrlAPI}modules`);
            state.infomodules = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить все модули
     */
    async getAllModules() {
        try {
            const res = await axios.get(`${baseUrlAPI}all_modules`);
            state.infomodules = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const infomodule: Module<InfoModuleState, RootState> = {
    state, actions,
};
