<template>
    <div>
        <input type="text" :id="field.tech_title" class="form-control" v-model="field.value"
               data-vv-validate-on="change|blur"  v-validate="getValidateRules"
               :placeholder="field.title" :name="field.tech_title">
        <span class="value-length">
                <label v-if="valueMinLength > 0 && valueMaxLength > 0">Осталось ввести от {{ valueMinLength }} до {{ valueMaxLength }} симв.</label>
                <label v-else-if="valueMinLength > 0">Осталось ввести {{ valueMinLength }} симв.</label>
                <label v-else-if="valueMaxLength > 0">Можно ввести ещё {{ valueMaxLength }} симв.</label>
            </span>
        <span class="validation-error">{{ errors.first(field.tech_title) }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class TextField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;

        get getValidateRules() {
            let rules = [];
            if (this.field.required !== false) {
                rules.push('required');
            }
            if (this.field.options.max !== undefined) {
                rules.push(`max:${this.field.options.max}`);
            }
            if (this.field.options.min !== undefined) {
                rules.push(`min:${this.field.options.max}`);
            }
            return rules.join('|');
        }

        get valueMaxLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.max !== undefined ? (this.field.options.max - this.field.value.length) : -1;
        }

        get valueMinLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.min !== undefined ? (this.field.options.min - this.field.value.length) : -1;
        }

    }
</script>

<style>
    .value-length {
        font-size: 14px;
        line-height: 1;
        display: inline-block;
        padding: 4px 0;
        color: red;
    }
</style>
