<template>
    <!-- Modal -->
    <div class="modal fade" id="singleInformationModal" tabindex="-1" role="dialog"
         aria-labelledby="singleInformationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleInformationModalLabel">
                        <span v-if="elementState.element.id === 0">Создание нового элемента</span>
                        <span v-else>Изменение элемента "{{ elementState.element.title }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" id="tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="main-tab" data-toggle="tab" href="#main" role="tab" aria-controls="main" aria-selected="true">Главная</a>
                        </li>

                        <additional-group-tabs></additional-group-tabs>

                    </ul>
                    <div class="tab-content" id="mainContent">
                        <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">
                            <form>
                                <div class="form-group">
                                    <label for="singleInformationTitle">Наименование *</label>
                                    <input type="text" id="singleInformationTitle" required
                                           class="form-control"
                                           placeholder="Наименование элемента"
                                           v-model="elementState.element.title">
                                </div>
                                <div class="form-group">
                                    <label for="singleInformationDescription">Описание</label>
                                    <vue-editor id="singleInformationDescription"
                                                ref="wysiwygContents"
                                                v-model="elementState.element.description"
                                                :editorToolbar="toolbar"></vue-editor>
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <additional-information v-if="constructorState.isTableExists"></additional-information>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="validateAndUpdateElement">
                        Сохранить
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
    import ElementState from '@/store/modules/manager/element/types';
    import {VueEditor} from 'vue2-editor';
    import AdditionalInformation from '@/views/closed/information/AdditionalInformation.vue';
    import ConstructorState from '@/store/modules/constructor/types';
    import AdditionalGroupTabs from '@/views/closed/information/AdditonalGroupTabs.vue';

    @Component({
        components: {AdditionalInformation, AdditionalGroupTabs, VueEditor},
    })
    export default class SingleInformation extends Vue {

        @Action public managerUpdateElement: any;
        @State('managerElement') public elementState: ElementState;
        @State('constructor') public constructorState: ConstructorState;
        @Provide('validator') public $validator = this.$validator;

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

        private validateAndUpdateElement() {
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    this.managerUpdateElement();
                    $('#singleInformationModal').modal('hide');
                }
            });
        }
    }
</script>
