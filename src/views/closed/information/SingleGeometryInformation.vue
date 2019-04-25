<template>
    <!-- Modal -->
    <div class="modal fade" id="singleGeometryInformationModal" tabindex="-1" role="dialog"
         aria-labelledby="singleGeometryInformationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleGeometryInformationModalLabel">
                        <span v-if="geometryState.geometry.id === 0">Создание нового геообъекта</span>
                        <span v-else>Изменение геообъекта "{{ geometryState.geometry.title }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="singleGeometryTitle">Наименование *</label>
                            <input type="text" id="singleGeometryTitle" required
                                   class="form-control"
                                   placeholder="Наименование геообъекта"
                                   v-model="geometryState.geometry.title">
                        </div>
                        <div class="form-group">
                            <label for="singleGeometryDescription">Описание</label>
                            <vue-editor id="singleGeometryDescription"
                                        ref="wysiwygContents"
                                        v-model="geometryState.geometry.description"
                                        :editorToolbar="toolbar"></vue-editor>
                        </div>
                        <div class="form-group">
                            <label for="singleGeometryComposition">Тип геообъекта:</label>
                            <select class="form-control"
                                    id="singleGeometryComposition"
                                    v-model="geometryState.geometry.layer_composition_id"
                                    :disabled="geometryState.geometry.id !== 0">
                                <option v-for="singleComposition in layerCompositionState.compositions" :value="singleComposition.id">
                                    {{singleComposition.title}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="singleGeometryAddressCity">Город</label>
                            <input type="text" id="singleGeometryAddressCity"
                                   class="form-control"
                                   placeholder="г. Астрахань"
                                   v-model="geometryState.geometry.city">
                        </div>
                        <div class="form-group">
                            <label for="singleGeometryAddressStreet">Улица</label>
                            <input type="text" id="singleGeometryAddressStreet"
                                   class="form-control"
                                   placeholder="ул. Кр.Набережная"
                                   v-model="geometryState.geometry.street">
                        </div>
                        <div class="form-group">
                            <label for="singleGeometryAddressBuild">Дом, строение</label>
                            <input type="text" id="singleGeometryAddressBuild"
                                   class="form-control"
                                   v-model="geometryState.geometry.build">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="managerUpdateGeometry" data-dismiss="modal">
                        Сохранить
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Provide, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ElementState from '@/store/modules/manager/element/types';
    import GeometryState from '@/store/modules/manager/geometry/types';
    import LayerCompositionState from '@/store/modules/manager/layerComposition/types';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {VueEditor},
    })
    export default class SingleGeometryInformation extends Vue {

        @Action public managerUpdateGeometry: any;
        @Action public getLayerCompositions: any;

        @State('managerElement') public elementState: ElementState;
        @State('managerGeometry') public geometryState: GeometryState;
        @State('managerLayerComposition') public layerCompositionState: LayerCompositionState;

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
