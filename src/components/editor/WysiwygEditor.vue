<template>
    <!-- Modal - модули, которые можно привязать к контрагенту -->
    <div class="modal fade" id="wysiwygEditorModal" tabindex="-1" role="dialog"
         aria-labelledby="chosenModulesModalLabel" ref="vuemodal">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="wysiwygEditorModalLabel">Редактор</h4>
                </div>
                <div class="modal-body">
                    <vue-editor ref="wysiwygContents" v-model="descField" :editorToolbar="toolbar"></vue-editor>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal" @click="changeDescField()">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!--end of modal -->
</template>

<script lang="ts">

    import {Component, Provide, Vue, Prop, Emit} from 'vue-property-decorator';
    import { VueEditor } from 'vue2-editor';

    @Component({
        components: { VueEditor },
    })
    export default class WysiwygEditor extends Vue {

        @Provide()
        public toolbar: any = [
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        @Prop(String) public description!: string;

        @Provide()
        public descField: string = '';

        @Emit('changeDescField')
        public changeDescField() {
            return this.descField;
        }

        public mounted() {
            $(this.$refs.vuemodal).on('hidden.bs.modal', this.changeDescField);
            $(this.$refs.vuemodal).on('show.bs.modal', this.changeModal);
        }

        public changeModal() {
            this.descField = this.description;
        }

    }
    </script>
