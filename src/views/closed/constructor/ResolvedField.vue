<template>
    <div>
        <text-field :field="field"></text-field>
        <number-field :field="field"></number-field>
        <long-text-field :field="field"></long-text-field>
        <date-field :field="field"></date-field>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    import TextField from '@/components/constructor/fields/TextField.vue';
    import LongTextField from '@/components/constructor/fields/LongTextField.vue';
    import NumberField from '@/components/constructor/fields/NumberField.vue';
    import DateField from '@/components/constructor/fields/DateField.vue';

    @Component({
        components: {TextField, LongTextField, NumberField, DateField},
    })
    export default class ResolvedField extends Vue {
        @Prop() private field: any;
    }
</script>
<style>
    .validation-error {
        color: #ff0000;
        font-size: 10pt
    }
</style>
