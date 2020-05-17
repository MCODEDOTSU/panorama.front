<template>
    <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'date_field'">
        <div class="row no-gutters addition-setting-fields">
            <div class="col-12 col last-in-row">
                <div class="alert alert-info">Дополнительные ограничения по типу поля: минимальное и максимальное значение даты, которое может выбрать пользователь</div>
            </div>
            <div class="col-6 col">
                <label class="label-form-control">Минимальная дата:</label>
            </div>
            <div class="col-6 col last-in-row">
                <label class="label-form-control">Максимальная дата:</label>
            </div>
            <div class="col-6 col">
                <datepicker placeholder="Выбрать дату" :language="ru" :input-class="'form-control'"
                    v-model="tableField.options.minDate"></datepicker>
            </div>
            <div class="col-6 col last-in-row">
                <datepicker placeholder="Выбрать дату" :language="ru" :input-class="'form-control'"
                    v-model="tableField.options.maxDate"></datepicker>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import {ru} from 'vuejs-datepicker/dist/locale';
    import Datepicker from 'vuejs-datepicker';
    import TableField from '@/domain/interfaces/IConstructorTableField';

    @Component({
        components: { Datepicker },
    })
    export default class BuilderDateField extends Vue {

        @Prop() private tableField: TableField;
        @Provide() private ru: any = ru;

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { minDate: '', maxDate: '' };
            }
        }

    }
</script>
