<template>
    <div>
        <div v-if="field.type === 'text_field' && field.required === false">
            <input type="text" :id="field.tech_title" class="form-control" v-model="field.value"
                   data-vv-validate-on="change|blur"
                   :placeholder="field.title" v-validate="`max:${field.options.max}`">
            <span class="value-length">{{ valueMaxLength }}</span>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>
        <div v-if="field.type === 'text_field' && field.required">
            <input type="text" :id="field.tech_title" data-vv-validate-on="change|blur" :name="field.title"
                   v-validate="`required|max:${field.options.max}|min:${field.options.min}`"
                   class="form-control" v-model="field.value" :placeholder="field.title">
            <span class="value-length">Мин: {{ valueMinLength }} &nbsp</span>
            <span class="value-length">Макс: {{ valueMaxLength }}</span>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class TextField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;

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

<style>
    .value-length {
        font-size: 14px;
        line-height: 1;
        display: inline-block;
        padding: 4px 0;
        color: red;
    }
</style>
