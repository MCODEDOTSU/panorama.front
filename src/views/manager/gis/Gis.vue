<template>
    <div class="manager-geom-data-container">

        <div class="geom-data manager">

            <!-- Компонент Карты -->
            <ol-map :editor="true" v-on:selected="onSelected" v-on:modifyend="onModifyend" v-on:drawend="onDrawend"></ol-map>

            <!-- Список слоев и элементов -->
            <div class="geom-data-list">

                <layers-list v-if="layerState.layer.id === 0"></layers-list>

                <elements-list v-else-if="elementState.element.id === 0"></elements-list>

                <single-element v-else></single-element>

            </div>

        </div>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';

    import OlMap from '@/components/utils/map/Map.vue';
    import LayersList from '@/views/manager/gis/LayersList.vue';
    import ElementsList from '@/views/manager/gis/ElementsList.vue';
    import SingleElement from '@/views/manager/gis/SingleElement.vue';

    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { OlMap, LayersList, ElementsList, SingleElement, SureModal },
    })

    export default class Gis extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        // Карта
        @Action public setMapInteraction: any;
        @Action public addFeatureToMap: any;

        // Элементы
        @Action public managerElementUpdateGeometry: any;

        /**
         * Кликнули по Элементу на карте
         * @param e
         */
        public onSelected(e) {

        }

        /**
         * Изменили геометрию геообъекта
         * @param e
         */
        public onModifyend(e) {
            this.managerElementUpdateGeometry({ id: e.properties.id, geometry: e.geom });
            this.elementState.elements = this.elementState.elements.map( (element) => {
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

            // Обновляем геометрию
            this.elementState.element.geometry = e.geom;
            this.managerElementUpdateGeometry({ id: this.elementState.element.id, geometry: e.geom });

            // Меняем режим работы с картой
            this.setMapInteraction({ mode: '' });

            this.addFeatureToMap({
                id: this.elementState.element.id,
                layer_id: this.elementState.element.layer_id,
                geom: this.elementState.element.geometry,
                property: {
                    id: this.elementState.element.id,
                    title: this.elementState.element.title,
                    description: this.elementState.element.description,
                    lenght: this.elementState.element.length,
                    area: this.elementState.element.area,
                    perimeter: this.elementState.element.perimeter,
                    revision: 3,
                },
            });

            this.elementState.elements = this.elementState.elements.map( (element) => {
                if (element.id === this.elementState.element.id) {
                    element.checked = true;
                    element.geometry = e.geom;
                }
                return element;
            });

        }

    }

</script>