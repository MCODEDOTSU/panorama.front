<template>
    <div class="manager-modules-container content">

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
                    <label class="description">Количество геоэлементов: {{ element.geometries_count }}</label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleInformationModal" @click="showElementInfo(element)">Изменить</button>
                        <button class="btn-info" @click="getElementGeometries(element)">Состав элемента</button>
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
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/manager/layer/types';
    import ElementState from '@/store/modules/manager/element/types';
    import SingleInformation from '@/views/closed/information/SingleInformation.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleInformation, SureModal},
    })
    export default class Information extends Vue {

        @Action public setSureModal: any;
        @Action public getLayerById: any;
        @Action public managerGetElements: any;
        @Action public managerSetSingleElement: any;
        @Action public checkIfTableExists: any;
        @Action public managerUnsetSingleElement: any;
        @Action public managerDeleteElement: any;

        @State('managerLayer') public layerState: LayerState;
        @State('managerElement') public elementState: ElementState;

        public created() {
            this.getLayerById({ id: this.$route.params.id });
            this.managerGetElements({ layerId: this.$route.params.id });
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
        }

        /**
         * Перейти на компонент редактирования состава слоя
         * @param element
         */
        public getElementGeometries(element: any) {
            this.managerSetSingleElement(element);
            this.$router.push(`/manager/element/${element.id}`);
        }

        /**
         * Показать элемент
         * @param element
         */
        public showElementInfo(element) {
            this.checkIfTableExists({layerId: this.layerState.layer.id});
            this.managerSetSingleElement(element);
        }

    }
</script>
