<template>
    <div class="manager-modules-container content">

        <h1>Справочник картографических слоёв</h1>
        <button data-toggle="modal" data-target="#singleLayerModal" @click="createLayer" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый
        </button>

        <!-- Список слоёв -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-6">Наименование</div>
                <div class="col-3">Геотип</div>
                <!--div class="col-3">Родительский слой</div-->
                <div class="col-3">Включен в модуль</div>
            </div>
            <div class="row row-body" v-for="layer in layerState.layers">
                <div class="col-6">
                    <label class="title">{{ layer.title }}</label>
                    <label class="description" v-html="layer.description"></label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleLayerModal" @click="editLayer(layer)">Изменить</button>
                        <button class="btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(layer)">Удалить</button>
                    </div>
                </div>
                <div class="col-3">
                    <label class="title">{{ getGeometryTypeTitle(layer.geometry_type) }}</label>
                </div>
                <!--div class="col-3">
                    <label class="title" v-if="layer.parent">{{ layer.parent.title }}</label>
                    <label class="title" v-else>-</label>
                </div-->
                <div class="col-3">
                    <label class="title">{{ layer.module.title }}</label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-6">Наименование</div>
                <div class="col-3">Геотип</div>
                <!--div class="col-3">Родительский слой</div-->
                <div class="col-3">Включен в модуль</div>
            </div>
        </div>
        <!-- конец Список слоёв -->

        <single-layer></single-layer>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/manager/layer/types';
    import SingleLayer from '@/views/closed/layers/SingleLayer.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleLayer, SureModal},
    })
    export default class Layers extends Vue {

        @Action public managerGetLayers: any;
        @Action public setSureModal: any;
        @Action public deleteLayer: any;
        @Action public setSingleLayer: any;
        @Action public unsetSingleLayer: any;
        @Action public setGeometryTypeByStyleEditor: any;
        @Action public setStyleByStyleEditor: any;
        @Action public setMapCenterDefault: any;
        @Action public setDefaultStyleByStyleEditor: any;
        @Action public getConstructorByLayer: any;
        @Action public unsetConstructorByLayer: any;

        @State('managerLayer') public layerState: LayerState;

        public async created() {
            await this.managerGetLayers();
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param layer
         */
        public setSureModalContent(layer: any) {
            this.setSureModal({
                title: 'Удалить слой?',
                text: `Вы уверены, что хотите удалить слой "${layer.title}" из системы?`,
                action: async () => {
                    this.setSingleLayer(layer);
                    await this.deleteLayer();
                    this.unsetSingleLayer();
                },
            });
        }

        /**
         * Создаем новый слой
         */
        public createLayer() {

            this.unsetSingleLayer();
            this.unsetConstructorByLayer();
            this.setGeometryTypeByStyleEditor({ geometryType: this.layerState.layer.geometry_type });

            // Сбрасываем значение стиля
            this.setDefaultStyleByStyleEditor();

            // Сбрасываем значение карты
            this.setMapCenterDefault();

        }

        /**
         * Изменяем новый слой
         */
        public editLayer(layer: any) {

            this.getConstructorByLayer({layerId: layer.id});

            this.setSingleLayer(layer);
            this.setGeometryTypeByStyleEditor({ geometryType: this.layerState.layer.geometry_type });

            this.setStyleByStyleEditor({ style: this.layerState.layer.style });

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
                    return 'Точечные элементы';
                case 'linestring':
                    return 'Линейные элементы';
                case 'polygon':
                    return 'Полигональные элементы';
            }
        }

    }
</script>