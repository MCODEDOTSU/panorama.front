import MapState from '@/store/modules/components/utils/map/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import Vue from 'vue';
// @ts-ignore
import {transform} from 'ol/proj';
import {focusOfFeature, focusOLFeatures, updateOLClusterLayerStyle} from '@/domain/services/ol/MapService';
// import {createOLFeature, updateOLFeatureStyle} from '@/domain/services/ol/FeatureService';
import {createOLFeature} from '@/domain/services/ol/FeatureService';

export const state: MapState = {
    map: false,
    properties: {
        longitude: 48.0360,
        latitude: 46.3538,
        zoom: 17,
        selectorMapContainer: 'map',
    },
    source: false,
    layer: false,
    styles: [],
    interaction: {mode: 'select', draw: false, select: false},
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
        state.source = payload.source;
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
        updateOLClusterLayerStyle(state.layer, state.styles);
    },

    /**
     * Изменить режим работы карты
     * @param payload
     */
    setInteraction({}, payload) {
        state.interaction.mode = (payload.mode === 'point' ? 'Point' :
            (payload.mode === 'linestring' ? 'LineString' :
                (payload.mode === 'polygon' ? 'Polygon' :
                    (payload.mode === 'modify' ? 'modify' : 'select'))));

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
            state.source.addFeature(feature);
        } else {
            const feature = createOLFeature(payload.id, payload.geom, payload.property, state.styles.find((item) => {
                return item.id === payload.layer_id;
            }));
            state.source.addFeature(feature);
        }
    },

    /**
     * Удалить элемент с карты по ИД
     * @param payload
     */
    removeFeatureFromMap({}, payload) {
        const feature = state.source.getFeatureById(payload.id);
        if (feature) {
            state.source.removeFeature(feature);
        }
    },

    updateFeatureTitle({}, payload) {
        // const feature = state.source.getFeatureById(payload.id);
        // feature.set('title', payload.title);
        // if (feature) {
        //     updateOLFeatureStyle(feature, state.styles.find((item) => {
        //         return item.id === payload.layer_id;
        //     }));
        // }
    },

    /**
     * Соединить два точечных объекта линией
     * @param payload
     */
    addFeaturesArrowToMap({}, payload) {

        if (!payload.first || !payload.second) {
            return;
        }

        if (payload.first.geometry.indexOf('POINT') === -1
            || payload.second.geometry.indexOf('POINT') === -1) {
            return;
        }

        let x = /^POINT\((.+)\)$/.exec(payload.first.geometry);
        let y = /^POINT\((.+)\)$/.exec(payload.second.geometry);
        if (x.length !== 2 || y.length !== 2) {
            return;
        }

        const featureGraph = createOLFeature(
            `graph-${payload.first.id}-${payload.second.id}`,
            `LINESTRING(${x[1]}, ${y[1]})`,
            {
                id: `graph-${payload.first.id}-${payload.second.id}`,
                title: `graph-${payload.first.id}-${payload.second.id}`,
                x: payload.first.id,
                y: payload.second.id,
            },
            {
                id: 0, stroke: {color: '#a42038', width: 1},
            },
        );
        state.source.addFeature(featureGraph);

        x = /^POINT\(([\d\.]+)\s([\d\.]+)\)$/.exec(payload.first.geometry);
        y = /^POINT\(([\d\.]+)\s([\d\.]+)\)$/.exec(payload.second.geometry);
        if (x.length !== 3 || y.length !== 3) {
            return;
        }

        // const dx = parseFloat(y[1]) - parseFloat(x[1]);
        // const dy = parseFloat(y[2]) - parseFloat(x[2]);
        // const rotation = ((Math.atan2(dy, dx) * -180) / Math.PI) - 7;
        //
        // const featureGraphArrow = createOLFeature(
        //     `graph-arrow-${payload.first.id}-${payload.second.id}`,
        //     payload.second.geometry,
        //     {
        //         id: `graph-arrow-${payload.first.id}-${payload.second.id}`,
        //         title: `graph-arrow-${payload.first.id}-${payload.second.id}`,
        //         x: payload.first.id,
        //         y: payload.second.id,
        //     },
        //     {
        //         id: 0,
        //         pointType: 'icon',
        //         icon: {
        //             src: '/images/next.png',
        //             anchor: [20, 4],
        //             opacity: 0, scale: 1,
        //             rotation,
        //         },
        //         showTitle: false,
        //     },
        // );
        // state.source.addFeature(featureGraphArrow);

    },

    /**
     * Удалить линию между точечяными объектами
     * @param payload
     */
    removeFeaturesArrowFromMap({}, payload) {
        const featureGraph = state.source.getFeatureById(`graph-${payload.first.id}-${payload.second.id}`);
        if (featureGraph) {
            state.source.removeFeature(featureGraph);
        }
        const featureGraphArrow = state.source.getFeatureById(`graph-arrow-${payload.first.id}-${payload.second.id}`);
        if (featureGraphArrow) {
            state.source.removeFeature(featureGraphArrow);
        }
    },

    /**
     * Сфокусироваться на геообъекте
     * @param payload
     */
    focusOfFeature({}, payload) {
        const feature = state.source.getFeatureById(payload.id);
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
            const feature = state.source.getFeatureById(id);
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
