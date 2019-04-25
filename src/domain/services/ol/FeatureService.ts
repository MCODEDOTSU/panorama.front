import {WKT} from 'ol/format';
import {createOLStyle} from '@/domain/services/ol/StyleService';

/**
 * Создать новый геообъект на карте
 * @param id
 * @param geom
 * @param property
 * @param style
 */
export const createOLFeature = (id: string, geom: string, property: any, style?: any) => {
    const format = new WKT();
    const feature = format.readFeature(geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
    });
    if (style) {
        const olStyle = createOLStyle(style, property.title);
        feature.setStyle(olStyle);
    }
    feature.setProperties(property);
    feature.setId(id);
    return feature;
};

/**
 * Обновить стиль геообъекта
 * @param feature
 * @param style
 */
export const updateOLFeatureStyle = (feature: any, style: any) => {
    const olStyle = createOLStyle(style, feature.get('title'));
    feature.setStyle(olStyle);
};

/**
 * Тип геометрии по координатам
 */
export const getGeometryTypeByGeom = (geom: string) => {
    return geom.indexOf('POINT') !== -1 ? 'point' : (
        geom.indexOf('LINESTRING') !== -1 ? 'linestring' : 'polygon'
    );
};
