<template>
    <div>
        <text-field :field="field" v-if="field.type === 'text_field'"/>
        <number-field :field="field" v-if="field.type === 'number_field'"/>
        <long-text-field :field="field" v-if="field.type === 'long_text_field'"/>
        <date-field :field="field" v-if="field.type === 'date_field'"/>
        <one-from-many-field :field="field" v-if="field.type === 'one_from_many_field'"/>
        <many-from-many-field :field="field" v-if="field.type === 'many_from_many_field'"/>
        <doc-field :field="field" v-if="field.type === 'doc_field'"/>
        <link-field :field="field" v-if="field.type === 'link_field'"/>
        <directory-field :field="field" v-if="field.type === 'directory_field'"/>
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
    import DirectoryField from '@/components/constructor/fields/DirectoryField.vue';

    @Component({
        components: {ManyFromManyField, OneFromManyField, TextField, LongTextField, NumberField, DateField, DocField, LinkField, DirectoryField},
    })
    export default class ResolvedField extends Vue {
        @Prop() private field: any;
    }
</script>
