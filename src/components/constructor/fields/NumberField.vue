<template>
    <div>
        <input type="number" :id="field.tech_title" class="form-control" v-model="field.value"
               data-vv-validate-on="change|blur" v-validate="getValidateRules" :data-vv-as="'\'' + field.title + '\''"
               :placeholder="field.title" :name="field.tech_title" step="1">
        <span class="value-length">
            <label v-if="field.options.min && field.options.max">Введите числовое значение от {{ field.options.min }} до {{ field.options.max }}</label>
            <label v-else-if="field.options.min">Введите числовое значение не меньше {{ field.options.min }}</label>
            <label v-else-if="field.options.max">Введите числовое значение не больше {{ field.options.max }}</label>
        </span>
        <span class="validation-error">{{ errors.first(field.tech_title) }}</span>
    </div>
</template>

<script lang="ts">

    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class NumberField extends Vue {

        @Prop() private field: any;
        @Inject('validator') private $validator: any;

        /**
         * Правила валидации
         */
        get getValidateRules() {
            const rules = [];
            if (this.field.required !== false) {
                rules.push('required');
            }
            if (this.field.options.max) {
                rules.push(`max_value:${this.field.options.max}`);
            }
            if (this.field.options.min) {
                rules.push(`min_value:${this.field.options.min}`);
            }
            rules.push('regex:^[0-9]+');
            return rules.join('|');
        }
    }
</script>
