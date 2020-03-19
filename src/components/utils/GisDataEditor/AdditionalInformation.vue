<template>
    <div class="tab-content" id="mainContent">
        <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">
            <form>
                <!-- Title -->
                <div class="form-group">
                    <label for="singleInformationTitle">Наименование *</label>
                    <input type="text" id="singleInformationTitle" required
                           class="form-control"
                           placeholder="Наименование элемента"
                           v-model="elementState.element.title"
                           name="main-name"
                           data-vv-validate-on="change|blur"
                           v-validate="'required'">
                </div>
                <span class="validation-error">{{ errors.first('main-name') }}</span>

                <!-- Description -->
                <div class="form-group">
                    <label for="singleInformationDescription">Описание</label>
                    <vue-editor id="singleInformationDescription"
                                ref="wysiwygContents"
                                v-model="elementState.element.description"
                                :editorToolbar="toolbar"></vue-editor>
                </div>

                <!--&lt;!&ndash; Next Elemets &ndash;&gt;-->
                <!--<div class="form-group" v-if="style.list && style.list.hasList">-->
                    <!--<label for="nextElementId">Следующий элемент</label>-->
                    <!--<select id="nextElementId" class="form-control" v-model="elementState.element.element_next_id">-->
                        <!--<option value="">-</option>-->
                        <!--<option v-for="next in managerElementState.elements" v-if="managerElementState.element.id !== next.id"-->
                                <!--:value="next.id" :title="next.description">-->
                            <!--{{ next.title }}-->
                        <!--</option>-->
                    <!--</select>-->
                <!--</div>-->

                <!--&lt;!&ndash; Prev Elements &ndash;&gt;-->
                <!--<div class="form-group" v-if="style.list && style.list.hasList && getPrevElement()">-->
                    <!--<label for="prevElementId">Предыдущий элемент</label>-->
                    <!--<input type="text" id="prevElementId" readonly class="form-control" :value="getPrevElement().title">-->
                <!--</div>-->

            </form>
        </div>

        <div v-if="constructorState.isTableExists" v-for="group in constructorState.tableFields" class="tab-pane addition-information-tab fade" role="tabpanel"
             :aria-labelledby="group.groupTechName + '-tab'" :id="group.groupTechName" >
            <div class="form-group" v-for="field in group.columns">
                <div class="row no-gutters">
                    <div class="col-3 col">
                        <label :for="field.tech_title">{{ field.title }}
                            <span v-if="field.required">*</span>
                        </label>
                    </div>
                    <div class="col-9 col last-in-row">
                        <resolved-field :field="field" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Inject, Provide, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ConstructorState from '@/store/modules/constructor/types';
    import ElementState from '@/store/modules/gis/element/types';
    // import LayerState from '@/store/modules/manager/layer/types';
    // import ManagerElementState from '@/store/modules/manager/element/types';
    import ResolvedField from '@/views/closed/constructor/ResolvedField.vue';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {ResolvedField, VueEditor},
    })
    export default class AdditionalInformation extends Vue {

        @Action public getLayerById: any;

        @State('konstructor') public constructorState: ConstructorState;
        @State('gisElement') public elementState!: ElementState;
        // @State('managerLayer') public layerState!: LayerState;
        // @State('managerElement') public managerElementState: ManagerElementState;

        @Provide('style') public style = {};
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

        @Inject('validator') private $validator: any;

        // @Watch('elementState.element.layer_id', {deep: true})
        // public async onChangeLayerId() {
        //     if (this.elementState.element.layer_id === 0) {
        //         return;
        //     }
        //     await this.getLayerById({ id: this.elementState.element.layer_id });
        //     this.style = Object.assign({}, this.layerState.layer.style);
        // }

        // private getPrevElement() {
        //     return this.managerElementState.elements.find((a) => {
        //         return a.element_next_id === this.elementState.element.id;
        //     });
        // }
    }
</script>
