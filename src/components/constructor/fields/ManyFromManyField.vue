<template>
    <div>
        <div v-for="enumValue in field.enums" class="many-from-many-div">
            <label :for="enumValue">{{ enumValue }}</label>
            <input class="form-control" type="checkbox" :id="enumValue" :value="enumValue"
                   v-model="resolvedValue">
        </div>
        <span class="value-length">
            <label>Необходимо выбрать от {{ field.options.min }} до {{ field.options.max }} знач.</label>
        </span>
        <span class="validation-error" v-if="resolvedValue.length < field.options.min">Необходимо выбрать минимум {{ field.options.min }} знач.</span>
        <span class="validation-error" v-else-if="resolvedValue.length > field.options.max">Необходимо выбрать максимум {{ field.options.max }} знач.</span>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue, Inject} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class ManyFromManyField extends Vue {

        @Prop() private field: TableField;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Inject('validator') private $validator: any;

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
