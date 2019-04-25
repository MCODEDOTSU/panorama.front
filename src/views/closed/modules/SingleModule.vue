<template>
    <!-- Modal -->
    <div class="modal fade" id="singleModuleModal" tabindex="-1" role="dialog" aria-labelledby="singleModuleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleModuleModalLabel">
                        <span v-if="moduleState.module.id === 0">Создание нового модуля</span>
                        <span v-else>Изменение модуля "{{ moduleState.module.title }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="singleModuleTitle">Наименование *</label>
                            <input type="text" id="singleModuleTitle" required
                                   class="form-control"
                                   placeholder="Наименование модуля"
                                   v-model="moduleState.module.title">
                        </div>
                        <div class="form-group">
                            <label for="singleModuleDescription">Описание</label>
                            <vue-editor id="singleModuleDescription"
                                        ref="wysiwygContents"
                                        v-model="moduleState.module.description"
                                        :editorToolbar="toolbar"></vue-editor>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="updateModule" data-dismiss="modal">Сохранить</button>
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
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {VueEditor},
    })
    export default class SingleModule extends Vue {

        @Action public updateModule: any;

        @State('managerModule') public moduleState: ModuleState;

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

    }
</script>