<template>
    <div>
        <div v-if="field.type === 'number_field' && field.required === false">
            <input type="number" :id="field.tech_title" class="form-control" v-model="field.value"
                   :placeholder="field.title" :name="field.title"
                   v-validate="`max_value:${field.options.max}`">
            <span class="value-length">Макс: {{ field.options.max }}</span>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>

        <div v-if="field.type === 'number_field' && field.required">
            <input type="number" :id="field.tech_title" class="form-control" v-model="field.value"
                   data-vv-validate-on="change|blur"
                   v-validate="`required|max_value:${field.options.max}|min_value:${field.options.min}`"
                   :placeholder="field.title" :name="'числовое  ' + field.title">
            <span class="value-length">Мин: {{ field.options.min }} &nbsp</span>
            <span class="value-length">Макс: {{ field.options.max }}</span>
            <span class="validation-error">{{ errors.first('числовое  ' + field.title) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class NumberField extends Vue {
        @Prop() private field: any;
        @Inject('validator') private $validator: any;
    }
</script>
