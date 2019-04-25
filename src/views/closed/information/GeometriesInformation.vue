<template>
    <div class="manager-modules-container content">

        <h1>Редактор геообъектов элемента "{{ elementState.element.title }}"</h1>

        <button data-toggle="modal" data-target="#singleGeometryInformationModal" @click="createGeometry" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый геообъект
        </button>
        <button @click="$router.go(-1)" class="btn btn-info btn-right">
            <i class="fas fa-arrow-circle-left"></i>
            Назад
        </button>

        <!-- Список геометрий -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-4">Наименование</div>
                <div class="col-4">Описание</div>
                <div class="col-4">Адрес</div>
            </div>
            <div class="row row-body" v-for="geometry in geometryState.geometries">
                <div class="col-4">
                    <label class="title">{{ geometry.title }}</label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleGeometryInformationModal" @click="managerSetSingleGeometry(geometry)">Изменить</button>
                        <button class="btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(geometry)">Удалить</button>
                    </div>
                </div>
                <div class="col-4">
                    <label v-html="geometry.description"></label>
                </div>
                <div class="col-4">
                    <label>{{ geometry.city }}, {{ geometry.street }}, {{ geometry.build }}</label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-4">Наименование</div>
                <div class="col-4">Описание</div>
                <div class="col-4">Адрес</div>
            </div>
        </div>
        <!-- конец Список геометрий -->

        <single-geometry-information></single-geometry-information>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ElementState from '@/store/modules/manager/element/types';
    import GeometryState from '@/store/modules/manager/geometry/types';
    import SureModal from '@/components/common/SureModal.vue';
    import SingleGeometryInformation from '@/views/closed/information/SingleGeometryInformation.vue';

    @Component({
        components: {SingleGeometryInformation, SureModal},
    })
    export default class GeometriesInformation extends Vue {

        @Action public setSureModal: any;
        @Action public managerGetElementById: any;
        @Action public managerGetGeometries: any;
        @Action public managerSetSingleGeometry: any;
        @Action public managerUnsetSingleGeometry: any;
        @Action public managerDeleteGeometry: any;
        @Action public getLayerCompositions: any;

        @State('managerElement') public elementState: ElementState;
        @State('managerGeometry') public geometryState: GeometryState;

        public async created() {
            await this.managerGetElementById({ id: this.$route.params.id });
            this.getLayerCompositions({layerId: this.elementState.element.layer_id});
            this.managerGetGeometries({ elementId: this.$route.params.id });
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param geometry
         */
        public setSureModalContent(geometry: any) {
            this.setSureModal({
                title: 'Удалить геообъект?',
                text: `Вы уверены, что хотите удалить геообъект "${geometry.title}" из системы?`,
                action: async () => {
                    this.managerSetSingleGeometry(geometry);
                    await this.managerDeleteGeometry();
                    this.managerUnsetSingleGeometry({
                        elementId: this.$route.params.id,
                    });
                },
            });
        }

        /**
         * Создание нового элемента
         */
        public createGeometry() {
            this.managerUnsetSingleGeometry({
                elementId: this.$route.params.id,
            });
        }

    }
</script>