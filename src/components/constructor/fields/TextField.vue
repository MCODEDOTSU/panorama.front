<template>
    <div>
        <input type="text" :id="field.tech_title" class="form-control" v-model="field.value"
               data-vv-validate-on="change|blur" v-validate="getValidateRules" :data-vv-as="'\'' + field.title + '\''"
               :placeholder="field.title" :name="field.tech_title">
        <span class="value-length">
            <label v-if="valueMinLength > 0 && valueMaxLength > 0">Осталось ввести от {{ valueMinLength }} до {{ valueMaxLength }} симв.</label>
            <label v-else-if="valueMinLength > 0">Осталось ввести ещё минимум {{ valueMinLength }} симв.</label>
            <label v-else-if="valueMaxLength > 0">Можно ввести ещё максимум {{ valueMaxLength }} симв.</label>
        </span>
        <span class="validation-error">{{ errors.first(field.tech_title) }}</span>
    </div>
</template>

<script lang="ts">

    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class TextField extends Vue {

        @Prop() private field: any;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
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
                rules.push(`max:${this.field.options.max}`);
            }
            if (this.field.options.min) {
                rules.push(`min:${this.field.options.min}`);
            }
            return rules.join('|');
        }

        /**
         * Осталось ввести
         */
        get valueMaxLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.max ? (this.field.options.max - this.field.value.length) : -1;
        }

        /**
         * Необходимо ввести минимум
         */
        get valueMinLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.min ? (this.field.options.min - this.field.value.length) : -1;
        }

    }
</script>
