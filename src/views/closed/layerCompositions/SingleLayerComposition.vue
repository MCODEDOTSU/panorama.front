<template>
    <!-- Modal -->
    <div class="modal fade" id="singleLayerCompositionModal" tabindex="-1" role="dialog"
         aria-labelledby="singleLayerCompositionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleLayerCompositionModalLabel">
                        <span v-if="layerCompositionState.composition.id === 0">Создание нового компонента слоя</span>
                        <span v-else>Изменение компонента слоя "{{ layerCompositionState.composition.title }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <b-tabs>

                        <!-- Свойства компонента слоя -->
                        <b-tab title="Свойства" active>
                            <form>
                                <div class="form-group">
                                    <label for="singleLayerCompositionTitle">Наименование *</label>
                                    <input type="text" id="singleLayerCompositionTitle" required
                                           class="form-control"
                                           placeholder="Наименование компонента слоя"
                                           v-model="layerCompositionState.composition.title">
                                </div>
                                <div class="form-group">
                                    <label for="singleLayerCompositionDescription">Описание</label>
                                    <vue-editor id="singleLayerCompositionDescription"
                                                ref="wysiwygContents"
                                                v-model="layerCompositionState.composition.description"
                                                :editorToolbar="toolbar"></vue-editor>
                                </div>
                                <div class="form-group">
                                    <label for="singleLayerCompositionGeometryType">Тип геометрии *</label>
                                    <select id="singleLayerCompositionGeometryType" required
                                            class="form-control"
                                            v-model="layerCompositionState.composition.geometry_type"
                                            :disabled="layerCompositionState.composition.id !== 0"
                                            v-on:change="geometryTypeChanged">
                                        <option value="point">Точечный элемент</option>
                                        <option value="linestring">Линейный элемент</option>
                                        <option value="polygon">Полигональный элемент</option>
                                    </select>
                                </div>
                            </form>
                        </b-tab>

                        <!-- Стиль компонента слоя -->
                        <b-tab title="Стиль" ref="style-tab" @click="resizeMap">
                            <layer-style-editor :geometryType="'point'"></layer-style-editor>
                        </b-tab>

                    </b-tabs>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="updateLayerComposition" data-dismiss="modal">
                        Сохранить
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Watch, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import LayerCompositionState from '@/store/modules/manager/layerComposition/types';
    import LayerStyleEditor from '@/components/utils/StyleEditor/LayerStyleEditor.vue';
    import StyleEditorState from '@/store/modules/components/utils/styleEditor/types';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {LayerStyleEditor, VueEditor},
    })
    export default class SingleLayerComposition extends Vue {

        @Provide('any') public toolbar: any = [
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            ['blockquote', 'code-block'],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        @Action public updateLayerComposition: any;
        @Action public mapUpdateSize: any;
        @Action public setGeometryTypeByStyleEditor: any;
        @Action public setDefaultStyleByStyleEditor: any;

        @State('managerLayerComposition') public layerCompositionState: LayerCompositionState;
        @State('styleEditor') public styleEditorState: StyleEditorState;

        @Watch('styleEditorState.jsonStyle')
        public onChangeJsonStyle() {
            this.layerCompositionState.composition.style = this.styleEditorState.jsonStyle;
        }

        /**
         * Был изменен тип геометрии компонента слоя
         */
        public geometryTypeChanged() {
            this.setGeometryTypeByStyleEditor({ geometryType: this.layerCompositionState.composition.geometry_type });
            this.setDefaultStyleByStyleEditor();
        }

        /**
         * Изменить размеры карты для её отображения
         */
        public resizeMap() {
            this.mapUpdateSize();
        }

    }
</script>
