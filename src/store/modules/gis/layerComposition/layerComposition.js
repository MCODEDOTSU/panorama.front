import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import { baseUrlAPI } from '@/globals';
import axios from 'axios';
export const state = {
    compositions: [],
    styles: [],
};
export const actions = {
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
                styles.push(Object.assign({}, { id: composition.id }, JSON.parse(composition.style)));
            });
            state.styles = styles;
        }
        catch {
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
                styles.push(Object.assign({}, { id: composition.id }, JSON.parse(composition.style)));
            });
            state.styles = styles;
        }
        catch {
            ErrorNotifier.notify();
        }
    },
};
export const gisLayerComposition = {
    state, actions,
};
//# sourceMappingURL=layerComposition.js.map