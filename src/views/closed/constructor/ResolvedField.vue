<template>
    <div>
        <input type="text" :id="field.tech_title" v-if="field.type === 'text_field' && field.required === false"
               class="form-control" v-model="field.value"
               :placeholder="field.title">
        <input type="text" :id="field.tech_title" v-if="field.type === 'text_field' && field.required"
               data-vv-validate-on="change|blur" v-validate="'required'" :name="field.title"
               class="form-control" v-model="field.value"
               :placeholder="field.title">
        <span class="validation-error">{{ errors.first(field.title) }}</span>

        <input type="number" :id="field.tech_title" v-if="field.type === 'number_field' && field.required === false"
               class="form-control" v-model="field.value"
               :placeholder="field.title" :name="'числовое  ' + field.title">
        <input type="number" :id="field.tech_title" v-if="field.type === 'number_field' && field.required"
               class="form-control" v-model="field.value" data-vv-validate-on="change|blur" v-validate="'required'"
               :placeholder="field.title" :name="'числовое  ' + field.title">
        <span class="validation-error">{{ errors.first('числовое  ' + field.title) }}</span>

        <textarea class="form-control" :id="field.tech_title" v-if="field.type ==='long_text_field' && field.required === false"
                  rows="3" v-model="field.value" :name="field.title + ' '"></textarea>
        <textarea class="form-control" :id="field.tech_title" v-if="field.type ==='long_text_field' && field.required"
                  data-vv-validate-on="change|blur" v-validate="'required'"
                  rows="3" v-model="field.value" :name="field.title + ' '"></textarea>
        <span class="validation-error">{{ errors.first(field.title + ' ') }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ResolvedField extends Vue {
        @Prop() public field: any;

    }
</script>
<style>
    .validation-error {
        color: #ff0000;
        font-size: 10pt
    }
</style>
