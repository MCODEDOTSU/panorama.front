<template>
    <div class="col-12 col col-enums" v-if="tableField.type === 'long_text_field'">
        <div class="row no-gutters">
            <div class="col-2 col">
                <div class="alert alert-info">Мин.</div>
            </div>
            <div class="col-1 col">
                <input type="number" class="form-control" min="1"
                       placeholder="Кол-во" v-model="tableField.options.min">
            </div>

            <div class="col-2 col">
                <div class="alert alert-info">Макс.</div>
            </div>
            <div class="col-1 col">
                <input type="number" class="form-control" min="1" max="65535" @change="validate"
                       placeholder="Кол-во" v-model="tableField.options.max">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class BuilderLongTextField extends Vue {
        @Prop() tableField: TableField;

        private validate() {
            if (this.tableField.options.max > 65535) {
                this.tableField.options.max = 65535;
            }
        }
    }
</script>
