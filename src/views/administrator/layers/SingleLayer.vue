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

                    <b-tabs>

                        <!-- Свойства компонента слоя -->
                        <b-tab title="Свойства" active>

                            <form>

                                <div class="form-group">
                                    <label for="singleLayerAlias">Алиас *</label>
                                    <input type="text" id="singleLayerAlias" required
                                           class="form-control"
                                           placeholder="Алиас слоя"
                                           v-model="layerState.layer.alias">
                                </div>

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

                                <!--<div class="form-group">-->
                                    <!--<label for="singleLayerParentId">Родительский слой</label>-->
                                    <!--<select id="singleLayerParentId" class="form-control" v-model="layerState.layer.parent_id"-->
                                            <!--disabled>-->
                                        <!--<option value="0"></option>-->
                                        <!--<option v-for="layer in layerState.layers" v-if="layerState.layer.id !== layer.id"-->
                                                <!--:value="layer.id" :title="layer.description">-->
                                            <!--{{ layer.title }}-->
                                        <!--</option>-->
                                    <!--</select>-->
                                <!--</div>-->

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

                                <div class="form-group">
                                    <label for="singleLayerVisibility">Видимость слоя *</label>
                                    <select id="singleLayerVisibility" required
                                            class="form-control"
                                            v-model="layerState.layer.visibility">
                                        <option value="false" title="Скрытый слой">Скрытый слой</option>
                                        <option value="true" title="Отображаемый слой">Отображаемый слой</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="singleLayerGeometryType">Тип геометрии *</label>
                                    <select id="singleLayerGeometryType" required
                                            class="form-control"
                                            v-model="layerState.layer.geometry_type"
                                            :disabled="layerState.layer.id !== 0"
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

                            <style-editor :geometryType="layerState.layer.geometry_type"></style-editor>

                        </b-tab>

                        <!-- Форма - дополнительные поля конструктора -->
                        <b-tab title="Форма" ref="style-tab">
                            <resolved-field></resolved-field>
                        </b-tab>

                    </b-tabs>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            @click="updateSingleLayer"
                            data-dismiss="modal">
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
    import {VueEditor} from 'vue2-editor';

    import ModuleState from '@/store/modules/administrator/module/types';
    import LayerState from '@/store/modules/administrator/layer/types';
    import StyleEditorState from '@/store/modules/administrator/styleEditor/types';

    import StyleEditor from '@/views/administrator/layers/style/StyleEditor.vue';
    import ResolvedField from '@/views/administrator/layers/constructor/ResolvedField.vue';

    @Component({
        components: {StyleEditor, VueEditor, ResolvedField},
    })
    export default class SingleLayer extends Vue {

        @Provide() public toolbar: any = [
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        @Action public administratorModuleGetAll: any;
        @Action public administratorLayerUpdate: any;
        @Action public mapUpdateSize: any;
        @Action public styleEditorSetGeometryType: any;
        @Action public styleEditorSetDefaultStyle: any;
        @Action public administratorConstructorGetByLayer: any;
        @Action public administratorConstructorUpdate: any;

        @State('administratorModule') public moduleState: ModuleState;
        @State('administratorLayer') public layerState: LayerState;
        @State('styleEditor') public styleEditorState: StyleEditorState;

        @Watch('styleEditorState.style', {deep: true})
        public onChangeJsonStyle() {
            this.layerState.layer.style = Object.assign({}, this.styleEditorState.style);
        }

        public async created() {
            await this.administratorModuleGetAll();
            await this.administratorConstructorGetByLayer({ layerId: this.layerState.layer.id });
        }

        /**
         * Был изменен тип геометрии компонента слоя
         */
        public geometryTypeChanged() {
            this.styleEditorSetGeometryType({ geometryType: this.layerState.layer.geometry_type });
            this.styleEditorSetDefaultStyle();
        }

        /**
         * Изменить размеры карты для её отображения
         */
        public resizeMap() {
            this.mapUpdateSize();
        }

        /**
         * Обновить данные слоя
         */
        public async updateSingleLayer() {
            await this.administratorLayerUpdate();
            this.administratorConstructorUpdate({ layerId: this.layerState.layer.id });
        }

    }
</script>