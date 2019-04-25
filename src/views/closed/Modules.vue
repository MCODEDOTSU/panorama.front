<template>
    <div class="manager-modules-container content">

        <h1>Панель редактирования данных</h1>

        <!-- список Модулей -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-7">Доступные данные</div>
                <div class="col-5">Наименование модуля</div>
            </div>
            <div v-for="module in moduleState.infomodules">
                <div class="row row-body" v-for="layer in module.layers">
                    <div class="col-7">
                        <label class="title">{{ layer.title }}</label>
                        <label class="description" v-html="layer.description"></label>
                        <div class="actions">
                            <button class="btn-info" @click="showLayer(layer)">Редактор данных</button>
                            <button class="btn-info" @click="showMap(layer)">Картографический редактор</button>
                        </div>
                    </div>
                    <div class="col-5">
                        <label class="title">{{ module.title }}</label>
                        <label class="description" v-html="module.description"></label>
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
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import InfoModuleState from '../../store/modules/info/infomodule/types';
    import ILayer from '../../domain/entities/interfaces/ILayer';
    import {tableComponentResolver} from '../../domain/entities/info/layers/TableComponentResolver';

    @Component
    export default class Desktop extends Vue {

        @Action('getModules') public getModules: any;

        @State('infomodule') private moduleState!: InfoModuleState;

        public created() {
            this.getModules();
        }

        public showLayer(layer: ILayer) {
            this.$router.push(`/manager/information/${layer.id}`);
        }

        public showMap(layer: ILayer) {
            this.$router.push('/manager/gis');
        }

    }
</script>
