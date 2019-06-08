<template>
    <div>
        <div>Table constructor</div>

        <input type="text" class="form-control datatable-search" v-model="tableName" placeholder="Произвольное название таблицы">

        <div class="row" v-for="tableField in tableFields">
            <div class="col-4">
                <select class="form-control" v-model="tableField.type">
                    <option value="text_field">Текстовое поле</option>
                    <option value="long_text_field">Длинное текстовое поле</option>
                    <option value="number_field">Числовое поле</option>
                </select>
            </div>
            <div class="col-6">
                <input type="text" class="form-control" placeholder="Наименование поля" v-model="tableField.title">
            </div>
        </div>

        <button @click="addField">Добавить поле</button>
        <button @click="createTable">Создать таблицу</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {baseUrlAPI} from '@/globals';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component
    export default class TableConstructor extends Vue {

        private tableName: string = '';

        private tableFields: Array = [];

        private addField() {
            this.tableFields.push({
                type: '',
                title: '',
            });
        }

        private async createTable() {
            try {
                const res = await axios.post(`${baseUrlAPI}constructor_create`, {
                    table_title: this.tableName,
                    columns: this.tableFields
                });
            } catch {
                ErrorNotifier.notify();
            }
        }


    }
</script>
