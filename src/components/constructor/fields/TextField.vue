<template>
    <div>
        <div v-if="field.type === 'text_field' && field.required === false">
            <input type="text" :id="field.tech_title" class="form-control" v-model="validateNonRequired"
                   :placeholder="field.title">
            <span class="value-length">{{ valueLength }}</span>
        </div>
        <input type="text" :id="field.tech_title" v-if="field.type === 'text_field' && field.required"
               data-vv-validate-on="change|blur" v-validate="'required'" :name="field.title"
               class="form-control" v-model="validateRequired" :placeholder="field.title">
        <span class="validation-error">{{ errors.first(field.title) }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class TextField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;

        get validateRequired() {
            if (this.field.value && this.field.value.length >= this.field.options.max) {
                return this.field.value.substring(0, this.field.options.max - 1);
            }

            return this.field.value;
        }

        set validateRequired(value) {
            this.field.value = value;
        }

        get validateNonRequired() {
            if (this.field.value && this.field.value.length >= this.field.options.max) {
                return this.field.value.substring(0, this.field.options.max - 1);
            }

            return this.field.value;
        }

        set validateNonRequired(value) {
            this.field.value = value;
        }

        get valueLength() {
            if (!this.field.value) {
                this.field.value = '';
            }
            return this.field.options.max - this.field.value.length;
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
