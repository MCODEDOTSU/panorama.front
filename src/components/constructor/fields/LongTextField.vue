<template>
    <div>
        <div v-if="field.type ==='long_text_field' && field.required === false">
            <vue-editor :id="field.tech_title"
                        ref="wysiwygContents"
                        v-model="field.value"
                        :name="field.title + ' '"
                        :editorToolbar="toolbar"></vue-editor>

            <input type="text" :id="field.tech_title" class="form-control" v-model="field.value"
                   data-vv-validate-on="change|blur" :placeholder="field.title" v-validate="`max:${field.options.max}`">

            <span class="value-length">{{ valueMaxLength }}</span>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>

        <div v-if="field.type ==='long_text_field' && field.required">
            <vue-editor :id="field.tech_title"
                        ref="wysiwygContents"
                        v-model="field.value"
                        :editorToolbar="toolbar"></vue-editor>

            <input type="hidden" v-if="field.type === 'long_text_field' && field.required"
                   data-vv-validate-on="change|blur"  :name="field.title + ' '" v-model="field.value"
                   v-validate="`required|max:${field.options.max}|min:${field.options.min}`">

            <span class="value-length">Мин: {{ valueMinLength }} &nbsp</span>
            <span class="value-length">Макс: {{ valueMaxLength }}</span>
            <span class="validation-error">{{ errors.first(field.title + ' ') }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Provide, Vue} from 'vue-property-decorator';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: { VueEditor },
    })
    export default class LongTextField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;

        @Provide()
        private toolbar: any = [
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            ['blockquote', 'code-block'],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        get valueMaxLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.max - this.field.value.length;
        }

        get valueMinLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.value.length - this.field.options.min;
        }
    }
</script>
