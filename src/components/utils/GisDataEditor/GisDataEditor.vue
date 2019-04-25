<template>
    <div class="geom-data manager">

        <!-- Компонент Карты -->
        <ol-map :editor="true"
                v-on:modifyend="onModifyend"
                v-on:drawend="onDrawend"></ol-map>

        <a @click="$router.go(-1)" class="btn-come-back">
            <i class="fas fa-arrow-left"></i><label>назад</label>
        </a>

        <!-- Список слоев и элементов -->
        <div class="geom-data-list">

            <h2>Картографические слои</h2>

            <ul class="layers-list">
                <li class="layer-item" v-bind:class="{'empty': (layer.elements.length === 0)}"
                    v-for="(layer, i) in this.layerState.layers" :key="layer.id">

                    <!-- Строка со слоем -->
                    <span class="layer-item-content">
                        <button class="btn-checked layer-item-select" v-bind:class="{ checked: layer.checked }"
                                @click="selectLayer(i)"
                                :disabled="layer.elements.length === 0">
                        </button>
                        <label>{{layer.title}}</label>
                        <button class="layer-item-hidden"
                                @click="hiddenLayer(i)">
                                <i class="fas fa-angle-down" v-if="!layer.hidden"></i>
                                <i class="fas fa-angle-up" v-else></i>
                            </button>
                        <button class="btn-action btn-add-element"
                                title="Создать элемент"
                                v-show="!layer.hidden"
                                @click="createElement(i)">
                            <i class="fas fa-plus-circle"></i>
                        </button>
                    </span>

                    <!-- Список элементов слоя -->
                    <ul class="elements-list" v-show="!layer.hidden">
                        <li class="element-item" v-for="(element, j) in layer.elements" :key="element.id">

                            <span v-bind:class="{'is-editor': elementState.element.id === element.id}">

                                <button v-if="element.geometries_count !== 0"
                                        @click="selectElement(i, j)"
                                        class="btn-checked element-item-select"
                                        v-bind:class="{checked: element.checked}">
                                </button>
                                <i v-else class="fas fa-exclamation-triangle" title="Геометрия элемента не задана"></i>

                                <!-- Редактор элемента -->
                                <single-element v-if="elementState.element.id === element.id"></single-element>

                                <!-- Отображение элемента в списке -->
                                <label v-else v-bind:class="{warning: element.geometries_count === 0}">
                                    {{ element.title }}
                                    <button class="btn-action btn-edit" title="Редактировать элемент"
                                        @click="changeElement(i, j)">
                                        <i class="fa fa-pen"></i>
                                    </button>
                                    <button class="btn-action btn-delete" title="Удалить элемент"
                                            data-toggle="modal" data-target="#sureModal"
                                            @click="setSureModalContent(i, j)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </label>
                                <!-- конец Отображение элемента в списке -->

                            </span>

                        </li>
                    </ul>
                    <!-- конец Список элементов слоя -->

                </li>
            </ul>
        </div>
        <!-- конец Список слоев и элементов -->

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import GeometryState from '@/store/modules/gis/geometry/types';
    import LayerCompositionState from '@/store/modules/gis/layerComposition/types';
    import OlMap from '@/components/utils/Map/Map.vue';
    import SingleElement from './SingleElement.vue';
    import SureModal from '@/components/common/SureModal.vue';
    import {getGeometryTypeByGeom} from '@/domain/services/ol/FeatureService';
    import {editUpdatedItem} from '@/domain/services/common/UpdateItemService';

    @Component({
        components: { OlMap, SingleElement, SureModal },
    })
    export default class GisDataEditor extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;
        @State('gisGeometry') public geometryState!: GeometryState;
        @State('gisLayerComposition') public layerCompositionState!: LayerCompositionState;

        // Слои
        @Action public gisGetLayersToContractor: any;
        @Action public gisGetLayerCompositionsToContractor: any;
        @Action public selectedLayer: any;
        @Action public unselectedLayer: any;
        @Action public setCurrentIndex: any;
        @Action public unsetCurrentIndex: any;

        // Элементы
        @Action public updateElement: any;
        @Action public deleteElement: any;
        @Action public setSingleElement: any;
        @Action public unsetSingleElement: any;
        @Action public selectedElement: any;

        // Геометрия элемента
        @Action public updateGeometry: any;
        @Action public setSingleGeometry: any;

        // Интерфейсы
        @Action public setSureModal: any;

        // Карта
        @Action public setMapStyles: any;
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;
        @Action public setMapInteraction: any;
        @Action public focusOfFeatures: any;

        public async created() {
            await this.gisGetLayerCompositionsToContractor();
            await this.gisGetLayersToContractor();
            // Задаем стиль
            this.setMapStyles({
                styles: this.layerCompositionState.styles,
            });
        }

        /**
         * Выбрать элемент
         * @param i
         * @param j
         */
        public async selectElement(i, j) {
            // Получаем элемент и снимаем/ставим галочку
            const elements = this.layerState.layers[i].elements;
            elements[j].checked = !elements[j].checked;
            this.layerState.layers[i].elements = elements.slice(0);

            if (elements[j].checked) { // Если галочку поставили
                // Получаем геометрию элемента
                await this.selectedElement({ i, j });
                // Запоминаем ИД геообъектов для фокусировки на них
                const geometriesIds = [];
                // Рисуем на карте элемент
                this.layerState.layers[i].elements[j].geometries.forEach((geometry) => {
                    this.addFeatureToMap({
                        id: `${geometry.type}-${geometry.id}`,
                        layer_composition_id: geometry.layer_composition_id,
                        geom: geometry.geom,
                        property: geometry,
                    });
                    geometriesIds.push(`${geometry.type}-${geometry.id}`);
                });
                // Фокусируемся
                this.focusOfFeatures({ids: geometriesIds});
            } else { // Если галочку сняли
                // Стираем элемент с карты
                this.layerState.layers[i].elements[j].geometries.forEach((geometry) => {
                    this.removeFeatureFromMap({ id: `${geometry.type}-${geometry.id}` });
                });
            }
        }

        /**
         * Выбрать слой
         * @param i
         */
        public async selectLayer(i) {
            // Получаем слой и ставим/снимаем галочку
            const layers = this.layerState.layers;
            layers[i].checked = !layers[i].checked;

            if (layers[i].checked) { // Если галочку поставили
                // Для каждого элемента слоя так же ставим галочку и сбрасываем геометрию
                layers[i].elements.forEach((element) => {
                    element.checked = layers[i].checked;
                    element.geometries = [];
                });
                // Запрос на получение геометрии каждого элемента слоя
                await this.selectedLayer({ i });
                // Запоминаем ИД геообъектов для фокусировки на них
                const geometriesIds = [];
                // Рисуем все элементы на карте
                this.layerState.layers[i].elements.forEach((element) => {
                    element.geometries.forEach((geometry) => {
                        this.addFeatureToMap({
                            id: `${geometry.type}-${geometry.id}`,
                            layer_composition_id: geometry.layer_composition_id,
                            geom: geometry.geom,
                            property: geometry,
                        });
                        geometriesIds.push(`${geometry.type}-${geometry.id}`);
                    });
                });
                // Фокусируемся
                this.focusOfFeatures({ids: geometriesIds});
            } else { // Если галочку сняли
                // Удаляем все элементы с карты
                this.layerState.layers[i].elements.forEach((element) => {
                    element.geometries.forEach((geometry) => {
                        this.removeFeatureFromMap({ id: `${geometry.type}-${geometry.id}` });
                    });
                });
                // Для каждого элемента слоя так же ставим галочку и сбрасываем геометрию
                layers[i].elements.forEach((element) => {
                    element.checked = layers[i].checked;
                    element.geometries = [];
                });
            }
            this.layerState.layers = layers.slice(0);
        }

        /**
         * Скрыть / отобразить слой
         */
        public hiddenLayer(i) {
            const layers = this.layerState.layers;
            layers[i].hidden = !layers[i].hidden;
            this.layerState.layers = layers.slice(0);
        }

        /**
         * Режим создания нового элемента
         * @param i
         */
        public async createElement(i) {
            // Очищаем singleElement (присваиваем значения по-умолчанию)
            this.unsetSingleElement({ layerId: this.layerState.layers[i].id });
            // Сохраняем в Базу
            await this.updateElement();
            // Добавляем в список
            this.layerState.layers[i].elements.push(this.elementState.element);
            // Запоминаем индексы элемента в списке
            this.setCurrentIndex({
                layerIndex: i,
                elementIndex: (this.layerState.layers[i].elements.length - 1),
            });
        }

        /**
         * Режим изменения Элемента
         */
        public async changeElement(i, j) {

            // Если элемент не выбран - выбрать
            if (!this.layerState.layers[i].elements[j].checked) {
                await this.selectElement(i, j);
            }

            // Запоминаем для дальнейших изменений
            this.setSingleElement({ element: this.layerState.layers[i].elements[j] });
            // Запоминаем индексы элемента в списке
            this.setCurrentIndex({
                layerIndex: i,
                elementIndex: j,
            });
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param i
         * @param j
         */
        public setSureModalContent(i, j) {
            const element = Object.assign({}, this.layerState.layers[i].elements[j]);
            this.setSureModal({
                title: 'Удалить элемент?',
                text: `Вы уверены, что хотите удалить элемент "${element.title}" из системы?`,
                action: async () => {
                    // Запрос на удаление элемента
                    await this.deleteElement({
                        elementId: element.id,
                        elementTitle: element.title,
                    });
                    // Удаляем с карты
                    if (this.layerState.layers[i].elements[j].geometries) {
                        this.layerState.layers[i].elements[j].geometries.forEach((geometry) => {
                            this.removeFeatureFromMap({ id: geometry.id });
                        });
                    }
                    // Удаляем элемент из списка
                    this.layerState.layers[i].elements.splice(j, 1);
                    // Сбросить индекс текущего выбранного слоя и элемента
                    this.unsetCurrentIndex();
                },
            });
        }

        /**
         * Изменили геометрию геообъекта
         * @param e
         */
        public onModifyend(e) {
            // Присваиваем значения для SingleGeometry
            this.setSingleGeometry({
                id: e.properties.id,
                title: e.properties.title,
                description: e.properties.description,
                geom: e.geom,
                layer_composition_id: e.properties.layer_composition_id,
            });
            // Сохраняем в базу
            this.updateGeometry({ type: e.properties.type });
        }

        /**
         * Добавили новый геообъект
         */
        public async onDrawend(e) {

            const geometryId = this.geometryState.geometry.id;

            // Обновляем геометрию
            this.geometryState.geometry.geom = e.geom;
            this.geometryState.geometry.type = getGeometryTypeByGeom(e.geom);
            await this.updateGeometry({
                type: getGeometryTypeByGeom(e.geom),
                elementId: this.elementState.element.id,
            });

            // Меняем режим работы с картой
            this.setMapInteraction({ mode: '' });

            if (geometryId === 0) {
                // Добавляем геометрию к элементу
                this.elementState.element.geometries.push(this.geometryState.geometry);
            } else {
                this.elementState.element.geometries =
                    editUpdatedItem(this.elementState.element.geometries, this.geometryState.geometry);
            }

            // Находим элемент в списке и меняем его данные
            const i = this.layerState.currentLayerIndex;
            const j = this.layerState.currentElementIndex;
            this.layerState.layers[i].elements[j] =
                Object.assign({}, this.layerState.layers[i].elements[j], this.elementState.element);

            // Перерисовывем на карте
            this.layerState.layers[i].elements[j].geometries.forEach((geometry) => {
                this.removeFeatureFromMap({ id: `${geometry.type}-${geometry.id}` });
                this.addFeatureToMap({
                    id: `${geometry.type}-${geometry.id}`,
                    layer_composition_id: geometry.layer_composition_id,
                    geom: geometry.geom,
                    property: geometry,
                });
            });

        }
    }
</script>
