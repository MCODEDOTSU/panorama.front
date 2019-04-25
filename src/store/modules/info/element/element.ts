import axios from 'axios';
import ElementState from '@/store/modules/info/element/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: any = {
    compositions: [],
};

export const actions: ActionTree<any, RootState> = {

    async editElement({}, payload) {
        const url = `${baseUrlAPI}info/elements`;

        try {
            const res = await axios.put(url, payload.element);
        } catch {
            ErrorNotifier.notify();
        }
    },

    async saveElement({}, payload) {
        const url = `${baseUrlAPI}info/elements`;

        try {
            const res = await axios.post(url, payload.element);
            return res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async deleteElementInfo({}, payload) {
        const url = `${baseUrlAPI}info/elements/${payload.id}`;

        try {
            const res = await axios.delete(url);
        } catch {
            ErrorNotifier.notify();
        }
    },

    async getCompositions({}, payload) {
        const url = `${baseUrlAPI}info/composition/${payload.layer_id}`;

        try {
            const res = await axios.get(url);
            state.compositions = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async saveGeometryGeo({}, payload) {
        const url = `${baseUrlAPI}geo/geometry`;

        try {
            const res = await axios.post(url, payload.geometry);
            return res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async editGeometryGeo({}, payload) {
        const url = `${baseUrlAPI}geo/geometry/${payload.geometry.id}`;

        try {
            const res = await axios.put(url, payload.geometry);
        } catch {
            ErrorNotifier.notify();
        }
    },

    // async deleteGeometryGeo({}, payload) {
    //     const url = `${baseUrlAPI}geo/geometry/${payload.geometry.type}/${payload.geometry.id}`;
    //
    //     try {
    //         const res = await axios.delete(url, payload.geometry);
    //     } catch {
    //         ErrorNotifier.notify();
    //     }
    // },

};

export const infoelement: Module<any, RootState> = {
    state, actions,
};
