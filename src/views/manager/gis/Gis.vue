<template>
    <div class="manager-geom-data-container">

        <div class="geom-data manager">

            <!-- Компонент Карты -->
            <ol-map :editor="true" :modifyElement="elementState.element"
                    v-on:selected="onSelected" v-on:modifyend="onModifyend"
                    v-on:drawend="onDrawend"></ol-map>

            <!-- Список слоев и элементов -->
            <div class="geom-data-list">

                <layers-list v-if="layerState.layer.id === 0"></layers-list>

                <elements-list
                        v-else-if="elementState.element.id === 0 && elementState.magicElement.active === false && elementState.search === ''"></elements-list>

                <search-elements-list
                        v-else-if="elementState.element.id === 0 && elementState.magicElement.active === false"></search-elements-list>

                <single-element v-else-if="elementState.magicElement.active === false"></single-element>

                <magic-element v-else></magic-element>

            </div>

        </div>

        <sure-modal></sure-modal>

        <search-address></search-address>

    </div>
</template>

<script lang='ts'>

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';

    import OlMap from '@/components/utils/map/Map.vue';
    import LayersList from '@/views/manager/gis/LayersList.vue';
    import ElementsList from '@/views/manager/gis/ElementsList.vue';
    import SearchElementsList from '@/views/manager/gis/SearchElementsList.vue';
    import SingleElement from '@/views/manager/gis/SingleElement.vue';
    import MagicElement from '@/views/manager/gis/magic/MagicElement.vue';
    import SearchAddress from '@/views/manager/gis/SearchAddress.vue';

    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {
            OlMap,
            LayersList,
            ElementsList,
            SearchElementsList,
            SingleElement,
            MagicElement,
            SureModal,
            SearchAddress,
        },
    })

    export default class Gis extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        // Слои
        @Action public managerLayerSetSingle: any;

        // Карта
        @Action public setInteraction: any;
        @Action public addFeatureToMap: any;
        @Action public addFeaturesArrowToMap: any;

        // Элементы
        @Action public managerElementUpdateGeometry: any;
        @Action public managerMagicElementUpdate: any;
        @Action public managerElementSetSingle: any;
        @Action public managerElementById: any;

        /**
         * Кликнули по Элементу на карте
         * @param e
         */
        public async onSelected(e) {

            if (e === false || this.elementState.magicElement.active === true) {
                return;
            }

            await this.managerElementById({id: e.id});
            this.setInteraction({mode: 'modify'});

            if (this.layerState.layer.id !== e.layer_id) {
                this.managerLayerSetSingle({
                    layer: this.layerState.layers.find((layer) => {
                        return layer.id === e.layer_id;
                    }),
                });
            }

        }

        /**
         * Изменили геометрию геообъекта
         * @param e
         */
        public onModifyend(e) {
            this.managerElementUpdateGeometry({id: e.properties.id, geometry: e.geom});
            this.elementState.element.geometry = e.geom;
            this.elementState.elements = this.elementState.elements.map((element) => {
                if (element.id === e.properties.id) {
                    element.geometry = e.geom;
                }
                return element;
            });
        }

        /**
         * Добавили новый геообъект
         */
        public async onDrawend(e) {

            if (this.elementState.magicElement.active === false) {

                // Если мы добавляем новый элемент

                // Обновляем геометрию
                this.elementState.element.geometry = e.geom;
                this.managerElementUpdateGeometry({id: this.elementState.element.id, geometry: e.geom});

                // Меняем режим работы с картой
                this.setInteraction({mode: 'modify'});

                this.addFeatureToMap({
                    id: this.elementState.element.id,
                    layer_id: this.elementState.element.layer_id,
                    geom: this.elementState.element.geometry,
                    property: {
                        id: this.elementState.element.id,
                        layer_id: this.elementState.element.layer_id,
                        title: this.elementState.element.title,
                        description: this.elementState.element.description,
                        lenght: this.elementState.element.length,
                        area: this.elementState.element.area,
                        perimeter: this.elementState.element.perimeter,
                        revision: 3,
                    },
                });

                this.elementState.elements = this.elementState.elements.map((element) => {
                    if (element.id === this.elementState.element.id) {
                        element.checked = true;
                        element.geometry = e.geom;
                    }
                    return element;
                });

                // Добавляем элемент как отмеченный в хранилие
                let checkedList = JSON.parse(localStorage.getItem('elementState.checked'));
                if (checkedList === null) {
                    checkedList = [];
                }
                checkedList.push(this.elementState.element.id);
                localStorage.setItem('elementState.checked', JSON.stringify(checkedList));

            } else {

                // Если массовое добавление элементов на карту

                // Запоминаем предыдущий элемент
                const previous = Object.assign({}, this.elementState.magicElement.element);

                // Обновляем геометрию
                this.elementState.magicElement.element.geometry = e.geom;

                // Сохраняем в базу по шаблону
                await this.managerMagicElementUpdate();

                // Рисуем элемент на карте
                const i = this.elementState.magicElement.index - 1;
                this.addFeatureToMap({
                    id: this.elementState.magicElement.element.id,
                    layer_id: this.elementState.magicElement.element.layer_id,
                    geom: this.elementState.magicElement.element.geometry,
                    property: {
                        id: this.elementState.magicElement.element.id,
                        layer_id: this.elementState.magicElement.element.layer_id,
                        title: this.elementState.magicElement.element.title.replace('%i', i.toString()),
                        description: this.elementState.magicElement.element.description,
                        lenght: this.elementState.magicElement.element.length,
                        area: this.elementState.magicElement.element.area,
                        perimeter: this.elementState.magicElement.element.perimeter,
                        revision: 3,
                    },
                });

                // Добавляем элемент как отмеченный в хранилие
                let checkedList = JSON.parse(localStorage.getItem('elementState.checked'));
                if (checkedList === null) {
                    checkedList = [];
                }
                checkedList.push(this.elementState.magicElement.element.id);
                localStorage.setItem('elementState.checked', JSON.stringify(checkedList));

                // Рисуем стрелочку до предыдущего элемента
                if (previous !== undefined && previous.id !== 0) {
                    this.addFeaturesArrowToMap({first: previous, second: this.elementState.magicElement.element});
                }

                this.setInteraction({mode: this.layerState.layer.geometry_type});

            }

        }

    }

</script>