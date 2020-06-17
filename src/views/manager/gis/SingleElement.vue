<template>
    <div class="single-element" ref="single-element">

        <div class="header">

            <div v-if="isChanged"  title="Вернуться к списку элементов" class="btn" @click="setSureModalContent()"
                 data-toggle="modal" data-target="#sureModal">
                <i class="fa fa-angle-left"></i>
            </div>
            <div v-else title="Вернуться к списку элементов" class="btn" @click="getElementsList()">
                <i class="fa fa-angle-left"></i>
            </div>

            <h2>{{ elementState.element.title }}</h2>

            <div class="btn btn-action btn-update-element"
                 title="Сохранить элемент" @click="update()">
                <i class="fa fa-floppy-o"></i>
            </div>

        </div>

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
        @Action public setInteraction: any;
        @Action public removeFeatureFromMap: any;
        @Action public updateFeatureTitle: any;

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

            this.setInteraction({ mode: 'select' });

            const element = Object.assign({}, this.elementState.element);

            this.managerElementUnsetSingle({
                layer_id: this.layerState.layer.id,
            });

            // TODO: необходимо только поменять подпись, но методо ниже не работает

            // this.updateFeatureTitle({
            //     id: this.elementState.element.id,
            //     title: this.elementState.element.title,
            //     layer_id: this.layerState.layer
            // });

            // Перерисовываем элемент на карте
            this.removeFeatureFromMap({ id: element.id });

            // Рисуем на карте элемент
            this.addFeatureToMap({
                id: element.id,
                layer_id: this.layerState.layer.id,
                geom: element.geometry,
                property: {
                    id: element.id,
                    layer_id: this.layerState.layer.id,
                    title: element.title,
                    description: element.description,
                    length: element.length,
                    area: element.area,
                    perimeter: element.perimeter,
                    revision: 3,
                },
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
