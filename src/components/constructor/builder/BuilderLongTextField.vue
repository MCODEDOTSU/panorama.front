<template>
    <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'long_text_field'">
        <div class="row no-gutters addition-setting-fields">
            <div class="col-12 col last-in-row">
                <div class="alert alert-info">Дополнительные ограничения по типу поля: минимальное и максимальное количество вводимых символов</div>
            </div>
            <div class="col-6 col">
                <label class="label-form-control">Минимальное количество символов:</label>
            </div>
            <div class="col-6 col last-in-row">
                <label class="label-form-control">Максимальное количество символов:</label>
            </div>
            <div class="col-6 col">
                <input type="number" class="form-control" min="1"
                       placeholder="Минимальное количество" v-model="tableField.options.min">
            </div>
            <div class="col-6 col last-in-row">
                <input type="number" class="form-control" min="1" max="65535" @change="validate"
                       placeholder="Максимальное количество" v-model="tableField.options.max">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class BuilderLongTextField extends Vue {
        @Prop() private tableField: TableField;

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { min: 1, max: 1000 };
            }
        }

        private validate() {
            if (this.tableField.options.max > 65535) {
                this.tableField.options.max = 65535;
            }
        }
    }
</script>
