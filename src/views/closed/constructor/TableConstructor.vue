<template>
    <div>
        <div class="row" v-for="tableField in tableFields">
            <div class="col-3">
                <select class="form-control" v-model="tableField.type">
                    <option value="text_field">Текстовое поле</option>
                    <option value="long_text_field">Длинное текстовое поле</option>
                    <option value="number_field">Числовое поле</option>
                </select>
            </div>
            <div class="col-4">
                <input type="text" class="form-control" placeholder="Наименование поля" v-model="tableField.title">
            </div>
            <div class="col-4">
                <input type="text" class="form-control" placeholder="Техническое наименование поля" v-model="tableField.tech_title">
            </div>
            <div class="col-1">
                <input type="checkbox" class="form-control" placeholder="Обязательное" v-model="tableField.required">
            </div>
        </div>

        <hr>

        <div class="row">
            <button type="button" class="btn btn-primary" @click="addField">Добавить поле</button>
            <button v-if="!constructorState.isTableExists" :disabled="tableFields.length === 0" type="button" class="btn btn-primary" @click="createTable">Сформировать таблицу</button>
            <button v-else type="button" class="btn btn-primary" @click="updateTable">Обновить таблицу</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import axios from 'axios';
    import {baseUrlAPI} from '@/globals';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
    import TableField from '@/domain/entities/constructor/TableField';
    import ConstructorState from '@/store/modules/constructor/types';
    import {State} from 'vuex-class';

    @Component
    export default class TableConstructor extends Vue {

        private tableFields: TableField[] = [];
        @State('constructor') private constructorState: ConstructorState;

        public created() {
            this.checkIfTableExists();
        }

        private addField() {
            this.tableFields.push({
                type: 'text_field',
                title: '',
                tech_title: '',
                required: false,
            });
        }

        private async createTable() {
            try {
                const res = await axios.post(`${baseUrlAPI}constructor/constructor_create`, {
                    table_title: this.$route.params.id,
                    columns: this.tableFields,
                });
            } catch {
                ErrorNotifier.notify();
            }
        }

        private async checkIfTableExists() {
            try {
                const res = await axios.get(`${baseUrlAPI}constructor/is_table_exists/${this.$route.params.id}`);

                if (res.data) {
                    this.getTableInfo();
                }

            } catch {
                ErrorNotifier.notify();
            }
        }

        private async updateTable() {
            // TODO: Обновление таблицы
        }

        private async getTableInfo() {
            try {
                const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${this.$route.params.id}`);
                this.tableFields = res.data;
            } catch {
                ErrorNotifier.notify();
            }
        }


    }
</script>
