<template>
    <div>
        <vue-editor :id="field.tech_title" v-if="field.type ==='long_text_field' && field.required === false"
                    ref="wysiwygContents"
                    v-model="field.value"
                    :name="field.title + ' '"
                    :editorToolbar="toolbar"></vue-editor>

        <vue-editor :id="field.tech_title" v-if="field.type ==='long_text_field' && field.required"
                    ref="wysiwygContents"
                    v-model="field.value"
                    :editorToolbar="toolbar"></vue-editor>

        <input type="hidden" :id="field.tech_title" v-if="field.type === 'long_text_field' && field.required"
               data-vv-validate-on="change|blur" v-validate="'required'" :name="field.title + ' '" v-model="field.value">
        <span class="validation-error">{{ errors.first(field.title + ' ') }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Provide, Vue} from 'vue-property-decorator';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: { VueEditor }
    })
    export default class LongTextField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;

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
