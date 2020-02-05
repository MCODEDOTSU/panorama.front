<template>
    <div class="single-element">

        <!-- Название элемента -->
        <input type="text" class="element-title-field"
               placeholder="Наименование элемента"
               v-on:blur="updateSingleElement()"
               v-model="elementState.element.title">

        <div class="actions">
            <button class="btn-edit-save btn-danger"
                    @click="closeSingleElement"
                    title="Свернуть редактор">
                <label>Закрыть</label>
            </button>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ILayer from '@/domain/entities/interfaces/ILayer';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/gis/element/types';
    import {arrayIndexOf} from '@/domain/services/common/ArrayActions';

    @Component({})
    export default class SingleElement extends Vue {

        @State('gisLayer') public layerState!: LayerState;
        @State('gisElement') public elementState!: ElementState;

        @Action public updateElement: any;
        @Action public unsetSingleElement: any;
        @Action public setMapElements: any;
        @Action public unsetCurrentIndex: any;
        @Action public removeFeatureFromMap: any;
        @Action public addFeatureToMap: any;
        @Action public focusOfFeature: any;

        @Provide('ILayer[]') public layers!: ILayer[];
        @Provide('ILayer') public layer!: ILayer;

        /**
         * Обновить данные элемента
         */
        public async updateSingleElement() {
            // Сохранить изменения в базу
            this.updateElement();
            // Находим элемент в списке и меняем его данные
            const i = this.layerState.currentLayerIndex;
            const j = this.layerState.currentElementIndex;
            this.layerState.layers[i].elements[j] =
                Object.assign({}, this.layerState.layers[i].elements[j], this.elementState.element);
        }

        /**
         * Закрыть редактор элемента
         */
        public closeSingleElement() {
            // Очищаем singleElement (присваиваем значения по-умолчанию)
            this.unsetSingleElement({ layerId: 0 });
            // Сбросить индекс текущего выбранного слоя и элемента
            this.unsetCurrentIndex();
        }

    }
</script>
