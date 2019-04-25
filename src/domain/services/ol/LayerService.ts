import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
// @ts-ignore
import {Select, Modify, Draw} from 'ol/interaction';

/**
 * Создать новый OpenLayer слой
 */
export const createOLLayer = () => {
    const source = new VectorSource({});
    // const clusterSource = new ClusterSource({distance: 50, source});
    return new VectorLayer({ source });
};

/**
 * Сделать слой редактируемым (изменение элементов слоя)
 * @param source
 * @param action
 */
export const createOLModify = (source: any, action: any) => {
    const modify = new Modify({ source });
    modify.on('modifyend', action);
    return modify;
};
