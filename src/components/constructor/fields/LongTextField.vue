<template>
    <div>
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
    export default class LongTextField extends Vue {
        @Prop() private field: any;
    }
</script>
