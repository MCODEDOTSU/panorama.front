<template>
    <!-- Modal -->
    <b-modal id="singleElement" title="Карточка Элемента" size="xl" hide-footer>
        <additional-group-tabs></additional-group-tabs>
        <additional-information></additional-information>
        <div class="modal-footer">
            <span class="validation-error" v-if="fieldsNonCompleteness" style="color: #ff0000; font-size: 10pt">Проверьте заполненность полей во всех вкладках</span>
            <button type="button" class="btn btn-primary" @click="validateAndUpdateElement">
                Сохранить
            </button>
            <button type="button" class="btn btn-secondary" @click="$bvModal.hide('singleElement')">Закрыть</button>
        </div>
    </b-modal>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ElementState from '@/store/modules/gis/element/types';
    import LayerState from '@/store/modules/gis/layer/types';
    import {VueEditor} from 'vue2-editor';
    import AdditionalInformation from './AdditionalInformation.vue';
    import AdditionalGroupTabs from './AdditonalGroupTabs.vue';

    @Component({
        components: {AdditionalInformation, AdditionalGroupTabs, VueEditor},
    })
    export default class SingleInformation extends Vue {
        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Provide('validator') public $validator = this.$validator;

        @Action public updateElement: any;
        @Action public removeFeatureFromMap: any;
        @Action public addFeatureToMap: any;

        @State('gisElement') public elementState!: ElementState;
        @State('gisLayer') public layerState!: LayerState;

        @Provide() private fieldsNonCompleteness = false;

        private validateAndUpdateElement() {
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    this.fieldsNonCompleteness = false;
                    this.updateElement();

                    // @ts-ignore
                    this.$bvModal.hide('singleElement');

                    // TODO: один метод на переименования элемента на карте

                    // Удаляем с карты
                    const i = this.layerState.currentLayerIndex;
                    const j = this.layerState.currentElementIndex;

                    if (this.layerState.layers[i].elements[j].geometry) {
                        this.removeFeatureFromMap({ id: this.layerState.layers[i].elements[j].id });
                    }

                    this.layerState.layers[i].elements[j].title = this.elementState.element.title;

                    // Рисуем на карте элемент
                    this.addFeatureToMap({
                        id: this.layerState.layers[i].elements[j].id,
                        layer_id: this.layerState.layers[i].id,
                        geom: this.layerState.layers[i].elements[j].geometry,
                        property: {
                            id: this.layerState.layers[i].elements[j].id,
                            title: this.layerState.layers[i].elements[j].title,
                            description: this.layerState.layers[i].elements[j].description,
                            lenght: this.layerState.layers[i].elements[j].lenght,
                            area: this.layerState.layers[i].elements[j].area,
                            perimeter: this.layerState.layers[i].elements[j].perimeter,
                            revision: 3,
                        },
                    });

                } else {
                    this.fieldsNonCompleteness = true;
                }
            });
        }

    }
</script>
