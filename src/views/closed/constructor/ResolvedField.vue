<template>
    <div>
        <text-field :field="field"/>
        <number-field :field="field"/>
        <long-text-field :field="field"/>
        <date-field :field="field"/>
        <one-from-many-field :field="field"/>
        <many-from-many-field :field="field"/>
        <doc-field :field="field"/>
        <link-field :field="field"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    import TextField from '@/components/constructor/fields/TextField.vue';
    import LongTextField from '@/components/constructor/fields/LongTextField.vue';
    import NumberField from '@/components/constructor/fields/NumberField.vue';
    import DateField from '@/components/constructor/fields/DateField.vue';
    import OneFromManyField from '@/components/constructor/fields/OneFromManyField.vue';
    import ManyFromManyField from '@/components/constructor/fields/ManyFromManyField.vue';
    import DocField from '@/components/constructor/fields/DocField.vue';
    import LinkField from '@/components/constructor/fields/LinkField.vue';
    import {IFile} from '@/store/modules/components/utils/fileuploader/types';

    @Component({
        components: {ManyFromManyField, OneFromManyField, TextField, LongTextField, NumberField, DateField, DocField, LinkField},
    })
    export default class ResolvedField extends Vue {
        @Prop() private field: any;
    }
</script>
