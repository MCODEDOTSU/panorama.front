<template>
    <div class="manager manager-modules-container content">

        <h1>Редактор открытых данных слоя "{{ layerState.layer.title }}"</h1>

        <button data-toggle="modal" data-target="#singleInformationModal" @click="createElement" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый элемент
        </button>
        <button @click="$router.go(-1)" class="btn btn-info btn-right">
            <i class="fas fa-arrow-circle-left"></i>
            Назад
        </button>

        <!-- Список элементов -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-6">Наименование</div>
                <div class="col-6">Описание</div>
            </div>
            <div class="row row-body" v-for="element in elementState.elements">
                <div class="col-6">
                    <label class="title">{{ element.title }}</label>
                    <label class="description">
                        <!--span v-if="element.length">Длина: {{ setLength(element.length) }}</span>
                        <span v-if="element.area">Площадь: <span v-html="setArea(element.area)"></span>, периметр: <span v-html="setPerimeter(element.perimeter)"></span></span-->
                    </label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleInformationModal" @click="showElementInfo(element)">Изменить</button>
                        <button class="btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(element)">Удалить</button>
                    </div>
                </div>
                <div class="col-6">
                    <label v-html="element.description"></label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-6">Наименование</div>
                <div class="col-6">Описание</div>
            </div>
        </div>
        <!-- конец Список элементов -->

        <single-information></single-information>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Mutation, State} from 'vuex-class';
    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';
    import SureModal from '@/components/common/SureModal.vue';
    import ConstructorState from '@/store/modules/constructor/types';
    import SingleInformation from '@/views/manager/layers/SingleElement.vue';
    import {lengthConverter, perimeterConverter, areaConverter} from '@/domain/services/common/Calculator';

    @Component({
        components: {SingleInformation, SureModal},
    })
    export default class Elements extends Vue {

        @Action public setSureModal: any;
        @Action public getLayerById: any;
        @Action public managerGetElements: any;
        @Action public managerSetSingleElement: any;
        @Action public getConstructorByLayer: any;
        @Action public getAdditionalData: any;
        @Action public managerUnsetSingleElement: any;
        @Action public managerDeleteElement: any;

        @Mutation public unsetAdditionalInfoValues: any;

        @State('managerLayer') public layerState: LayerState;
        @State('managerElement') public elementState: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        public async created() {
            await this.getLayerById({ id: this.$route.params.id });
            this.managerGetElements({ layerId: this.$route.params.id });
            await this.getConstructorByLayer({ layerId: this.$route.params.id });
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param element
         */
        public setSureModalContent(element: any) {
            this.setSureModal({
                title: 'Удалить элемент?',
                text: `Вы уверены, что хотите удалить элемент "${element.title}" из системы?`,
                action: async () => {
                    this.managerSetSingleElement(element);
                    await this.managerDeleteElement();
                    this.managerUnsetSingleElement({
                        layerId: this.$route.params.id,
                    });
                },
            });
        }

        /**
         * Создание нового элемента
         */
        public createElement() {
            this.managerUnsetSingleElement({
                layerId: this.$route.params.id,
            });
            this.unsetAdditionalInfoValues();
            this.getAdditionalData({layerId: this.$route.params.id});
        }

        /**
         * Показать элемент
         * @param element
         */
        public showElementInfo(element) {
            this.constructorState.element = element;
            this.getAdditionalData({layerId: this.layerState.layer.id});
            this.managerSetSingleElement(element);
        }

        public setLength(length) {
            return lengthConverter(length);
        }

        public setPerimeter(length) {
            return perimeterConverter(length);
        }

        public setArea(length) {
            return areaConverter(length);
        }

    }
</script>
