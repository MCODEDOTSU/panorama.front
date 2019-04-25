<template>
    <div class="manager-modules-container content">

        <h1>Справочник картографических слоёв</h1>
        <button data-toggle="modal" data-target="#singleLayerModal" @click="unsetSingleLayer" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый
        </button>

        <!-- Список слоёв -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-6">Наименование</div>
                <div class="col-3">Родительский слой</div>
                <div class="col-3">Включен в модуль</div>
            </div>
            <div class="row row-body" v-for="layer in layerState.layers">
                <div class="col-6">
                    <label class="title">{{ layer.title }}</label>
                    <label class="description" v-html="layer.description"></label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleLayerModal" @click="setSingleLayer(layer)">Изменить</button>
                        <button class="btn-info" @click="getLayerCompositions(layer)">Состав слоя</button>
                        <button class="btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(layer)">Удалить</button>
                    </div>
                </div>
                <div class="col-3">
                    <label class="title" v-if="layer.parent">{{ layer.parent.title }}</label>
                    <label class="title" v-else>-</label>
                </div>
                <div class="col-3">
                    <label class="title">{{ layer.module.title }}</label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-6">Наименование</div>
                <div class="col-3">Родительский слой</div>
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
         * Перейти на компонент редактирования состава слоя
         * @param layer
         */
        public getLayerCompositions(layer: any) {
            this.setSingleLayer(layer);
            this.$router.push(`/manager/layer/${layer.id}`);
        }

    }
</script>