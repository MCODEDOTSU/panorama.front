<template>
    <div>
        <div v-for="enumValue in field.enums" class="many-from-many-div" v-if="field.type === 'many_from_many_field'">
            <label :for="enumValue">{{ enumValue }}</label>
            <input class="form-control" type="checkbox" :id="enumValue" :value="enumValue"
                   v-model="resolvedValue">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class ManyFromManyField extends Vue {

        @Prop() private field: TableField;

        get resolvedValue() {
            if (this.field.value) {
                return this.field.value;
            }

            return this.field.options.default;
        }

        set resolvedValue(value: []) {
            this.field.value = value;
        }
    }
</script>
