<template>
    <div class="single-element" ref="single-element">
        <h2>
            <div title="Вернуться к списку элементов" class="btn" @click="getElementsList()">
                <i class="fa fa-angle-left"></i>
            </div>

            {{ elementState.element.title }}

            <div class="btn btn-action btn-update-element"
                 title="Сохранить элемент" @click="update()">
                <i class="fa fa-floppy-o"></i>
            </div>

        </h2>

        <div>
            <additional-group-tabs></additional-group-tabs>
            <additional-information ref="tabs"></additional-information>
        </div>


    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {VueEditor} from 'vue2-editor';

    import AdditionalGroupTabs from './AdditonalGroupTabs.vue';
    import AdditionalInformation from './AdditionalInformation.vue';

    import LayerState from '@/store/modules/layer/types';
    import ElementState from '@/store/modules/element/types';
    import ConstructorState from '@/store/modules/constructor/types';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component({
        components: {AdditionalGroupTabs, AdditionalInformation},
    })
    export default class SingleInformation extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        // Элементы
        @Action public managerElementById: any;
        @Action public managerUpdateElement: any;
        @Action public unsetSingleManagerElement: any;

        // Карта
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;

        // Конструктор
        @Action public getAdditionalData: any;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Provide('validator') public $validator = this.$validator;

        public async mounted() {
            await this.managerElementById({id: this.elementState.element.id});
            this.constructorState.element = Object.assign({}, this.elementState.element);
            this.getAdditionalData({layerId: this.layerState.layer.id});
        }

        /**
         * Вернуть к списку слоёв
         */
        public getElementsList() {
            this.unsetSingleManagerElement({layer_id: this.layerState.layer.id});
        }

        /**
         * Проверить карточку Элемента и сохранить
         */
        private update() {

            this.$validator.validateAll().then((validationSuccessed) => {

                if (validationSuccessed) {

                    this.managerUpdateElement();

                    // Перерисовываем элемент на карте
                    this.removeFeatureFromMap({ id: this.elementState.element.id });

                    // Рисуем на карте элемент
                    this.addFeatureToMap({
                        id: this.elementState.element.id,
                        layer_id: this.layerState.layer.id,
                        geom: this.elementState.element.geometry,
                        property: {
                            id: this.elementState.element.id,
                            title: this.elementState.element.title,
                            description: this.elementState.element.description,
                            length: this.elementState.element.length,
                            area: this.elementState.element.area,
                            perimeter: this.elementState.element.perimeter,
                            revision: 3,
                        },
                    });

                } else {

                    ErrorNotifier.notifyWithCustomMessage('Проверьте заполненность полей во всех вкладках');

                }
            });

        }

    }

</script>
