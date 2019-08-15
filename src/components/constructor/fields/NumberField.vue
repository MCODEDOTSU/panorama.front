<template>
    <div>
        <input type="number" :id="field.tech_title" v-if="field.type === 'number_field' && field.required === false"
               class="form-control" v-model="field.value"
               :placeholder="field.title" :name="'числовое  ' + field.title">
        <input type="number" :id="field.tech_title" v-if="field.type === 'number_field' && field.required"
               class="form-control" v-model="field.value" data-vv-validate-on="change|blur" v-validate="'required'"
               :placeholder="field.title" :name="'числовое  ' + field.title">
        <span class="validation-error">{{ errors.first('числовое  ' + field.title) }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class NumberField extends Vue {
        @Prop() private field: any;
    }
</script>
