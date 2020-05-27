<template>
    <div class="single-element" ref="single-element">
        <h2>

            <div v-if="isChanged || isStart" title="Вернуться к списку элементов" class="btn"
                 @click="setSureModalContent()"
                 data-toggle="modal" data-target="#sureModal">
                <i class="fa fa-angle-left"></i>
            </div>
            <div v-else title="Вернуться к списку элементов" class="btn" @click="getElementsList()">
                <i class="fa fa-angle-left"></i>
            </div>

            Шаблон

            <div v-if="!isStart" class="btn btn-action btn-update-element"
                 title="Запустить создание цепочки элементов" @click="start()">
                <i class="fa fa-play"></i>
            </div>

            <div v-else class="btn btn-action btn-update-element"
                 title="Остановить создание цепочки элементов" @click="stop()">
                <i class="fa fa-stop"></i>
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

    import AdditionalGroupTabs from '@/views/manager/gis/magic/constructor/AdditonalGroupTabs.vue';
    import AdditionalInformation from '@/views/manager/gis/magic/constructor/AdditionalInformation.vue';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';
    import ConstructorState from '@/store/modules/manager/constructor/types';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component({
        components: {AdditionalGroupTabs, AdditionalInformation},
    })
    export default class SingleInformation extends Vue {

        @State('managerLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        // Элементы
        @Action public managerMagicElementUnsetSingle: any;

        // Карта
        @Action public setMapInteraction: any;
        @Action public removeFeaturesArrowFromMap: any;
        // @Action public addFeatureToMap: any;
        // @Action public removeFeatureFromMap: any;

        // Конструктор
        @Action public managerConstructorGetAdditionalData: any;

        // Common
        @Action public setSureModal: any;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Provide('validator') public $validator = this.$validator;

        @Provide() public isChanged = false;
        @Provide() public isStart = false;
        @Provide() public features = [];

        /***
         * Отслеживаем, были ли внесены изменения
         */
        @Watch('elementState.magicElement.element', {deep: true})
        public onChangeMagic() {
            this.isChanged = true;
        }

        // Запоминаем ИД всех добавленных элементов
        @Watch('elementState.magicElement.element.id', {deep: true})
        public onChangeMagicElementId() {
            if (this.features.indexOf(this.elementState.magicElement.element.id) === -1) {
                this.features.push(this.elementState.magicElement.element.id);
            }
        }

        public async mounted() {
            this.constructorState.element = Object.assign({}, this.elementState.magicElement.element);
            this.managerConstructorGetAdditionalData({layerId: this.layerState.layer.id});
            this.isChanged = false;
        }

        /**
         * Вернуть к списку элементов
         */
        public getElementsList() {
            this.managerMagicElementUnsetSingle({
                layer_id: this.layerState.layer.id,
            });
        }

        /**
         * Показать уведомление о несохраненных данных
         */
        public setSureModalContent() {

            this.setSureModal({
                title: 'Выйти?',
                text: 'Процедура массового создания элементов закончится, шаблон будет удален',
                buttonOk: 'Выйти',
                buttonCansel: 'Остаться в редакторе шаблона',
                action: async () => {

                    this.stop();
                    this.getElementsList();

                    // Удаляем стрелочки
                    this.features.forEach((feature, i) => {
                        if (i !== 0 && feature !== 0 && this.features[i - 1] !== 0) {
                            this.removeFeaturesArrowFromMap({
                                first: { id: this.features[i - 1]},
                                second: { id: feature},
                            });
                        }
                    });

                },
            });

        }

        /**
         * Проверить карточку Элемента и запустить создание цепочки элементов
         */
        private start() {

            this.$validator.validateAll().then((validationSuccessed) => {

                if (validationSuccessed) {

                    // Меняем режим работы карты на рисование
                    this.setMapInteraction({mode: this.layerState.layer.geometry_type});
                    this.isStart = true;

                } else {

                    ErrorNotifier.notifyWithCustomMessage('Проверьте заполненность полей во всех вкладках');

                }
            });

        }

        /**
         * Остановить создание цепочки элементов
         */
        private stop() {

            // Меняем режим работы с картой
            this.setMapInteraction({mode: ''});
            this.isChanged = false;
            this.isStart = false;

        }

    }

</script>
