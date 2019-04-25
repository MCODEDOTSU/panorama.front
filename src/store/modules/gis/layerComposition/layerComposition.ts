import LayerCompositionState from '@/store/modules/gis/layerComposition/types';
import {ActionTree, Module} from 'vuex';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import RootState from '@/store/types';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';

export const state: LayerCompositionState = {
    compositions: [],
    styles: [],
};

export const actions: ActionTree<LayerCompositionState, RootState> = {

    /**
     * Получить композиции для всех слоев
     */
    async gisGetLayerCompositions() {
        try {
            const res = await axios.get(`${baseUrlAPI}gis/compositions`);
            state.compositions = res.data;

            // Получаем стиль
            const styles = [];
            state.compositions.forEach((composition) => {
                styles.push(Object.assign({}, {id: composition.id}, JSON.parse(composition.style)));
            });
            state.styles = styles;

        } catch {
            ErrorNotifier.notify();
        }
    },

    /**
     * Получить композиции всех доступных слоев
     */
    async gisGetLayerCompositionsToContractor() {
        try {
            const res = await axios.get(`${baseUrlAPI}gis/compositions/contractor`);
            state.compositions = res.data;

            // Получаем стиль
            const styles = [];
            state.compositions.forEach((composition) => {
                styles.push(Object.assign({}, {id: composition.id}, JSON.parse(composition.style)));
            });
            state.styles = styles;

        } catch {
            ErrorNotifier.notify();
        }
    },

};

export const gisLayerComposition: Module<LayerCompositionState, RootState> = {
    state, actions,
};
