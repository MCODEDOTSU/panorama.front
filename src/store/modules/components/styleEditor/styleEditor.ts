import StyleEditorState from '@/store/modules/components/styleEditor/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import {baseUrlAPI, baseUrl} from '@/globals';
import axios from 'axios';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

/**
 * Стили "по-умолчанию"
 */
const defaultStyle = {
    point: {
        id: 1,
        showTitle: true,
        shape: {
            points: 11,
            fill: { color: '#009fe3', opacity: 0 },
            stroke: { color: '#164194', width: 1, opacity: 0 },
            radius: 5, rotation: 0,
        },
        icon: {
            src: `${baseUrl}storage/images/layer/default.png`,
            anchor: [24, 24], opacity: 0, scale: 1, rotation: 0,
        },
        pointType: 'shape',
        font: {
            font: '16px Calibri, sans-serif', textBaseline: 'bottom', offsetY: -6,
            fill: { color: '#000000' },
            stroke: { color: '#ffffff', width: 3 },
        },
        list: {
            hasList: false,
            visibility: false,
            color: '#000000',
            opacity: 0,
        },
    },
    linestring: {
        id: 1,
        showTitle: true,
        stroke: { color: '#164194', opacity: 20, width: 10 },
        font: {
            font: '16px Calibri, sans-serif', textBaseline: 'bottom', placement: 'line',
            fill: { color: '#000000' },
            stroke: { color: '#ffffff', width: 3 },
        },
    },
    polygon: {
        id: 1,
        showTitle: true,
        fill: { color: '#009fe3', opacity: 20 },
        stroke: { color: '#164194', width: 1, opacity: 0 },
        font: {
            font: '16px Calibri, sans-serif', textBaseline: 'bottom', offsetY: -6,
            fill: { color: '#000000' },
            stroke: { color: '#ffffff', width: 3 },
        },
    },
};

export const state: StyleEditorState = {
    geometryType: '',
    style: defaultStyle.point,
};

export const actions: ActionTree<StyleEditorState, RootState> = {

    /**
     * Установить геотип (точка, линия, полигон) для редактора стилей
     * @param payload
     */
    setGeometryTypeByStyleEditor({}, payload) {
        state.geometryType = payload.geometryType;
    },

    /**
     * Установить стиль (задается в json и разбирается) для редактора стилей
     * @param payload
     */
    setStyleByStyleEditor({}, payload) {
        const style = (state.geometryType === 'point' ? defaultStyle.point : (
            state.geometryType === 'linestring' ? defaultStyle.linestring : defaultStyle.polygon
        ));
        state.style = Object.assign({}, style, payload.style);
    },

    /**
     * Установить стиль по-умолчанию, в зависимости от типа геоэлемента
     */
    setDefaultStyleByStyleEditor() {
        const style = (state.geometryType === 'point' ? defaultStyle.point : (
            state.geometryType === 'linestring' ? defaultStyle.linestring : defaultStyle.polygon
        ));
        state.style = Object.assign({}, style);
    },

    /**
     * Загрузка иконки
     * @param payload
     */
    async uploadIconByStyleEditor({}, payload) {

        const formData = new FormData();
        formData.append('file', payload.file);

        try {
            const res = await axios.post(`${baseUrlAPI}manager/layer/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const style = state.style;
            style.icon.src = `${baseUrl}${res.data.filename}`;
            style.icon.anchor = [res.data.width / 2, res.data.height / 2];
            state.style = Object.assign({}, style);
            SuccessNotifier.notify('Загрузка завершена', `Изображение "${payload.file.name}" загружено на сервер`);
        } catch {
            ErrorNotifier.notify();
        }

    },

};

export const styleEditor: Module<StyleEditorState, RootState> = {
    state, actions,
};
