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

                <!-- TODO: Функционал Связки Элементов, Пока не нужен, т.к. это можно сделать через конструктор -->
                <!--&lt;!&ndash; Next Elemets &ndash;&gt;-->
                <!--<div class="form-group" v-if="style.list && style.list.hasList">-->
                    <!--<label for="nextElementId">Следующий элемент</label>-->
                    <!--<select id="nextElementId" class="form-control" v-model="elementState.element.element_next_id">-->
                        <!--<option value="">-</option>-->
                        <!--<option v-for="next in elementState.elements" v-if="elementState.element.id !== next.id"-->
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

    import {Component, Inject, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ConstructorState from '@/store/modules/manager/constructor/types';
    import ElementState from '@/store/modules/manager/element/types';
    import LayerState from '@/store/modules/manager/layer/types';
    import ResolvedField from '@/components/constructor/ResolvedField.vue';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {ResolvedField, VueEditor},
    })
    export default class AdditionalInformation extends Vue {

        @Action public managerLayerGetById: any;

        @State('managerConstructor') public constructorState: ConstructorState;
        @State('managerLayer') public layerState: LayerState;
        @State('managerElement') public elementState: ElementState;

        @Provide('style') public style = {};
        @Provide()
        public toolbar: any = [
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        @Inject('validator') private $validator: any;

        public async created() {
            await this.managerLayerGetById({ id: this.$route.params.id });
            this.style = Object.assign({}, this.layerState.layer.style);
        }

        private getPrevElement() {
            return this.elementState.elements.find((a) => {
                return a.element_next_id === this.elementState.element.id;
            });
        }
    }
</script>

<style>
    .validation-error {
        font-size: 10px;
        line-height: 1;
        display: inline-block;
        padding: 4px 0;
        color: red;
    }
</style>
