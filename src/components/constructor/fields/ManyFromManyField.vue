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
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component
    export default class ManyFromManyField extends Vue {

        @Prop() private field: TableField;
        // private checkForAvailableQuantity(e, vals, enumValue: string) {
        //     if (vals.includes(enumValue)) {
        //         this.verifyMaxQuantity(vals, enumValue);
        //         return;
        //     }
        //
        //     if (!vals.includes(enumValue)) {
        //         this.verifyMinQuantity(vals, enumValue);
        //         return;
        //     }
        //
        //     ErrorNotifier.notifyWithCustomMessage('Переданы неверные значения для проверик');
        //     return;
        // }

        // private verifyMaxQuantity(vals, enumValue) {
        //     if (vals.length > this.field.options.max) {
        //         const index = vals.indexOf(enumValue);
        //         if (index !== -1) {
        //             vals.splice(index, 1);
        //         }
        //         this.field.value = vals;
        //
        //         ErrorNotifier.notifyWithCustomMessage('Превышено максимальное кол-во выбираемых значений');
        //     }
        // }
        //
        // private verifyMinQuantity(vals, enumValue) {
        //     if (vals.length < this.field.options.min) {
        //         this.field.value.push(enumValue);
        //
        //         ErrorNotifier.notifyWithCustomMessage('Превышено минимальное кол-во выбираемых значений');
        //     }
        // }

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
