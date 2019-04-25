import {arrayIndexOf} from '@/domain/services/common/ArrayActions';
import {updateOLFeatureStyle} from '@/domain/services/ol/FeatureService';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer} from 'ol/layer';
import {OSM as OSMSource} from 'ol/source';
// @ts-ignore
import {Select, Draw} from 'ol/interaction';
// @ts-ignore
import {MousePosition} from 'ol/control';
// @ts-ignore
import {createStringXY} from 'ol/coordinate';
// @ts-ignore
import {transform} from 'ol/proj';
// @ts-ignore
import {defaults as defaultControls} from 'ol/control';

/**
 * Создание OpenLayer Карты
 * @param longitude
 * @param latitude
 * @param zoom
 * @param selector
 */
export const initOLMap = (longitude: number, latitude: number, zoom: number, selector?: string) => {

    const mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        className: 'map-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;',
    });

    return new Map({
        layers: [
            new TileLayer({ source: new OSMSource() }),
        ],
        target: selector ? selector : 'map',
        controls: defaultControls().extend([mousePositionControl]),
        view: new View({
            center: transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857' ),
            zoom,
        }),
    });

};

/**
 * Создание интерактивного слоя для выделения элементов на карте
 * @param action
 */
export const createOLSelectInteraction = (action: any) => {
    const selectSingleClick = new Select();
    selectSingleClick.on('select', action);
    return selectSingleClick;
};

/**
 * Обновить стили всех элементов карты
 * @param layer
 * @param styles
 */
export const updateOLFeaturesStyle = (layer: any, styles: any) => {
    layer.getSource().forEachFeature((feature) => {
        const i = arrayIndexOf(styles, feature.get('layer_composition_id'));
        if (i !== -1) {
            updateOLFeatureStyle(feature, styles[i]);
        }
    });
};

export const createOLDraw = (mode: any, layer: any, action: any) => {
    if (mode === '') {
        return;
    }
    const draw = new Draw({ source: layer.getSource(), type: mode });
    draw.on('drawend', action);
    return draw;
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
