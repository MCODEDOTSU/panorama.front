<template>
    <div class="manager manager-container content">

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

        <single-element></single-element>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Mutation, State} from 'vuex-class';
    import {lengthConverter, perimeterConverter, areaConverter} from '@/domain/services/common/Calculator';

    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';
    import ConstructorState from '@/store/modules/manager/constructor/types';

    import SureModal from '@/components/common/SureModal.vue';
    import SingleElement from '@/views/manager/layers/SingleElement.vue';

    @Component({
        components: {SingleElement, SureModal},
    })
    export default class Elements extends Vue {

        // Layer
        @Action public managerLayerGetById: any;

        // Element
        @Action public managerElementGetByLayer: any;
        @Action public managerElementSetSingle: any;
        @Action public managerElementUnsetSingle: any;
        @Action public managerElementDelete: any;

        // Constructor
        @Action public managerConstructorGetByLayer: any;
        @Action public managerConstructorGetAdditionalData: any;
        @Action public managerConstructorUnsetAdditionalData: any;

        // Common
        @Action public setSureModal: any;

        @State('managerLayer') public layerState: LayerState;
        @State('managerElement') public elementState: ElementState;
        @State('managerConstructor') public constructorState: ConstructorState;

        public async created() {
            await this.managerLayerGetById({ id: this.$route.params.id });
            this.managerElementGetByLayer({ layerId: this.$route.params.id });
            await this.managerConstructorGetByLayer({ layerId: this.$route.params.id });
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
                    // Запрос на удаление элемента
                    await this.managerElementDelete({
                        element_id: element.id,
                        element_title: element.title,
                    });
                },
            });
        }

        /**
         * Создание нового элемента
         */
        public createElement() {
            this.managerElementUnsetSingle({
                layer_id: this.$route.params.id,
            });
            this.managerConstructorUnsetAdditionalData();
            this.managerConstructorGetAdditionalData({layerId: this.$route.params.id});
        }

        /**
         * Показать элемент
         * @param element
         */
        public showElementInfo(element) {
            this.constructorState.element = Object.assign({}, element);
            this.managerConstructorGetAdditionalData({layerId: this.layerState.layer.id});
            this.managerElementSetSingle(element);
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
