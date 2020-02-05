import MapState from '@/store/modules/components/utils/map/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import Vue from 'vue';
// @ts-ignore
import {transform} from 'ol/proj';
import {focusOfFeature, focusOLFeatures, updateOLFeaturesStyle} from '@/domain/services/ol/MapService';
import {createOLFeature} from '@/domain/services/ol/FeatureService';
import {arrayIndexOf} from '@/domain/services/common/ArrayActions';

export const state: MapState = {
    map: false,
    properties: {
        longitude: 48.0360,
        latitude: 46.3538,
        zoom: 17,
        selectorMapContainer: 'map',
    },
    layer: false,
    styles: [],
    interaction: { draw: { layer: false, mode: '', draw: false } },
};

export const actions: ActionTree<MapState, RootState> = {

    /**
     * Установить центр карты и зум
     * @param payload
     */
    setMapCenter({}, payload) {
        state.properties.longitude = payload.longitude ? payload.longitude : state.properties.longitude;
        state.properties.latitude = payload.latitude ? payload.latitude : state.properties.latitude;
        state.properties.zoom = payload.zoom ? payload.zoom : state.properties.zoom;
        if (state.map !== false) {
            state.map.getView().setCenter(transform([state.properties.longitude, state.properties.latitude], 'EPSG:4326', 'EPSG:3857'));
            state.map.getView().setZoom(state.properties.zoom);
        }
    },

    /**
     * Установить центр карты и зум в значения по-умолчанию
     */
    setMapCenterDefault() {
        state.properties.longitude = 48.0360;
        state.properties.latitude = 46.3538;
        state.properties.zoom = 17;
        if (state.map !== false) {
            state.map.getView().setCenter(transform([state.properties.longitude, state.properties.latitude], 'EPSG:4326', 'EPSG:3857'));
            state.map.getView().setZoom(state.properties.zoom);
        }
    },

    /**
     * Получить центр карты и зум
     * @param payload
     */
    getMapCenter({}, payload) {
        if (state.map !== false) {
            const coordinaties = transform(state.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
            state.properties.longitude = coordinaties[0];
            state.properties.latitude = coordinaties[1];
            state.properties.zoom = state.map.getView().getZoom();
        }
    },

    /**
     * Создание карты при её инициализации
     * @param payload
     */
    createMap({}, payload) {
        state.map = payload.map;
        state.layer = payload.layer;
    },

    /**
     * Обновить размеры карты
     */
    mapUpdateSize() {
        Vue.nextTick(() => {
            if (state.map !== false) {
                state.map.updateSize();
            }
        });
    },

    /**
     * Задать стили для слоев карты
     * @param payload
     */
    setMapStyles({}, payload) {
        state.styles = payload.styles;
        updateOLFeaturesStyle(state.layer, state.styles);
    },

    /**
     * Изменить режим работы карты
     * @param rootState
     * @param payload
     */
    setMapInteraction({}, payload) {
        state.interaction.draw = Object.assign({}, state.interaction.draw, {
            mode: (payload.mode === 'point' ? 'Point' :
                        (payload.mode === 'linestring' ? 'LineString' :
                            (payload.mode === 'polygon' ? 'Polygon' : '' ))),
        });
    },

    /**
     * Добавить элемент на карту
     * @param payload
     */
    addFeatureToMap({}, payload) {
        if (payload.style) {
            if (!payload.geom) {
                return;
            }
            const feature = createOLFeature(payload.id, payload.geom, payload.property, payload.style);
            state.layer.getSource().addFeature(feature);
        } else {
            const i = arrayIndexOf(state.styles, payload.layer_id);
            if (i === -1 || !payload.geom) {
                return;
            }
            const feature = createOLFeature(payload.id, payload.geom, payload.property, state.styles[i]);
            state.layer.getSource().addFeature(feature);
        }
    },

    /**
     * Удалить элемент с карты
     * @param payload
     */
    removeFeatureFromMap({}, payload) {
        const feature = state.layer.getSource().getFeatureById(payload.id);
        if (feature) {
            state.layer.getSource().removeFeature(feature);
        }
    },

    /**
     * Сфокусироваться на геообъекте
     * @param payload
     */
    focusOfFeature({}, payload) {
        const feature = state.layer.getSource().getFeatureById(payload.id);
        if (feature) {
            focusOfFeature(state.map, feature);
        }
    },

    /**
     * Сфокусироваться на геообъектах
     * @param payload
     */
    focusOfFeatures({}, payload) {
        const features = [];
        // Находим объекты по каждому ИД
        payload.ids.forEach((id) => {
            const feature = state.layer.getSource().getFeatureById(id);
            if (feature) {
                features.push(feature);
            }
        });
        focusOLFeatures(state.map, features);
    },

};

export const map: Module<MapState, RootState> = {
    state, actions,
};
