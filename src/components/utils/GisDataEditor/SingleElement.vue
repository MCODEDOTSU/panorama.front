<template>
    <div class="single-element">

        <!-- Название элемента -->
        <input type="text" class="element-title-field"
               placeholder="Наименование элемента"
               v-on:blur="updateSingleElement()"
               v-model="elementState.element.title">

        <span class="element-geometries-container" v-if="elementState.element.id !== 0">
            <!-- Добавить новую геометрию -->
            <h3>Добавить геообъект:</h3>
            <div class="add-geometry-container">
                <select v-model="composition">
                    <option v-for="singleComposition in compositions" :value="singleComposition">
                        {{ singleComposition.title }}
                    </option>
                </select>
            </div>
            <button class="btn-add-geometry"
                    title="Создать геообъект"
                    @click="createGeometry()">
                <i class="fas fa-plus"></i>
            </button>

            <!-- Геометрия элемента -->
            <h3 v-if="elementState.element.geometries.length !== 0">Состав слоя:</h3>

            <ul class="element-geometries-list">
                <li class="element-geometry-item point"
                    v-for="geometry in elementState.element.geometries">
                    <button v-if="!geometry.geom"
                            title="Задать геометрию объекта"
                            class="geometry-geom empty"
                            @click="updateEmptyGeometry(geometry)">
                        <i class="fas fa-map-marker-alt"
                           v-if="geometry.type === 'point'"></i>
                        <i class="fas fa-route"
                           v-else-if="geometry.type === 'linestring'"></i>
                        <i class="fas fa-draw-polygon"
                           v-else-if="geometry.type === 'polygon'"></i>
                    </button>
                    <button v-else
                            title="Изменить геометрию объекта"
                            class="geometry-geom"
                            @click="focusGeometry(geometry)">
                        <i class="fas fa-map-marker-alt"
                           v-if="geometry.type === 'point'"></i>
                        <i class="fas fa-route"
                           v-else-if="geometry.type === 'linestring'"></i>
                        <i class="fas fa-draw-polygon"
                           v-else-if="geometry.type === 'polygon'"></i>
                    </button>
                    <div class="geometry-title" v-bind:class="{'empty': !geometry.geom}">
                        <input type="text" class="geometry-title-field"
                               v-on:blur="updateSingleGeometry(geometry)"
                               v-model="geometry.title"/>
                    </div>
                    <button class="btn-remove-geometry" title="Удалить геометрию" @click="deleteSingleGeometry(geometry)">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            </ul>
        </span>

        <div class="actions">
            <button class="btn-edit-save btn-danger"
                    @click="closeSingleElement"
                    title="Свернуть редактор">
                <label>Закрыть</label>
            </button>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import IComposition from '@/domain/entities/interfaces/IComposition';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import GeometryState from '@/store/modules/gis/geometry/types';
    import {arrayIndexOf} from '@/domain/services/common/ArrayActions';

    @Component({})
    export default class SingleElement extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;
        @State('gisGeometry') public geometryState!: GeometryState;

        @Action public updateElement: any;
        @Action public unsetSingleElement: any;
        @Action public setSingleGeometry: any;
        @Action public unsetSingleGeometry: any;
        @Action public updateGeometry: any;
        @Action public deleteGeometry: any;
        @Action public setMapInteraction: any;
        @Action public setMapElements: any;
        @Action public unsetCurrentIndex: any;
        @Action public removeFeatureFromMap: any;
        @Action public addFeatureToMap: any;
        @Action public focusOfFeature: any;

        @Provide('IComposition[]') public compositions!: IComposition[];
        @Provide('IComposition') public composition!: IComposition;

        public created() {
            this.getCompositionsList();
        }

        /**
         * Получить состав слоя
         */
        public getCompositionsList() {
            const i = arrayIndexOf(this.layerState.layers, this.elementState.element.layer_id);
            this.compositions = this.layerState.layers[i].composition;
            this.composition = this.compositions[0];
        }

        /**
         * Обновить данные элемента
         */
        public async updateSingleElement() {
            // Сохранить изменения в базу
            this.updateElement();
            // Находим элемент в списке и меняем его данные
            const i = this.layerState.currentLayerIndex;
            const j = this.layerState.currentElementIndex;
            this.layerState.layers[i].elements[j] =
                Object.assign({}, this.layerState.layers[i].elements[j], this.elementState.element);
        }

        /**
         * Создать новую геометрию нового объекта
         */
        public async createGeometry() {
            // Сбрасываем значение SingleGeometry (ставим по умолчанию)
            this.unsetSingleGeometry({
                layer_composition_id: this.composition.id,
                type: this.composition.geometry_type,
            });
            // Меняем режим работы карты на "рисование"
            this.setMapInteraction({
                mode: this.composition.geometry_type,
            });
        }

        /**
         * Задать геометрию объекта
         */
        public async updateEmptyGeometry(geometry: any) {
            // Сбрасываем значение SingleGeometry (ставим по умолчанию)
            this.setSingleGeometry(geometry);
            // Меняем режим работы карты на "рисование"
            this.setMapInteraction({
                mode: geometry.type,
            });
        }

        /**
         * Фокусировка на геометрии
         */
        public focusGeometry(geometry: any) {
            this.focusOfFeature({id: `${geometry.type}-${geometry.id}`});
        }

        /**
         * Обновить геометрию
         * @returns {Promise<void>}
         */
        public updateSingleGeometry(geometry: any) {
            this.setSingleGeometry(geometry);
            this.updateGeometry({ type: geometry.type });
            // Перерисовываем
            this.removeFeatureFromMap({ id: `${geometry.type}-${geometry.id}` });
            this.addFeatureToMap({
                id: `${geometry.type}-${geometry.id}`,
                layer_composition_id: geometry.layer_composition_id,
                geom: geometry.geom,
                property: geometry,
            });
        }

        /**
         * Удалить геометрию
         */
        public deleteSingleGeometry(geometry: any) {
            this.setSingleGeometry(geometry);
            this.deleteGeometry({ type: geometry.type });
            // Удаляем геометрию с карты
            this.removeFeatureFromMap({ id: `${geometry.type}-${geometry.id}` });
            // Удаляем геометрию из списка
            const i = arrayIndexOf(this.elementState.element.geometries, geometry.id);
            this.elementState.element.geometries.splice(i, 1);
        }

        /**
         * Закрыть редактор элемента
         */
        public closeSingleElement() {
            // Очищаем singleElement (присваиваем значения по-умолчанию)
            this.unsetSingleElement({ layerId: 0 });
            // Сбросить индекс текущего выбранного слоя и элемента
            this.unsetCurrentIndex();
        }

    }
</script>
