<template>
    <div>

        <vue-editor :id="field.tech_title" ref="wysiwygContents" v-model="field.value" :editorToolbar="toolbar"></vue-editor>
        <input type="hidden" v-model="cleanText" :name="field.tech_title"
               data-vv-validate-on="change|blur"  v-validate="getValidateRules" :data-vv-as="'\'' + field.title + '\''">

        <span class="value-length">
            <label v-if="valueMinLength > 0 && valueMaxLength > 0">Осталось ввести от {{ valueMinLength }} до {{ valueMaxLength }} симв.</label>
            <label v-else-if="valueMinLength > 0">Осталось ввести ещё минимум {{ valueMinLength }} симв.</label>
            <label v-else-if="valueMaxLength > 0">Можно ввести ещё максимум {{ valueMaxLength }} симв.</label>
        </span>
        <span class="validation-error">{{ errors.first(field.tech_title) }}</span>

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

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Inject('validator') private $validator: any;

        @Provide()
        private toolbar: any = [
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];

        /**
         * Правила валидации
         */
        get getValidateRules() {
            const rules = [];
            if (this.field.required !== false) {
                rules.push('required');
            }
            if (this.field.options.max) {
                rules.push(`max:${this.field.options.max}`);
            }
            if (this.field.options.min) {
                rules.push(`min:${this.field.options.min}`);
            }
            return rules.join('|');
        }

        get cleanText() {
            if (!this.field.value) {
                this.field.value = '';
            }
            const regex = /<[^<>]+>/g;
            return this.field.value.replace(regex, '');
        }

        /**
         * Осталось ввести
         */
        get valueMaxLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            const regex = /<[^<>]+>/g;
            return this.field.options.max ? (this.field.options.max - this.field.value.replace(regex, '').length) : -1;
        }

        /**
         * Необходимо ввести минимум
         */
        get valueMinLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            const regex = /<[^<>]+>/g;
            return this.field.options.min ? (this.field.options.min - this.field.value.replace(regex, '').length) : -1;
        }
    }
</script>
