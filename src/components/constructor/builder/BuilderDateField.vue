<template>
    <div class="col-12 col col-enums" v-if="tableField.type === 'date_field'">
        <div class="row no-gutters">
            <div class="col-2 col">
                <div class="alert alert-info">Мин. дата</div>
            </div>
            <div class="col-4 col">
                <datepicker placeholder="Выбрать дату" :language="ru" :input-class="'form-control'"
                    v-model="tableField.options.minDate"></datepicker>
            </div>

            <div class="col-2 col">
                <div class="alert alert-info">Макс. дата</div>
            </div>
            <div class="col-4 col">
                <datepicker placeholder="Выбрать дату" :language="ru" :input-class="'form-control'"
                    v-model="tableField.options.maxDate"></datepicker>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';
    import {ru} from 'vuejs-datepicker/dist/locale';
    import Datepicker from 'vuejs-datepicker';

    @Component({
        components: { Datepicker },
    })
    export default class BuilderDateField extends Vue {
        @Prop() private tableField: TableField;
        @Provide() private ru: any = ru;
    }
</script>
