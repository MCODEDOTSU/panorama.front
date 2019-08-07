<template>
    <div class="manager-modules-container content">

        <h1>Состав слоя "{{ layerState.layer.title }}"</h1>
        <button data-toggle="modal" data-target="#singleLayerCompositionModal" @click="createLayerComposition" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый компонент
        </button>
        <button @click="$router.go(-1)" class="btn btn-info btn-right">
            <i class="fas fa-arrow-circle-left"></i>
            Назад
        </button>

        <!-- Список компонентов слоя -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-9">Наименование</div>
                <div class="col-3">Тип геометрии</div>
            </div>
            <div class="row row-body" v-for="composition in layerCompositionState.compositions">
                <div class="col-9">
                    <label class="title">{{ composition.title }}</label>
                    <label class="description" v-html="composition.description"></label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal"
                                data-target="#singleLayerCompositionModal"
                                @click="editLayerComposition(composition)">
                            Изменить
                        </button>
                        <button class="btn-danger" data-toggle="modal"
                                data-target="#sureModal"
                                @click="setSureModalContent(composition)">
                            Удалить
                        </button>
                    </div>
                </div>
                <div class="col-3">
                    <label class="title">{{ getGeometryTypeTitle(composition.geometry_type) }}</label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-9">Наименование</div>
                <div class="col-3">Тип геометрии</div>
            </div>
        </div>
        <!-- конец Список слоёв -->

        <single-layer-composition></single-layer-composition>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue, Watch, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/manager/layer/types';
    import LayerCompositionState from '@/store/modules/manager/layerComposition/types';
    import SingleLayerComposition from '@/views/closed/layerCompositions/SingleLayerComposition.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleLayerComposition, SureModal},
    })
    export default class LayerCompositions extends Vue {

        @Action public getLayerCompositions: any;
        @Action public setSureModal: any;
        @Action public deleteLayerComposition: any;
        @Action public setSingleLayerComposition: any;
        @Action public unsetSingleLayerComposition: any;
        @Action public getLayerById: any;
        @Action public setGeometryTypeByStyleEditor: any;
        @Action public setStyleByStyleEditor: any;
        @Action public setMapCenterDefault: any;
        @Action public setDefaultStyleByStyleEditor: any;
        @Action public checkIfTableExists: any;

        @State('managerLayer') public layerState: LayerState;
        @State('managerLayerComposition') public layerCompositionState: LayerCompositionState;

        @Watch('this.$route.params.id', { immediate: true, deep: true })
        public onLayerIdChange() {
            this.getLayerCompositions({ layerId: this.$route.params.id });
        }

        public async created() {
            await this.getLayerById({ id: this.$route.params.id });
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param composition
         */
        public setSureModalContent(composition: any) {
            this.setSureModal({
                title: 'Удалить компонент слоя?',
                text: `Вы уверены, что хотите удалить компонент слоя "${composition.title}" из системы?`,
                action: async () => {
                    this.setSingleLayerComposition(composition);
                    await this.deleteLayerComposition();
                    this.unsetSingleLayerComposition({ layerId: this.$route.params.id });
                },
            });
        }

        /**
         * Создаем новый компонент слоя
         */
        public createLayerComposition() {

            this.unsetSingleLayerComposition({ layerId: this.$route.params.id });
            this.setGeometryTypeByStyleEditor({ geometryType: this.layerCompositionState.composition.geometry_type });

            // Сбрасываем значение стиля
            this.setDefaultStyleByStyleEditor();

            // Сбрасываем значение карты
            this.setMapCenterDefault();

        }

        /**
         * Изменяем компонент слоя
         */
        public editLayerComposition(composition: any) {
            this.checkIfTableExists({layerId: this.$route.params.id});
            this.setSingleLayerComposition(composition);
            this.setGeometryTypeByStyleEditor({ geometryType: this.layerCompositionState.composition.geometry_type });
            this.setStyleByStyleEditor({ style: this.layerCompositionState.composition.style });

            // Сбрасываем значение карты
            this.setMapCenterDefault();

        }

        /**
         * Перевести название типа геометрии
         * @param alias
         */
        public getGeometryTypeTitle(alias: string) {
            switch (alias) {
                case 'point':
                    return 'Точечный элемент';
                case 'linestring':
                    return 'Линейный элемент';
                case 'polygon':
                    return 'Полигональный элемент';
            }
        }
    }
</script>
