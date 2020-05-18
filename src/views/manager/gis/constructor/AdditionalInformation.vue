<template>

    <div class="tab-content" id="mainContent">

        <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">

            <form>

                <!-- Title -->
                <div class="form-group">
                    <label for="singleInformationTitle" class="title">Наименование *</label>
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
                    <label for="singleInformationDescription" class="title">Описание</label>
                    <vue-editor id="singleInformationDescription"
                                ref="wysiwygContents"
                                v-model="elementState.element.description"
                                :editorToolbar="toolbar"></vue-editor>
                </div>

            </form>

        </div>

        <div v-if="constructorState.isTableExists" v-for="group in constructorState.tableFields"
             class="tab-pane addition-information-tab fade" role="tabpanel"
             :aria-labelledby="group.groupTechName + '-tab'" :id="group.groupTechName">

            <div class="scroll-container">

                <vue-scrollbar class="scrollbar scrollbar-min" ref="Scrollbar">

                    <div>

                        <div class="form-group" v-for="field in group.columns">
                            <label :for="field.tech_title" class="title">
                                {{ field.title }}
                                <span v-if="field.required">*</span>
                            </label>
                            <resolved-field :field="field"/>
                        </div>

                    </div>

                </vue-scrollbar>

            </div>

        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import ElementState from '@/store/modules/manager/element/types';
    import ConstructorState from '@/store/modules/manager/constructor/types';
    import ResolvedField from '@/components/constructor/ResolvedField.vue';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {ResolvedField, VueEditor},
    })
    export default class AdditionalInformation extends Vue {

        @Action public managerLayerGetById: any;

        @State('managerConstructor') public constructorState: ConstructorState;
        @State('managerElement') public elementState!: ElementState;

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

        // @Inject('validator') private $validator: any;
    }
</script>
