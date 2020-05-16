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
                    <additional-group-tabs></additional-group-tabs>
                    <additional-information></additional-information>
                </div>
                <div class="modal-footer">
                    <span class="validation-error" v-if="fieldsNonCompleteness" style="color: #ff0000; font-size: 10pt">Проверьте заполненность полей во всех вкладках</span>
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
    import AdditionalInformation from '@/views/manager/layers/AdditionalInformation.vue';
    import AdditionalGroupTabs from '@/views/manager/layers/AdditonalGroupTabs.vue';

    @Component({
        components: {AdditionalInformation, AdditionalGroupTabs, VueEditor},
    })
    export default class SingleElement extends Vue {

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Provide('validator') public $validator = this.$validator;
        // @Provide('validator') public $validator;

        @Action public managerUpdateElement: any;

        @State('managerElement') public elementState: ElementState;

        @Provide() private fieldsNonCompleteness = false;

        private validateAndUpdateElement() {
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    this.fieldsNonCompleteness = false;
                    this.managerUpdateElement();
                    $('#singleInformationModal').modal('hide');
                } else {
                    this.fieldsNonCompleteness = true;
                }
            });
        }

    }
</script>
