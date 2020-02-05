<template>
    <div>
        <text-field :field="field"></text-field>
        <number-field :field="field"></number-field>
        <long-text-field :field="field"></long-text-field>
        <date-field :field="field"></date-field>
        <one-from-many-field :field="field"></one-from-many-field>
        <many-from-many-field :field="field"></many-from-many-field>
        <doc-field :field="field"></doc-field>
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

    @Component({
        components: {ManyFromManyField, OneFromManyField, TextField, LongTextField, NumberField, DateField, DocField},
    })
    export default class ResolvedField extends Vue {
        @Prop() private field: any;
    }
</script>
