<template>
    <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'number_field'">
        <div class="row no-gutters addition-setting-fields">
            <div class="col-12 col last-in-row">
                <div class="alert alert-info">Дополнительные ограничения по типу поля: минимально и максимально допустимое числовое значение</div>
            </div>
            <div class="col-6 col">
                <label class="label-form-control">Минимально допустимое значение:</label>
            </div>
            <div class="col-6 col last-in-row">
                <label class="label-form-control">Максимально допустимое значение:</label>
            </div>
            <div class="col-6 col">
                <input type="number" class="form-control" min="1"
                       placeholder="Минимальное значение" v-model="tableField.options.min">
            </div>
            <div class="col-6 col last-in-row">
                <input type="number" class="form-control" min="1" max="2147483646" @change="validate"
                       placeholder="Максимальное значение" v-model="tableField.options.max">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class BuilderNumberField extends Vue {
        @Prop() private tableField: TableField;

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { min: 1, max: 100 };
            }
        }

        private validate() {
            if (this.tableField.options.max > 2147483646) {
                this.tableField.options.max = 2147483646;
            }
        }
    }
</script>
