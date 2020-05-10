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
        @State('konstructor') public constructorState: ConstructorState;

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

        public async created() {
            await this.gisGetLayersToContractor();
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

                // Стираем старые линии
                if (this.linksList[elements[j].id]) {
                    this.linksList[elements[j].id].forEach((id) => {
                        this.removeFeatureFromMap({ id });
                    });
                    this.linksList[elements[j].id] = [];
                }
            }

            // Связь между точками
            this.drawElementsList();

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

            // Связь между точками
            this.drawElementsList();

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
         * Отобразить связанный список на карте
         */
        public drawElementsList() {

            // Стираем старые линии
            this.pointList.forEach((id) => {
                this.removeFeatureFromMap({ id });
            });
            this.pointList = [];

            // Рисуем новые линии
            const layers = this.layerState.layers.filter((a) => {
                return (a.geometry_type === 'point' && a.style.list && a.style.list.visibility);
            });
            layers.forEach((layer) => {
                layer.elements.filter((a) => {
                    return (a.checked && a.element_next_id);
                }).forEach((element) => {
                    const next = layer.elements.find((a) => {
                        return (a.id === element.element_next_id && a.checked);
                    });
                    if (next) {
                        let x = '';
                        let y = '';
                        let geometry = /^POINT\((.+)\)$/.exec(element.geometry);
                        if (geometry.length === 2) {
                            x = geometry[1];
                        }
                        geometry = /^POINT\((.+)\)$/.exec(next.geometry);
                        if (geometry.length === 2) {
                            y = geometry[1];
                        }
                        if (x !== '' && y !== '') {
                            // Рисуем на карте элемент
                            this.addFeatureToMap({
                                id: `${element.id}:${next.id}`,
                                geom: `LINESTRING(${x}, ${y})`,
                                property: {
                                    id: element.id,
                                    element_next_id: next.id,
                                    revision: 3,
                                },
                                style: {
                                    id: layer.id,
                                    font: Object.assign({}, layer.style.font),
                                    stroke: {
                                        color: layer.style.list.color,
                                        opacity: layer.style.list.opacity,
                                        width: 1,
                                    },
                                },
                            });
                            // Запоминаем линии
                            this.pointList.push(`${element.id}:${next.id}`);
                        }
                    }
                });
            });
        }

        /**
         * Отобразить связанные элементы (через доп. поля карточки)
         */
        public async showLinkElements(i, j) {

            const element = this.layerState.layers[i].elements[j];
            const result = await axios.get(`${baseUrlAPI}gis/element/link/${element.id}`);

            // Стираем старые линии
            if (this.linksList[element.id]) {
                this.linksList[element.id].forEach((id) => {
                    this.removeFeatureFromMap({ id });
                });
            }
            this.linksList[element.id] = [];

            for (const i in result.data) {

                // Отображение дочернего элемента
                this.addFeatureToMap({
                    id: result.data[i].element_id,
                    layer_id: result.data[i].data.layer_id,
                    geom: result.data[i].data.geometry,
                    property: {
                        id: result.data[i].element_id,
                        parent_id: result.data[i].parent.id,
                        title: result.data[i].data.title,
                        revision: 3,
                    },
                    style: JSON.parse(result.data[i].data.style),
                });

                // Запоминаем связанные элементы
                this.linksList[element.id].push(result.data[i].element_id);

                // Отображение связи между элементами
                let x = '';
                let y = '';
                let geometry = /^POINT\((.+)\)$/.exec(result.data[i].parent.geometry);
                if (geometry.length === 2) {
                    x = geometry[1];
                }
                geometry = /^POINT\((.+)\)$/.exec(result.data[i].data.geometry);
                if (geometry.length === 2) {
                    y = geometry[1];
                }
                if (x !== '' && y !== '') {

                    // Рисуем на карте элемент
                    this.addFeatureToMap({
                        id: `${result.data[i].parent.id}-${result.data[i].element_id}`,
                        geom: `LINESTRING(${x}, ${y})`,
                        property: { id: element.id },
                        style: {
                            id: result.data[i].data.layer_id,
                            stroke: { color: '#000000', width: 1 },
                        },
                    });

                    // Запоминаем линии
                    this.linksList[element.id].push(`${result.data[i].parent.id}-${result.data[i].element_id}`);

                }
            }
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
            // Меняем режим работы карты на рисование
            this.setMapInteraction({ mode: this.layerState.layers[i].geometry_type });
        }

        /**
         * Режим изменения Элемента
         */
        public async changeElement(i, j) {

            // Если элемент не выбран - выбрать
            if (!this.layerState.layers[i].elements[j].checked) {
                await this.selectElement(i, j);
            }

            this.constructorState.element = this.layerState.layers[i].elements[j];
            this.getAdditionalData({layerId: this.layerState.layers[i].id});

            // Запоминаем для дальнейших изменений
            this.setSingleElement({ element: this.layerState.layers[i].elements[j] });

            // Запоминаем индексы элемента в списке
            this.setCurrentIndex({
                layerIndex: i,
                elementIndex: j,
            });

        }

        /**
         * Переключаем режим на рисование нового элемента
         */
        public addGeomery(i, j) {
            this.setSingleElement({ element: this.layerState.layers[i].elements[j] });
            if (!this.layerState.layers[i].elements[j].geometry) {
                // Меняем режим работы карты на 'рисование'
                this.setMapInteraction({ mode: this.layerState.layers[i].geometry_type });
            }
            // Запоминаем индексы элемента в списке
            this.setCurrentIndex({
                layerIndex: i,
                elementIndex: j,
            });
        }

        /**
         * Выкинуть окно: 'Вы уверены, что хотите удалить?'
         * @param i
         * @param j
         */
        public setSureModalContent(i, j) {
            const element = Object.assign({}, this.layerState.layers[i].elements[j]);
            this.setSureModal({
                title: 'Удалить элемент?',
                text: `Вы уверены, что хотите удалить элемент '${element.title}' из системы?`,
                action: async () => {
                    // Запрос на удаление элемента
                    await this.deleteElement({
                        elementId: element.id,
                        elementTitle: element.title,
                    });
                    // Удаляем с карты
                    if (this.layerState.layers[i].elements[j].geometry) {
                        this.removeFeatureFromMap({ id: this.layerState.layers[i].elements[j].id });
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
            this.updateGeometry({
                id: e.properties.id,
                geometry: e.geom,
            });
        }

        /**
         * Добавили новый геообъект
         */
        public async onDrawend(e) {

            // Обновляем геометрию
            this.elementState.element.geometry = e.geom;
            this.updateGeometry({
                id: this.elementState.element.id,
                geometry: e.geom,
            });

            // Меняем режим работы с картой
            this.setMapInteraction({ mode: '' });

            // Рисуем на карте элемент
            this.addFeatureToMap({
                id: this.elementState.element.id,
                layer_id: this.elementState.element.layer_id,
                geom: this.elementState.element.geometry,
                property: this.getPropertiesElement(this.elementState.element),
            });

            // Меняем в списке
            if (this.layerState.currentLayerIndex !== undefined && this.layerState.currentElementIndex !== undefined) {
                this.layerState.layers[this.layerState.currentLayerIndex].elements.splice(
                    this.layerState.currentElementIndex, 1,
                    Object.assign({}, this.elementState.element, { checked: true }));
            }

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
                revision: 3,
            };
        }

    }
</script>
