<template>
    <div class='geom-data manager'>

        <!-- Компонент Карты -->
        <ol-map :editor='true'
                v-on:modifyend='onModifyend'
                v-on:drawend='onDrawend'></ol-map>

        <a @click='$router.go(-1)' class='btn-come-back'>
            <i class='fas fa-arrow-left'></i><label>назад</label>
        </a>

        <!-- Список слоев и элементов -->
        <div class='geom-data-list'>

            <h2>Картографические слои</h2>

            <ul class='layers-list'>
                <li class='layer-item' v-bind:class='{empty: (layer.elements.length === 0)}'
                    v-for='(layer, i) in this.layerState.layers' :key='layer.id'>

                    <!-- Строка со слоем -->
                    <span class='layer-item-content'>
                        <div class='btn-checked layer-item-select' v-bind:class='{ checked: layer.checked }'
                             @click='selectLayer(i)'
                             :disabled='layer.elements.length === 0'>
                        </div>
                        <label>{{layer.title}}</label>
                        <div class='btn layer-item-hidden' v-if='layer.elements.length !== 0'
                             @click='hiddenLayer(i)'>
                                <i class='fas fa-angle-down' v-if='!layer.hidden'></i>
                                <i class='fas fa-angle-up' v-else></i>
                        </div>
                        <div class='btn btn-action btn-add-element'
                             v-bind:class='{empty: (layer.elements.length === 0)}'
                             title='Создать элемент'
                             @click='createElement(i)'>
                            <i class='fas fa-plus-circle'></i>
                        </div>
                    </span>

                    <!-- Список элементов слоя -->
                    <ul class='elements-list' v-show='!layer.hidden'>
                        <li class='element-item' v-for='(element, j) in layer.elements' :key='element.id'>

                            <span>

                                <div v-if='element.geometry'
                                     @click='selectElement(i, j)'
                                     class='btn-checked element-item-select'
                                     v-bind:class='{checked: element.checked}'>
                                </div>
                                <i v-else class='fas fa-exclamation-triangle' title='Геометрия элемента не задана'
                                    @click="addGeomery(i, j)"></i>

                                <!-- Отображение элемента в списке -->
                                <label v-bind:class='{warning: !element.geometry}'>
                                    {{ element.title }}

                                    <!-- Кнопка "Отобразить связанные элементы" -->
                                    <button class='btn-action btn-show-link' title='Отобразить связанные элементы'
                                            v-if="element.checked === true"
                                            @click='showLinkElements(i ,j)'>
                                        <i class='fa fa-link'></i>
                                    </button>

                                    <!-- Кнопка "Редактировать" -->
                                    <button class='btn-action btn-edit' title='Редактировать элемент'
                                            v-b-modal="'singleElement'"
                                            @click='changeElement(i ,j)'>
                                        <i class='fa fa-pen'></i>
                                    </button>

                                    <!-- Кнопка "Удалить" -->
                                    <button class='btn-action btn-delete' title='Удалить элемент'
                                            data-toggle='modal' data-target='#sureModal'
                                            @click='setSureModalContent(i, j)'>
                                        <i class='fas fa-trash'></i>
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

        <single-element></single-element>

    </div>
</template>

<script lang='ts'>

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import ConstructorState from '@/store/modules/constructor/types';
    import OlMap from '@/components/utils/Map/Map.vue';
    import SingleElement from './SingleElement.vue';
    import SureModal from '@/components/common/SureModal.vue';
    import {getGeometryTypeByGeom} from '@/domain/services/ol/FeatureService';
    import {editUpdatedItem} from '@/domain/services/common/UpdateItemService';
    import {baseUrlAPI} from '@/globals';
    import axios from 'axios';

    @Component({
        components: {OlMap, SingleElement, SureModal},
    })
    export default class GisDataEditor extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        // Слои
        @Action public gisGetLayersToContractor: any;
        @Action public selectedLayer: any;
        @Action public unselectedLayer: any;
        @Action public setCurrentIndex: any;
        @Action public unsetCurrentIndex: any;

        // Элементы
        @Action public updateElement: any;
        @Action public updateGeometry: any;
        @Action public deleteElement: any;
        @Action public setSingleElement: any;
        @Action public unsetSingleElement: any;
        @Action public selectedElement: any;
        @Action public getAdditionalData: any;

        // Интерфейсы
        @Action public setSureModal: any;

        // Карта
        @Action public setMapStyles: any;
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;
        @Action public setMapInteraction: any;
        @Action public focusOfFeature: any;
        @Action public focusOfFeatures: any;

        @Provide('pointList') public pointList = [];
        @Provide('linksList') public linksList = {};


    }
</script>
