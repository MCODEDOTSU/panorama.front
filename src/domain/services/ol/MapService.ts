import {arrayIndexOf} from '@/domain/services/common/ArrayActions';
// import {updateOLFeatureStyle} from '@/domain/services/ol/FeatureService';
import {createOLStyle} from '@/domain/services/ol/StyleService';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Cluster, OSM as OSMSource, Vector as VectorSource, XYZ} from 'ol/source';
// @ts-ignore
import {createXYZ} from 'ol/tilegrid';
// @ts-ignore
import {Select, Draw} from 'ol/interaction';
// @ts-ignore
import {MousePosition} from 'ol/control';
// @ts-ignore
import {createStringXY} from 'ol/coordinate';
// @ts-ignore
import {transform, get as projGet, transformExtent} from 'ol/proj';
// @ts-ignore
import {register as proj4Register} from 'ol/proj/proj4';
// @ts-ignore
import {defaults as defaultControls} from 'ol/control';

import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

/**
 * Создание OpenLayer Карты
 * @param longitude
 * @param latitude
 * @param zoom
 * @param selector
 */
export const initOLMap = (longitude: number, latitude: number, zoom: number, tiles: any, selector?: string) => {

    // @ts-ignore
    proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
    // @ts-ignore
    proj4Register(proj4);
    projGet('EPSG:3395').setExtent([-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]);

    const mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'map-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;',
    });

    return new Map({
        layers: tiles,
        target: selector ? selector : 'map',
        controls: defaultControls().extend([mousePositionControl]),
        view: new View({
            center: transform([longitude, latitude], 'EPSG:4326', 'EPSG:3395'),
            projection: 'EPSG:3395',
            zoom,
            extent: transformExtent([-180, -80, 180, 80], 'EPSG:4326', 'EPSG:3395'),
        }),
    });

};

/**
 * Создать новый OpenLayer Source
 */
export const createOLSource = () => {
    return new VectorSource({});
};

/**
 * Создать новый OpenLayer Source
 */
export const createOLClusterLayer = (source) => {

    const defaultClusterStyle = {
        id: 0,
        showTitle: true,
        font: {fill: {color: '#ffffff'}, font: '16px Calibri, sans-serif', textBaseline: 'middle'},
        pointType: 'shape',
        shape: {fill: {color: '#a42038', opacity: 10}, stroke: {color: '#ffffff', opacity: 0, width: 1}, points: 11, radius: 16, rotation: 0},
    };

    return new VectorLayer({
        source: new Cluster({distance: 100, source}),
        style: (feature) => {
            const size = feature.get('features').length;
            return createOLStyle(defaultClusterStyle, size.toString());
        },
    });
};

/**
 * Создать новый OpenLayer слой
 */
export const createOLLayer = () => {
    const source = new VectorSource({});
    return new VectorLayer({source});
};

/**
 * Обновить стили всех элементов карты
 * @param layer
 * @param styles
 */
export const updateOLClusterLayerStyle = (layer: any, styles: any) => {

    const defaultClusterStyle = {
        id: 0,
        showTitle: true,
        font: {fill: {color: '#ffffff'}, font: '16px Calibri, sans-serif', textBaseline: 'middle'},
        pointType: 'shape',
        shape: {fill: {color: '#a42038', opacity: 10}, stroke: {color: '#ffffff', opacity: 0, width: 1}, points: 11, radius: 16, rotation: 0},
    };

    layer.setStyle((feature) => {
        const size = feature.get('features').length;
        if (size === 1) {
            const properties = feature.get('features')[0].getProperties();
            const style = styles.find((s) => {
                return s.id === properties.layer_id;
            });
            return style ? createOLStyle(style, properties.title) : createOLStyle(defaultClusterStyle, properties.title);
        }
        return createOLStyle(defaultClusterStyle, size.toString());
    });

};

/**
 * Фокусировка на выделенном геообъекте
 * @param map
 * @param feature
 */
export const focusOfFeature = (map: any, feature: any) => {

    const extent = feature.getGeometry().getExtent();

    if (extent[0] === extent[2] && extent[1] === extent[3]) {
        map.getView().animate({
            center: ([(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]),
            zoom: 18,
            duration: 300,
        });
    } else {
        map.getView().fit(extent, {
            padding: [0, 180, 0, 0],
            minResolution: 5,
            duration: 300,
        });
    }

};

/**
 * Фокусировка на выделенных геообъектах
 * @param map
 * @param features
 */
export const focusOLFeatures = (map: any, features: any) => {

    if (features.length === 0) {
        return;
    }

    const maxExtent = features[0].getGeometry().getExtent();

    features.forEach((feature) => {

        const extent = feature.getGeometry().getExtent();
        if (maxExtent[0] > extent[0]) {
            maxExtent[0] = extent[0];
        }
        if (maxExtent[1] > extent[1]) {
            maxExtent[1] = extent[1];
        }
        if (maxExtent[2] < extent[2]) {
            maxExtent[2] = extent[2];
        }
        if (maxExtent[3] < extent[3]) {
            maxExtent[3] = extent[3];
        }

    });

    if (maxExtent[0] === maxExtent[2] && maxExtent[1] === maxExtent[3]) {
        map.getView().animate({
            center: ([(maxExtent[0] + maxExtent[2]) / 2, (maxExtent[1] + maxExtent[3]) / 2]),
            duration: 300,
        });
    } else {
        map.getView().fit(maxExtent, {
            padding: [0, 180, 0, 0],
            minResolution: 5,
            duration: 300,
        });
    }

};
