<template>
    <div class="elements-list" ref="elements-list">

        <div class="header">

            <div title="Вернуться к списку слоёв" class="btn" @click="getLayersList()">
                <i class="fa fa-angle-left"></i>
            </div>
            <div @click="selectAllElement()" class="btn-checked" v-bind:class="{checked: checkedAll}"
                 title="Отобразить все элементы на карте"></div>


            <h2>Поиск: "{{ elementState.search }}"</h2>

            <!-- Кнопка "Массовое Удаление Элементов" -->
            <!--<div class="btn btn-action btn-delete-element"-->
                 <!--data-toggle="modal" data-target="#sureModal"-->
                 <!--v-if="resolvedDeleteAllButtonShow"-->
                 <!--title="Удалить все отмеченные Элементы" @click="setSureModalContentDeleteAll()">-->
                <!--<i class="fas fa-trash"></i>-->
            <!--</div>-->

            <div class="search-panel">
                <input type="text" name="element-search" placeholder="поиск элементов по имени или описанию"
                       v-model="search" v-on:keyup.enter="searchInit"/>
                <button @click="searchInit"><i class="fa fa-search"></i></button>
            </div>

        </div>

        <div class="scroll-container" v-bind:class="{ pages: elementState.paginator.count > 1 }">

            <vue-scrollbar class="scrollbar scrollbar-min" ref="scrollbar">

                <ul class="data-list elements-list">

                    <li class="element-item" v-for="(element, i) in elementState.elements" :key="element.id">

                        <!-- Строка с Элементом -->
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

        <!-- Пагинация -->

        <div class="pages-container" v-if="elementState.paginator.count > 20">

            <span class="page" v-for="i in elementState.paginator.count" :key="i"
                  v-bind:class="{ current: i === elementState.paginator.current,
                  delimiter:  ((elementState.paginator.count - i) === 3) || ((elementState.paginator.current - i) === 3)}"
                  v-if="(i <= 3) || (Math.abs(elementState.paginator.current - i) <= 3) || ((elementState.paginator.count - i) <= 3)">

                <label v-if="((elementState.paginator.count - i) === 3) || ((elementState.paginator.current - i) === 3)">...</label>
                <label v-else-if="i === elementState.paginator.current">{{ i }}</label>
                <button v-else @click="elementState.paginator.current = i">{{ i }}</button>

            </span>

        </div>

        <div class="pages-container" v-else-if="elementState.paginator.count > 1">

            <span class="page" v-for="i in elementState.paginator.count" :key="i"
                  v-bind:class="{ current: i === elementState.paginator.current }">

                <button @click="elementState.paginator.current = i">{{ i }}</button>

            </span>

        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrlAPI} from '@/globals';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';

    @Component({})
    export default class ElementsList extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        // Элементы
        @Action public managerElementGetLimitBySearch: any;
        @Action public managerElementGetCountBySearch: any;
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
        @Provide() public search: string = '';

        // Интерфейсы
        @Action public setSureModal: any;

        public async mounted() {

            this.search = this.elementState.search;

            // Пагинация
            this.elementState.paginator.current = 1;
            this.managerElementGetCountBySearch();

            // Получаем список элементов
            await this.managerElementGetLimitBySearch();

            // Отмечаем выбраннные в прошлый раз элементы
            this.localStorageCheckedElements();

        }

        @Watch('elementState.paginator.current')
        public async onChangeCurrentPage() {
            await this.managerElementGetLimitBySearch();
            // Отмечаем выбраннные в прошлый раз элементы
            this.localStorageCheckedElements();
            // Скроллим вверх
            this.$nextTick(() => {
                // @ts-ignore
                this.$refs.scrollbar.scrollToY(0);
            });
        }

        /**
         * Вернуть к списку слоёв
         */
        public getLayersList() {
            this.elementState.search = '';
        }

        /**
         * Выбрать слой
         */
        public async selectAllElement() {

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

            const checked = !this.elementState.elements[i].checked;
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

            const layer = this.layerState.layers.find((layer) => {
                return layer.id === element.layer_id;
            });
            this.setInteraction({ mode: (element.geometry !== null ? 'modify' : layer.geometry_type) });

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
                    revision: 3,
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

            // this.setSureModal({
            //     title: 'Удалить элементы?',
            //     text: `Вы уверены, что хотите удалить все отмеченные элементы из системы?`,
            //     action: async () => {
            //
            //         // Запрос на удаление элемента
            //         await this.managerElementDeleteChecked({
            //             layer_id: this.layerState.layer.id,
            //         });
            //
            //         // Удаляем с карты
            //         this.elementState.elements.forEach((element, i) => {
            //             if (element.checked === true) {
            //                 this.eraseElement(element);
            //             }
            //         });
            //
            //         // Удаляем из списка
            //         this.elementState.elements = this.elementState.elements.filter((element) => {
            //             return (element.checked !== true);
            //         });
            //
            //         this.checkedAll = false;
            //
            //     },
            // });
        }

        get resolvedDeleteAllButtonShow() {
            return (this.elementState.elements.filter((element) => {
                return (element.checked === true);
            }).length !== 0);
        }

        /**
         * Выделить Элементы из локального хранилища
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
                    return (element.id === item);
                });
            }
            localStorage.setItem('elementState.checked', JSON.stringify(checkedList));
        }

        /**
         * Активировать поиск
         */
        private async searchInit() {
            if (this.search.length < 3) {

                ErrorNotifier.notifyWithCustomMessage('Для поиска введите минимум три символа');

            } else {

                this.elementState.search = this.search;

                // Пагинация
                this.elementState.paginator.current = 1;
                this.managerElementGetCountBySearch();

                // Получаем список элементов
                await this.managerElementGetLimitBySearch();

                // Отмечаем выбраннные в прошлый раз элементы
                this.localStorageCheckedElements();
            }
        }

    }

</script>