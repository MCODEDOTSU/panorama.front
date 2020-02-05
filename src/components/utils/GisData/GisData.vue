<template>
    <div class="geom-data manager">

        <!-- Компонент Карты -->
        <ol-map :editor="false"></ol-map>

        <a @click="$router.go(-1)" class="btn-come-back">
            <i class="fas fa-arrow-left"></i><label>назад</label>
        </a>

        <!-- Список слоев и элементов -->
        <div class="geom-data-list">

            <ul class="layers-list">
                <li class="layer-item" v-bind:class="{'empty': (layer.elements.length === 0)}"
                    v-for="(layer, i) in this.layerState.layers" :key="layer.id">

                    <!-- Строка со слоем -->
                    <span class="layer-item-content">
                        <div class="btn-checked layer-item-select" v-bind:class="{ checked: layer.checked }"
                             @click="selectLayer(i)"
                             :disabled="layer.elements.length === 0">
                        </div>
                        <label>{{layer.title}}</label>
                        <div class="btn layer-item-hidden" v-if="layer.elements.length !== 0"
                             @click="hiddenLayer(i)">
                                <i class="fas fa-angle-down" v-if="!layer.hidden"></i>
                                <i class="fas fa-angle-up" v-else></i>
                        </div>
                    </span>

                    <!-- Список элементов слоя -->
                    <ul class="elements-list" v-show="!layer.hidden">
                        <li class="element-item" v-for="(element, j) in layer.elements" :key="element.id" v-if="element.geometry">
                            <span>
                                <div @click="selectElement(i, j)"
                                     class="btn-checked element-item-select"
                                     v-bind:class="{checked: element.checked}">
                                </div>
                                <label>{{ element.title }}</label>
                            </span>
                        </li>
                    </ul>
                    <!-- конец Список элементов слоя -->

                </li>
            </ul>
        </div>
        <!-- конец Список слоев и элементов -->

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import OlMap from '@/components/utils/Map/Map.vue';
    import {getGeometryTypeByGeom} from '@/domain/services/ol/FeatureService';
    import {editUpdatedItem} from '@/domain/services/common/UpdateItemService';

    @Component({
        components: {OlMap},
    })
    export default class GisDataEditor extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;

        // Слои
        @Action public gisGetLayers: any;
        @Action public selectedLayer: any;
        @Action public unselectedLayer: any;
        @Action public setCurrentIndex: any;
        @Action public unsetCurrentIndex: any;

        // Элементы
        @Action public setSingleElement: any;
        @Action public unsetSingleElement: any;
        @Action public selectedElement: any;

        // Карта
        @Action public setMapStyles: any;
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;
        @Action public focusOfFeature: any;
        @Action public focusOfFeatures: any;

        public async created() {
            await this.gisGetLayers();
            // Задаем стиль
            this.setMapStyles({
                styles: this.layerState.styles,
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
                // Рисуем на карте элемент
                this.addFeatureToMap({
                    id: elements[j].id,
                    layer_id: this.layerState.layers[i].id,
                    geom: elements[j].geometry,
                    property: this.getPropertiesElement(elements[j]),
                });
                this.focusOfFeature({id: elements[j].id});
            } else { // Если галочку сняли
                // Стираем элемент с карты
                this.removeFeatureFromMap({id: elements[j].id});
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
                });
                // Запоминаем ИД геообъектов для фокусировки на них
                const ids = [];
                // Рисуем все элементы на карте
                this.layerState.layers[i].elements.forEach((element) => {
                    // Рисуем на карте элемент
                    this.addFeatureToMap({
                        id: element.id,
                        layer_id: this.layerState.layers[i].id,
                        geom: element.geometry,
                        property: this.getPropertiesElement(element),
                    });
                    ids.push(element.id);
                });
                // Фокусируемся
                this.focusOfFeatures({ids});
            } else { // Если галочку сняли
                // Удаляем все элементы с карты
                this.layerState.layers[i].elements.forEach((element) => {
                    // Стираем элемент с карты
                    this.removeFeatureFromMap({id: element.id});
                });
                // Для каждого элемента слоя так же ставим галочку и сбрасываем геометрию
                layers[i].elements.forEach((element) => {
                    element.checked = layers[i].checked;
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
         * Сформировать свойства элемента
         * @param element
         */
        public getPropertiesElement(element) {
            return {
                id: element.id,
                title: element.title,
                description: element.description,
                lenght: element.lenght,
                area: element.area,
                perimeter: element.perimeter,
            };
        }

    }
</script>
