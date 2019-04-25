<template>
    <!-- Modal -->
    <div class="modal fade" id="singleLayerModal" tabindex="-1" role="dialog" aria-labelledby="singleLayerModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleLayerModalLabel">
                        <span v-if="layerState.layer.id === 0">Создание нового слоя</span>
                        <span v-else>Изменение слоя "{{ layerState.layer.title }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="singleLayerTitle">Наименование *</label>
                            <input type="text" id="singleLayerTitle" required
                                   class="form-control"
                                   placeholder="Наименование слоя"
                                   v-model="layerState.layer.title">
                        </div>
                        <div class="form-group">
                            <label for="singleLayerDescription">Описание</label>
                            <vue-editor id="singleLayerDescription"
                                        ref="wysiwygContents"
                                        v-model="layerState.layer.description"
                                        :editorToolbar="toolbar"></vue-editor>
                        </div>
                        <div class="form-group">
                            <label for="singleLayerParentId">Родительский слой</label>
                            <select id="singleLayerParentId" class="form-control" v-model="layerState.layer.parent_id"
                                    disabled>
                                <option value="0"></option>
                                <option v-for="layer in layerState.layers" v-if="layerState.layer.id !== layer.id"
                                        :value="layer.id" :title="layer.description">
                                    {{ layer.title }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="singleLayerModuleId">Включить в модуль *</label>
                            <select id="singleLayerModuleId" required
                                    class="form-control"
                                    v-model="layerState.layer.module_id">
                                <option v-for="module in moduleState.modules" :value="module.id"
                                        :title="module.description">
                                    {{ module.title }}
                                </option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            @click="updateLayer"
                            data-dismiss="modal">
                        Сохранить
                    </button>
                    <button type="button" class="btn btn-primary"
                            @click="$router.push(`/manager/layer/${layerState.layer.id}`)"
                            data-dismiss="modal">
                        Состав слоя
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ModuleState from '@/store/modules/manager/module/types';
    import LayerState from '@/store/modules/manager/layer/types';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {VueEditor},
    })
    export default class SingleLayer extends Vue {

        @Action public managerGetModules: any;
        @Action public updateLayer: any;

        @State('managerModule') public moduleState: ModuleState;
        @State('managerLayer') public layerState: LayerState;

        @Provide()
        public toolbar: any = [
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            ['blockquote', 'code-block'],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        public async created() {
            await this.managerGetModules();
        }

    }
</script>