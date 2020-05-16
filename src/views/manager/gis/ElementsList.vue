<template>
    <div class="elements-list" ref="elements-list">

        <h2>
            <div title="Вернуться к списку слоёв" class="btn" @click="getLayersList()">
                <i class="fa fa-angle-left"></i>
            </div>
            <div @click="selectLayer()" class="btn-checked" v-bind:class="{checked: checkedAll}"
                 title="Отобразить все элементы на карте"></div>
            {{ layerState.layer.title }}
            <div class="btn btn-action btn-add-element"
                 title="Создать элемент" @click="createElement()">
                <i class="fas fa-plus-circle"></i>
            </div>
        </h2>

        <ul class="data-list elements-list">
            <li class="element-item" v-for="(element, i) in elementState.elements" :key="element.id">

                <!-- Строка со слоем -->
                <span class="element-item-content">

                    <div v-if="element.geometry" @click="selectElement(i)" class="btn-checked element-item-select"
                         v-bind:class="{checked: element.checked}" title="Отобразить на карте"></div>
                    <i v-else @click="addGeomery(i)" class="fa fa-exclamation-triangle"></i>

                    <label>{{ element.title }}</label>

                    <!-- Кнопка "Отобразить связанные элементы" -->
                    <button class="btn-action btn-show-link" title="Отобразить связанные элементы"
                            v-bind:class="{active: (linksList[element.id] && linksList[element.id].length > 0)}"
                            @click="showLinkElements(i)">
                        <i class="fa fa-link"></i>
                    </button>

                    <!-- Кнопка "Редактировать" -->
                    <button class="btn-action btn-edit" title="Редактировать элемент"
                            @click="getSingleElement(i)">
                    <i class="fa fa-pen"></i>
                    </button>

                    <!-- Кнопка "Удалить" -->
                    <button class="btn-action btn-delete" title="Удалить элемент"
                            data-toggle="modal" data-target="#sureModal"
                            @click="setSureModalContent(i)">
                    <i class="fas fa-trash"></i>
                    </button>

                </span>

            </li>
        </ul>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrlAPI} from '@/globals';
    import axios from 'axios';

    import SureModal from '@/components/common/SureModal.vue';

    import LayerState from '@/store/modules/layer/types';
    import ElementState from '@/store/modules/element/types';

    @Component({
        components: {SureModal},
    })
    export default class ElementsList extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        // Элементы
        @Action public managerElementGetAll: any;
        @Action public setSingleManagerElement: any;
        @Action public unsetSingleManagerElement: any;
        @Action public managerUpdateElement: any;
        @Action public deleteManagerElement: any;

        // Слои
        @Action public unsetSingleManagerLayer: any;

        // Карта
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;
        @Action public focusOfFeature: any;
        @Action public focusOfFeatures: any;
        @Action public setMapInteraction: any;

        @Provide() public checkedAll = false;
        @Provide('pointList') public pointList = [];
        @Provide('linksList') public linksList = {};

        // Интерфейсы
        @Action public setSureModal: any;

        public async mounted() {
            localStorage.setItem('layerState.layer', JSON.stringify(this.layerState.layer));
            await this.managerElementGetAll({layerId: this.layerState.layer.id});
        }

        /**
         * Вернуть к списку слоёв
         */
        public getLayersList() {

            this.elementState.elements.forEach((element) => {

                this.removeFeatureFromMap({id: element.id});

                // Стираем старые линии
                const linksList = Object.assign({}, this.linksList);
                if (linksList[element.id]) {
                    linksList[element.id].forEach((id) => {
                        this.removeFeatureFromMap({id});
                    });
                }
                linksList[element.id] = [];
                this.linksList = Object.assign({}, linksList);

            });

            localStorage.removeItem('layerState.layer');
            this.unsetSingleManagerLayer();
        }

        /**
         * Выбрать слой
         */
        public async selectLayer() {

            this.checkedAll = !this.checkedAll;

            this.elementState.elements = this.elementState.elements.map((element) => {
                return Object.assign({}, element, {checked: this.checkedAll});
            });

            this.elementState.elements.forEach((element) => {

                if (this.checkedAll === true) {
                    this.drawElement(element);
                } else {
                    this.removeFeatureFromMap({id: element.id});

                    // Стираем старые линии
                    const linksList = Object.assign({}, this.linksList);
                    if (linksList[element.id]) {
                        linksList[element.id].forEach((id) => {
                            this.removeFeatureFromMap({id});
                        });
                    }
                    linksList[element.id] = [];
                    this.linksList = Object.assign({}, linksList);

                }

            });

            const ids = this.elementState.elements.map((element) => {
                return element.id;
            });

            this.focusOfFeatures({ids});

            // this.drawElementsList();

        }

        /**
         * Выбрать элемент
         * @param i
         */
        public async selectElement(i) {

            const checked = this.elementState.elements[i].checked === true ? false : true;
            const element = Object.assign({}, this.elementState.elements[i], {checked});
            this.elementState.elements.splice(i, 1, element);

            if (checked === true) {
                this.drawElement(element);
                this.focusOfFeature({id: element.id});
            } else {
                this.removeFeatureFromMap({id: element.id});
                this.checkedAll = false;

                // Стираем старые линии
                const linksList = Object.assign({}, this.linksList);
                if (linksList[element.id]) {
                    linksList[element.id].forEach((id) => {
                        this.removeFeatureFromMap({id});
                    });
                }
                linksList[element.id] = [];
                this.linksList = Object.assign({}, linksList);

            }

            // this.drawElementsList();

        }

        /**
         * Режим создания нового элемента
         */
        public async createElement() {

            // Очищаем singleElement (присваиваем значения по-умолчанию)
            this.unsetSingleManagerElement({layer_id: this.layerState.layer.id});

            // Сохраняем в Базу
            await this.managerUpdateElement();

            // Меняем режим работы карты на рисование
            this.setMapInteraction({mode: this.layerState.layer.geometry_type});
        }

        /**
         *  Переключаем режим на рисование нового элемента
         *  @param i
         */
        public addGeomery(i) {
            const element = Object.assign({}, this.elementState.elements[i]);
            this.setSingleManagerElement({element});
            if (!element.geometry) {
                // Меняем режим работы карты на "рисование"
                this.setMapInteraction({mode: this.layerState.layer.geometry_type});
            }
        }

        /**
         * Переключиться в редактор геоэлемента
         */
        public getSingleElement(i) {

            const element = Object.assign({}, this.elementState.elements[i]);

            if (element.checked === undefined || element.checked === false) {
                this.selectElement(i);
            }

            this.setSingleManagerElement({ element });

        }

        /**
         * Отобразить связанные элементы (через доп. поля карточки)
         */
        public async showLinkElements(i) {

            const element = Object.assign({}, this.elementState.elements[i]);

            if (element.checked === undefined || element.checked === false) {
                this.selectElement(i);
            }

            // Стираем старые линии
            const linksList = Object.assign({}, this.linksList);

            if (linksList[element.id] === undefined || linksList[element.id].length === 0) {

                const result = await axios.get(`${baseUrlAPI}gis/element/link/${element.id}`);
                linksList[element.id] = [];

                for (const i in result.data) {

                    const child = result.data[i];

                    this.drawElement(child);

                    // Запоминаем связанные элементы
                    linksList[element.id].push(child.id);

                    // Отображение связи между элементами
                    let x = '';
                    let y = '';
                    let geometry = /^POINT\((.+)\)$/.exec(child.parent.geometry);
                    if (geometry.length === 2) {
                        x = geometry[1];
                    }
                    geometry = /^POINT\((.+)\)$/.exec(child.geometry);
                    if (geometry.length === 2) {
                        y = geometry[1];
                    }

                    if (x === '' || y === '') {
                        continue;
                    }

                    // Рисуем на карте элемент
                    this.addFeatureToMap({
                        id: `${child.parent.id}-${child.id}`,
                        geom: `LINESTRING(${x}, ${y})`,
                        property: {id: element.id},
                        style: {
                            id: child.layer_id,
                            stroke: {color: '#000000', width: 1},
                        },
                    });

                    // Запоминаем линии
                    linksList[element.id].push(`${child.parent.id}-${child.id}`);
                }

                this.focusOfFeatures({ids: linksList[element.id]});

            } else {

                linksList[element.id].forEach((id) => {
                    this.removeFeatureFromMap({id});
                });
                linksList[element.id] = [];

            }

            this.linksList = Object.assign({}, linksList);

        }

        public drawElement(element) {
            this.addFeatureToMap({
                id: element.id,
                layer_id: element.layer_id,
                geom: element.geometry,
                property: {
                    id: element.id,
                    title: element.title,
                    description: element.description,
                    lenght: element.lenght,
                    area: element.area,
                    perimeter: element.perimeter,
                    revision: 3,
                },
            });
        }

        /**
         * Удалить Элемент
         * @param i
         */
        public setSureModalContent(i) {

            const element = Object.assign({}, this.elementState.elements[i]);

            this.setSureModal({
                title: 'Удалить элемент?',
                text: `Вы уверены, что хотите удалить элемент '${element.title}' из системы?`,
                action: async () => {

                    // Запрос на удаление элемента
                    await this.deleteManagerElement({
                        elementId: element.id,
                        elementTitle: element.title,
                    });

                    // Удаляем с карты
                    if (element.geometry) {
                        this.removeFeatureFromMap({id: element.id});
                    }

                    // Удаляем элемент из списка
                    this.elementState.elements.splice(i, 1);


                },
            });
        }

        /**
         * Отобразить связанный список на карте
         */
        // public drawElementsList() {

        // // Стираем старые линии
        // this.pointList.forEach((id) => {
        //     this.removeFeatureFromMap({ id });
        // });
        // this.pointList = [];
        //
        // // Рисуем новые линии
        // const layers = this.layerState.layers.filter((a) => {
        //     return (a.geometry_type === 'point' && a.style.list && a.style.list.visibility);
        // });
        // layers.forEach((layer) => {
        //     layer.elements.filter((a) => {
        //         return (a.checked && a.element_next_id);
        //     }).forEach((element) => {
        //         const next = layer.elements.find((a) => {
        //             return (a.id === element.element_next_id && a.checked);
        //         });
        //         if (next) {
        //             let x = '';
        //             let y = '';
        //             let geometry = /^POINT\((.+)\)$/.exec(element.geometry);
        //             if (geometry.length === 2) {
        //                 x = geometry[1];
        //             }
        //             geometry = /^POINT\((.+)\)$/.exec(next.geometry);
        //             if (geometry.length === 2) {
        //                 y = geometry[1];
        //             }
        //             if (x !== '' && y !== '') {
        //                 // Рисуем на карте элемент
        //                 this.addFeatureToMap({
        //                     id: `${element.id}:${next.id}`,
        //                     geom: `LINESTRING(${x}, ${y})`,
        //                     property: {
        //                         id: element.id,
        //                         element_next_id: next.id,
        //                         revision: 3,
        //                     },
        //                     style: {
        //                         id: layer.id,
        //                         font: Object.assign({}, layer.style.font),
        //                         stroke: {
        //                             color: layer.style.list.color,
        //                             opacity: layer.style.list.opacity,
        //                             width: 1,
        //                         },
        //                     },
        //                 });
        //                 // Запоминаем линии
        //                 this.pointList.push(`${element.id}:${next.id}`);
        //             }
        //         }
        //     });
        // });
        // }

    }

</script>