import IStyle from '@/domain/interfaces/IStyle';
import {Style, Stroke, Fill, Circle, RegularShape, Text, Icon} from 'ol/style';

/**
 * Получить цвет в формате hex с учетом прозрачности
 * @param color
 * @param opacity
 */
export const getOpacityColor = (color: string, opacity?: number) => {
    if (!opacity) {
        return color;
    }
    const hexString = Math.floor((opacity * 255) / 100).toString(16);
    return color + (hexString.length % 2 ? '0' + hexString : hexString);
};

/**
 * Получить OpenLayer Стиль
 * @param style
 * @param title
 */
export const createOLStyle = (style: IStyle, title?: string) => {

    let styleProperties = {};

    // Оконтовка
    if (style.stroke) {
        styleProperties = Object.assign({}, {
            stroke: new Stroke({
                color: getOpacityColor(style.stroke.color, (100 - style.stroke.opacity)),
                width: style.stroke.width,
            }),
        });
    }

    // Заливка
    if (style.fill) {
        styleProperties = Object.assign({}, styleProperties, {
            fill: new Fill({
                color: getOpacityColor(style.fill.color, (100 - style.fill.opacity)),
            }),
        });
    }

    // Иконка
    if (style.pointType === 'icon' && style.icon) {

        styleProperties = Object.assign({}, styleProperties, {
            image: new Icon({
                src: style.icon.src,
                anchor: style.icon.anchor,
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: ((100 - style.icon.opacity) / 100),
                scale: style.icon.scale,
                rotation: (style.icon.rotation * Math.PI / 180),
                rotateWithView: true,
            }),
        });

    } else if (style.shape) { // Фигура

        let shapeProperties = {
            fill: new Fill({
                color: getOpacityColor(style.shape.fill.color, (100 - style.shape.fill.opacity)),
            }),
            stroke: new Stroke({
                color: getOpacityColor(style.shape.stroke.color, (100 - style.shape.stroke.opacity)),
                width: style.shape.stroke.width,
            }),
            radius: style.shape.radius,
        };


        // Если больше 10 вершин, то это окружность
        if (style.shape.points !== undefined && style.shape.points > 10) {

            styleProperties = Object.assign({}, styleProperties, {
                image: new Circle(shapeProperties),
            });

        } else if (style.shape.points !== undefined) {

            shapeProperties = Object.assign({}, shapeProperties, {
                points: style.shape.points,
                rotation: style.shape.rotation,
            });

            styleProperties = Object.assign({}, styleProperties, {
                image: new RegularShape(shapeProperties),
            });

        }
    }

    // Если есть подпись к фигуре
    if (style.showTitle === true && title) {

        let fontProperties = {
            text: title,
            font: style.font.font,
            textBaseline: style.font.textBaseline,
            fill: new Fill(style.font.fill),
        };

        if (style.font.stroke) {
            fontProperties = Object.assign({}, fontProperties, {
                stroke: new Stroke(style.font.stroke),
            });
        }
        if (style.font.offsetY) {
            fontProperties = Object.assign({}, fontProperties, {
                offsetY: style.font.offsetY,
            });
        }
        if (style.font.placement) {
            fontProperties = Object.assign({}, fontProperties, {
                placement: style.font.placement,
            });
        }

        styleProperties = Object.assign({}, styleProperties, {
            text: new Text(fontProperties),
        });

    }

    return new Style(styleProperties);

};
