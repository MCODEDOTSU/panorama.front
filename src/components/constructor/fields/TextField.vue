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
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';

    @Component
    export default class TextField extends Vue {
        @Prop() private field: any;
    }
</script>
