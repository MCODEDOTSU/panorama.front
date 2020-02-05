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
                             v-show='!layer.hidden'
                             @click='createElement(i)'>
                            <i class='fas fa-plus-circle'></i>
                        </div>
                    </span>

                    <!-- Список элементов слоя -->
                    <ul class='elements-list' v-show='!layer.hidden'>
                        <li class='element-item' v-for='(element, j) in layer.elements' :key='element.id'>

                            <span v-bind:class='{editor: elementState.element.id === element.id}'>

                                <div v-if='element.geometry'
                                     @click='selectElement(i, j)'
                                     class='btn-checked element-item-select'
                                     v-bind:class='{checked: element.checked}'>
                                </div>
                                <i v-else class='fas fa-exclamation-triangle' title='Геометрия элемента не задана'></i>

                                <!-- Редактор элемента -->
                                <single-element v-if='elementState.element.id === element.id'></single-element>

                                <!-- Отображение элемента в списке -->
                                <label v-else v-bind:class='{warning: !element.geometry}'>
                                    {{ element.title }}
                                    <button class='btn-action btn-edit' title='Редактировать элемент'
                                            @click='changeElement(i, j)'>
                                        <i class='fa fa-pen'></i>
                                    </button>
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

    </div>
</template>

<script lang='ts'>

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import OlMap from '@/components/utils/Map/Map.vue';
    import SingleElement from './SingleElement.vue';
    import SureModal from '@/components/common/SureModal.vue';
    import {getGeometryTypeByGeom} from '@/domain/services/ol/FeatureService';
    import {editUpdatedItem} from '@/domain/services/common/UpdateItemService';

    @Component({
        components: {OlMap, SingleElement, SureModal},
    })
    export default class GisDataEditor extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;

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
         * Отобразить связанный элементов на карте
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

            // Запоминаем для дальнейших изменений
            this.setSingleElement({ element: this.layerState.layers[i].elements[j] });
            // Запоминаем индексы элемента в списке
            this.setCurrentIndex({
                layerIndex: i,
                elementIndex: j,
            });

            if (!this.layerState.layers[i].elements[j].geometry) {
                // Меняем режим работы карты на 'рисование'
                this.setMapInteraction({ mode: this.layerState.layers[i].geometry_type });
            }

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
