<template>
    <div class="elements-list" ref="elements-list">

        <h2>
            <div title="Вернуться к списку слоёв" class="btn" @click="getLayersList()">
                <i class="fa fa-angle-left"></i>
            </div>
            <div @click="selectLayer()" class="btn-checked" v-bind:class="{checked: checkedAll}"
                 title="Отобразить все элементы на карте"></div>
            {{ layerState.layer.title }}

            <!-- Кнопка "Создать Несколько Элементов" -->
            <div class="btn btn-action btn-magic-element"
                 title="Массовое создание Элементов" @click="managerMagicElementSetSingle({ layer_id: layerState.layer.id })">
                <i class="fas fa-magic"></i>
            </div>

            <!-- Кнопка "Создать Элемент" -->
            <div class="btn btn-action btn-add-element"
                 title="Создать элемент" @click="createElement()">
                <i class="fas fa-plus-circle"></i>
            </div>

            <!-- Кнопка "Массовое Удаление Элементов" -->
            <div class="btn btn-action btn-delete-element"
                 data-toggle="modal" data-target="#sureModal"
                 v-if="resolvedDeleteAllButtonShow"
                 title="Удалить все отмеченные Элементы" @click="setSureModalContentDeleteAll()">
                <i class="fas fa-trash"></i>
            </div>

        </h2>

        <div class="scroll-container">

            <vue-scrollbar class="scrollbar scrollbar-min" ref="Scrollbar">

                <ul class="data-list elements-list">

                    <li class="element-item" v-for="(element, i) in elementState.elements" :key="element.id">

                        <!-- Строка со слоем -->
                        <span class="element-item-content">

                            <div v-if="element.geometry" @click="selectElement(i)" class="btn-checked element-item-select"
                                 v-bind:class="{checked: element.checked}" title="Отобразить на карте"></div>
                            <i v-else @click="addGeomery(i)" class="fa fa-exclamation-triangle"></i>

                            <label v-if="element.checked === true" @click="focusOfFeature({ id: element.id })" title="Показать элемент">{{ element.title }}</label>
                            <label v-else @click="selectElement(i)" title="Показать элемент">{{ element.title }}</label>

                            <!-- Кнопка "Отобразить связанные элементы" -->
                            <button class="btn-action btn-show-link" title="Отобразить связанные элементы"
                                    v-if="element.next !== undefined && element.next.length !== 0"
                                    v-bind:class="{active: element.showGraph}"
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

            </vue-scrollbar>

        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrlAPI} from '@/globals';
    import axios from 'axios';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';

    @Component({})
    export default class ElementsList extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        // Элементы
        @Action public managerElementGetByLayer: any;
        @Action public managerElementSetSingle: any;
        @Action public managerElementUnsetSingle: any;
        @Action public managerElementUpdate: any;
        @Action public managerElementDelete: any;
        @Action public managerElementDeleteChecked: any;
        @Action public managerElementGetGraph: any;
        @Action public managerMagicElementSetSingle: any;
        @Action public managerMagicElementUnsetSingle: any;

        // Слои
        @Action public managerLayerUnsetSingle: any;

        // Карта
        @Action public addFeatureToMap: any;
        @Action public addFeaturesArrowToMap: any;
        @Action public removeFeatureFromMap: any;
        @Action public removeFeaturesArrowFromMap: any;
        @Action public focusOfFeature: any;
        @Action public focusOfFeatures: any;
        @Action public setInteraction: any;

        @Provide() public checkedAll = false;

        // Интерфейсы
        @Action public setSureModal: any;

        public async mounted() {
            localStorage.setItem('layerState.layer', JSON.stringify(this.layerState.layer));
            await this.managerElementGetByLayer({layerId: this.layerState.layer.id});
            // Отмечаем выбраннные в прошлый раз элементы
            this.localStorageCheckedElements();
        }

        /**
         * Вернуть к списку слоёв
         */
        public getLayersList() {
            localStorage.removeItem('layerState.layer');
            this.managerLayerUnsetSingle();
        }

        /**
         * Выбрать слой
         */
        public async selectLayer() {

            this.checkedAll = !this.checkedAll;

            this.elementState.elements.forEach((element, i) => {

                if (this.checkedAll === true) {
                    this.check(i);
                    this.localStorageAddElement(element);
                } else {
                    this.uncheck(i);
                    this.localStorageRemoveElement(element);
                }

            });

            if (this.checkedAll === true) {
                const ids = this.elementState.elements.map((element) => {
                    return element.id;
                });
                this.focusOfFeatures({ids});
            }

        }

        /**
         * Выбрать элемент
         * @param i
         */
        public async selectElement(i) {

            const checked = this.elementState.elements[i].checked === true ? false : true;
            const element = Object.assign({}, this.elementState.elements[i], { checked: true });

            if (checked === true) {
                this.check(i);
                this.localStorageAddElement(element);
                this.focusOfFeature({ id: element.id });
            } else {
                this.uncheck(i);
                this.localStorageRemoveElement(element);
            }

        }

        /**
         * Нарисовать и отметить элемент в списке
         */
        public check(i) {
            const element = Object.assign({}, this.elementState.elements[i], { checked: true });
            this.elementState.elements.splice(i, 1, element);
            this.drawElement(element);
        }

        /**
         * Стереть и снять отметку с элемента в списке
         */
        public uncheck(i) {
            const element = Object.assign({}, this.elementState.elements[i], { checked: false, showGraph: false });
            this.elementState.elements.splice(i, 1, element);
            this.eraseElement(element);
            this.checkedAll = false;
        }

        /**
         * Режим создания нового элемента
         */
        public async createElement() {

            // Очищаем singleElement (присваиваем значения по-умолчанию)
            this.managerElementUnsetSingle({
                layer_id: this.layerState.layer.id,
            });

            // Сохраняем в Базу
            await this.managerElementUpdate();

            // Меняем режим работы карты на рисование
            this.setInteraction({ mode: this.layerState.layer.geometry_type });

        }

        /**
         *  Переключаем режим на рисование нового элемента
         *  @param i
         */
        public addGeomery(i) {

            const element = Object.assign({}, this.elementState.elements[i]);

            this.managerElementSetSingle({element});
            if (!element.geometry) {
                // Меняем режим работы карты на "рисование"
                this.setInteraction({ mode: this.layerState.layer.geometry_type });
            }
        }

        /**
         * Переключиться в редактор геоэлемента
         */
        public getSingleElement(i) {

            const element = Object.assign({}, this.elementState.elements[i]);

            if (element.checked === undefined || element.checked === false) {
                this.selectElement(i);
            } else {
                this.focusOfFeature({ id: element.id });
            }

            this.managerElementSetSingle({ element });

            this.setInteraction({ mode: (element.geometry !== null ? 'modify' : this.layerState.layer.geometry_type) });

        }

        /**
         * Отобразить связанные элементы (граф)
         */
        public async showLinkElements(i) {

            const showGraph = !this.elementState.elements[i].showGraph;

            if (showGraph === true) {
                await this.managerElementGetGraph({ i });
                const element = Object.assign({}, this.elementState.elements[i], { showGraph });
                this.elementState.elements.splice(i, 1, element);
                this.drawElement(element);
            } else {
                const element = Object.assign({}, this.elementState.elements[i], { showGraph });
                this.elementState.elements.splice(i, 1, element);
                element.next.forEach((next) => {
                    this.removeFeaturesArrowFromMap({ first: element, second: next.next_element });
                    this.eraseElement(next.next_element);
                });
            }
        }

        /**
         * Нарисовать Элемент
         */
        public drawElement(element, isChild = false) {

            this.addFeatureToMap({
                id: element.id,
                layer_id: element.layer_id,
                geom: element.geometry,
                property: {
                    id: element.id,
                    layer_id: element.layer_id,
                    title: element.title,
                    description: element.description,
                    lenght: element.lenght,
                    area: element.area,
                    perimeter: element.perimeter,
                },
            });

            // Если для элемента есть граф
            if (element.next !== undefined && element.next.lenght !== 0
                && (element.showGraph === true || isChild === true)) {
                element.next.forEach((next) => {
                    if (next.next_element !== undefined) {
                        this.addFeaturesArrowToMap({ first: element, second: next.next_element });
                        this.drawElement(next.next_element, true);
                    }
                });
            }

        }

        /**
         * Стереть Элемент
         */
        public eraseElement(element) {

            this.removeFeatureFromMap({ id: element.id });

            // Если для элемента есть граф
            if (element.next !== undefined && element.next.length !== 0) {
                element.next.forEach((next) => {
                    if (next.next_element !== undefined) {
                        this.removeFeaturesArrowFromMap({ first: element, second: next.next_element });
                        this.eraseElement(next.next_element);
                    }
                });
            }
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
                    await this.managerElementDelete({
                        element_id: element.id,
                        element_title: element.title,
                    });

                    // Удаляем с карты
                    if (element.geometry) {
                        this.eraseElement(element);
                    }

                    // Удаляем элемент из списка
                    this.elementState.elements.splice(i, 1);


                },
            });
        }

        /**
         * Удалить отмеченные Элементы
         */
        public setSureModalContentDeleteAll() {

            this.setSureModal({
                title: 'Удалить элементы?',
                text: `Вы уверены, что хотите удалить все отмеченные элементы из системы?`,
                action: async () => {

                    // Запрос на удаление элемента
                    await this.managerElementDeleteChecked({
                        layer_id: this.layerState.layer.id,
                    });

                    // Удаляем с карты
                    this.elementState.elements.forEach((element, i) => {
                        if (element.checked === true) {
                            this.eraseElement(element);
                        }
                    });

                    // Удаляем из списка
                    this.elementState.elements = this.elementState.elements.filter((element) => {
                        return (element.checked !== true);
                    });

                    this.checkedAll = false;

                },
            });
        }

        get resolvedDeleteAllButtonShow() {
            return (this.elementState.elements.filter((element) => {
                return (element.checked === true);
            }).length !== 0);
        }

        /**
         * Выделить Элементы из локального харнилища
         */
        public localStorageCheckedElements() {
            const checkedList = JSON.parse(localStorage.getItem('elementState.checked'));
            if (checkedList === null) {
                return;
            }
            this.checkedAll = (this.elementState.elements.length !== 0);
            this.elementState.elements.forEach((element, i) => {
                if (checkedList.indexOf(element.id) !== -1) {
                    this.check(i);
                } else {
                    this.checkedAll = false;
                }
            });
        }

        /**
         * Добавить выделенный элемент в локальное хранилище
         */
        public localStorageAddElement(element) {
            let checkedList = JSON.parse(localStorage.getItem('elementState.checked'));
            if (checkedList === null) {
                checkedList = [];
            }
            checkedList.push(element.id);
            localStorage.setItem('elementState.checked', JSON.stringify(checkedList));
        }

        /**
         * Удалить элемент из локального харнилища
         */
        public localStorageRemoveElement(element) {
            let checkedList = JSON.parse(localStorage.getItem('elementState.checked'));
            if (checkedList === null) {
                checkedList = [];
            } else {
                checkedList = checkedList.filter((item) => {
                    return ((element.id === item) ? false : true);
                });
            }
            localStorage.setItem('elementState.checked', JSON.stringify(checkedList));
        }

    }

</script>