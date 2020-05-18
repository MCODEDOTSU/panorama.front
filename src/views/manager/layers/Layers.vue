<template>
    <div class="manager-container content">

        <h1>Панель редактирования данных</h1>

        <!-- список Модулей -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-7">Доступные данные</div>
                <div class="col-5">Наименование модуля</div>
            </div>
            <div>
                <div class="row row-body" v-for="layer in layerState.layers">
                    <div class="col-7">
                        <label class="title">{{ layer.title }}</label>
                        <label class="description" v-html="layer.description"></label>
                        <div class="actions">
                            <button class="btn-info" @click="showLayer(layer)">Редактор данных</button>
                            <button class="btn-info" @click="showMap(layer)">Картографический редактор</button>
                        </div>
                    </div>
                    <div class="col-5">
                        <label class="title">{{ layer.module.title }}</label>
                        <label class="description" v-html="layer.module.description"></label>
                    </div>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-7">Доступные данные</div>
                <div class="col-5">Наименование модуля</div>
            </div>
        </div>
        <!-- конец список Модулей -->

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import ILayer from '@/domain/interfaces/ILayer';
    import LayerState from '@/store/modules/manager/layer/types';

    @Component
    export default class Layers extends Vue {

        @Action('managerLayerGetByContractor') public managerLayerGetByContractor: any;

        @State('managerLayer') private layerState!: LayerState;

        public created() {
            this.managerLayerGetByContractor();
        }

        public showLayer(layer: ILayer) {
            this.$router.push(`/manager/elements/${layer.id}`);
        }

        public showMap(layer: ILayer) {
            this.$router.push('/manager/gis');
        }

    }
</script>
