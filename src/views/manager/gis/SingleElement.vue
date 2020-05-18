<template>
    <div class="single-element" ref="single-element">
        <h2>

            <div v-if="isChanged"  title="Вернуться к списку элементов" class="btn" @click="setSureModalContent()"
                 data-toggle="modal" data-target="#sureModal">
                <i class="fa fa-angle-left"></i>
            </div>
            <div v-else title="Вернуться к списку элементов" class="btn" @click="getElementsList()">
                <i class="fa fa-angle-left"></i>
            </div>

            {{ elementState.element.title }}

            <div v-if="isChanged" class="btn btn-action btn-update-element"
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

    import {Component, Provide, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {VueEditor} from 'vue2-editor';

    import AdditionalGroupTabs from '@/views/manager/gis/constructor/AdditonalGroupTabs.vue';
    import AdditionalInformation from '@/views/manager/gis/constructor/AdditionalInformation.vue';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';
    import ConstructorState from '@/store/modules/manager/constructor/types';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component({
        components: { AdditionalGroupTabs, AdditionalInformation },
    })
    export default class SingleInformation extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        // Элементы
        @Action public managerElementById: any;
        @Action public managerElementUpdate: any;
        @Action public managerElementUnsetSingle: any;

        // Карта
        @Action public addFeatureToMap: any;
        @Action public removeFeatureFromMap: any;

        // Конструктор
        @Action public managerConstructorGetAdditionalData: any;

        // Common
        @Action public setSureModal: any;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Provide('validator') public $validator = this.$validator;
        @Provide() public isChanged = false;

        /***
         * Отслеживаем, были ли внесены изменения
         */
        @Watch('elementState.element', {deep: true})
        public onChangeElement() {
            this.isChanged = true;
        }

        public async mounted() {
            await this.managerElementById({id: this.elementState.element.id});
            this.constructorState.element = Object.assign({}, this.elementState.element);
            this.managerConstructorGetAdditionalData({layerId: this.layerState.layer.id});
            this.isChanged = false;
        }

        /**
         * Вернуть к списку элементов
         */
        public getElementsList() {
            this.managerElementUnsetSingle({
                layer_id: this.layerState.layer.id,
            });
        }

        /**
         * Показать уведомление о несохраненных данных
         */
        public setSureModalContent() {
            this.setSureModal({
                title: 'Сохранить изменения?',
                text: `Сохранить изменения элемента "${this.elementState.element.title}"?`,
                buttonOk: 'Сохранить и закрыть',
                buttonCansel: 'Выйти без сохранения',
                action: async () => {
                    this.update(true);
                },
                actionCansel: async () => {
                    this.getElementsList();
                },
            });
        }

        /**
         * Проверить карточку Элемента и сохранить
         */
        private update(isClose = false) {

            this.$validator.validateAll().then((validationSuccessed) => {

                if (validationSuccessed) {

                    this.managerElementUpdate();

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

                    if (isClose === true) {
                        this.getElementsList();
                    }

                    this.isChanged = false;

                } else {

                    ErrorNotifier.notifyWithCustomMessage('Проверьте заполненность полей во всех вкладках');

                }
            });

        }

    }

</script>
