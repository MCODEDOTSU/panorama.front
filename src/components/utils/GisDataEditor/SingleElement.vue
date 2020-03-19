<template>
    <!-- Modal -->
    <b-modal id="singleElement" title="Карточка Элемента" size="xl" hide-footer>
        <additional-group-tabs></additional-group-tabs>
        <additional-information></additional-information>
        <div class="modal-footer">
            <span class="validation-error" v-if="fieldsNonCompleteness" style="color: #ff0000; font-size: 10pt">Проверьте заполненность полей во всех вкладках</span>
            <button type="button" class="btn btn-primary" @click="validateAndUpdateElement">
                Сохранить
            </button>
            <button type="button" class="btn btn-secondary" @click="$bvModal.hide('singleElement')">Закрыть</button>
        </div>
    </b-modal>
</template>

<script lang="ts">

    import {Component, Vue, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ElementState from '@/store/modules/gis/element/types';
    import {VueEditor} from 'vue2-editor';
    import AdditionalInformation from './AdditionalInformation.vue';
    import AdditionalGroupTabs from './AdditonalGroupTabs.vue';

    @Component({
        components: {AdditionalInformation, AdditionalGroupTabs, VueEditor},
    })
    export default class SingleInformation extends Vue {

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        @Provide('validator') public $validator = this.$validator;
        // @Provide('validator') public $validator;

        @Action public updateElement: any;

        @State('gisElement') public elementState!: ElementState;

        @Provide() private fieldsNonCompleteness = false;

        private validateAndUpdateElement() {
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    this.fieldsNonCompleteness = false;
                    this.updateElement();
                    this.$bvModal.hide('singleElement')
                } else {
                    this.fieldsNonCompleteness = true;
                }
            });
        }

    }
</script>
