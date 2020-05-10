<template>
    <div class="manager-modules-container content">

        <h1>Справочник модулей</h1>
        <button data-toggle="modal" data-target="#singleModuleModal" @click="unsetSingleModule" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать новый
        </button>

        <!-- Список модулей -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-6">Наименование</div>
                <div class="col-6">Слои</div>
            </div>
            <div class="row row-body" v-for="module in moduleState.modules">
                <div class="col-6">
                    <label class="title">{{ module.title }}</label>
                    <label class="description" v-html="module.description"></label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleModuleModal" @click="setSingleModule(module)">Изменить</button>
                        <button class="btn-danger"data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(module)">Удалить</button>
                    </div>
                </div>
                <div class="col-6">
                    <label v-for="(layer, i) in module.layers" v-if="i <= 2">{{ layer.title }}</label>
                    <label v-if="module.layers.length > 3">... (всего {{ module.layers.length }})</label>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-6">Наименование</div>
                <div class="col-6">Слои</div>
            </div>
        </div>
        <!-- конец Список модулей -->

        <single-module></single-module>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ModuleState from '@/store/modules/manager/module/types';
    import SingleModule from '@/views/administrator/modules/SingleModule.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleModule, SureModal},
    })
    export default class Modules extends Vue {

        @Action public managerGetModules: any;
        @Action public setSureModal: any;
        @Action public deleteModule: any;
        @Action public setSingleModule: any;
        @Action public unsetSingleModule: any;

        @State('managerModule') public moduleState: ModuleState;

        public async created() {
            await this.managerGetModules();
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param module
         */
        public setSureModalContent(module: any) {
            this.setSureModal({
                title: 'Удалить модуль?',
                text: `Вы уверены, что хотите удалить модуль "${module.title}" из системы?`,
                action: async () => {
                    this.setSingleModule(module);
                    await this.deleteModule();
                    this.unsetSingleModule();
                },
            });
        }

    }
</script>