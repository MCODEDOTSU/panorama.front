<template>
    <div class="col-12 col col-enums" v-if="tableField.type === 'date_field'">
        <div class="row no-gutters">
            <div class="col-2 col">
                <div class="alert alert-info">Мин. дата</div>
            </div>
            <div class="col-4 col">
                <input type="text" class="form-control"
                       placeholder="Мин. дата" v-model="tableField.options.minDate">
            </div>

            <div class="col-2 col">
                <div class="alert alert-info">Макс. дата</div>
            </div>
            <div class="col-4 col">
                <input type="text" class="form-control"
                       placeholder="Макс. дата" v-model="tableField.options.maxDate">
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component
    export default class BuilderDateField extends Vue {
        @Prop() private tableField: TableField
    }
</script>
