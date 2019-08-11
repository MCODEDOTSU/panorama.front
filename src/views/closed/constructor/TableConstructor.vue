<template>
    <div>
        <div class="row" v-for="(tableField, key) in tableFields">
            <div class="col-2">
                <select class="form-control" v-model="tableField.type">
                    <option value="text_field">Текстовое поле</option>
                    <option value="long_text_field">Длинное текстовое поле</option>
                    <option value="number_field">Числовое поле</option>
                </select>
            </div>
            <div class="col-4">
                <input type="text" :name="'наименование под номером ' + key" data-vv-validate-on="change|blur" class="form-control" v-validate="'required'" placeholder="Наименование поля" v-model="tableField.title">
                <span class="validation-error" style="color: #ff0000; font-size: 10pt">{{ errors.first('наименование под номером ' + key) }}</span>
            </div>
            <div class="col-4">
                <input type="text" class="form-control" data-vv-validate-on="change|blur" v-validate="'required'" :name="'техническое_наименование_под_номером_' + key" placeholder="техническое наименование поля" v-model="tableField.tech_title">
                <span class="validation-error" style="color: #ff0000; font-size: 10pt">{{ errors.first('техническое_наименование_под_номером_' + key) }}</span>
            </div>
            <div class="col-1">
                <input type="checkbox" class="form-control" placeholder="Обязательное" v-model="tableField.required">
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-primary" @click="dropColumn(tableField)">X</button>
            </div>
        </div>

        <hr>

        <div class="row">
            <button type="button" class="btn btn-primary" @click="addField">Добавить поле</button>
            <button v-if="!constructorState.isTableExists" :disabled="tableFields.length === 0" type="button"
                    class="btn btn-primary" @click="createTable">Сформировать таблицу
            </button>
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

        private createTable() {
            // @ts-ignore
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    try {
                        axios.post(`${baseUrlAPI}constructor/constructor_create`, {
                            table_title: this.$route.params.id,
                            columns: this.tableFields,
                        });
                    } catch {
                        ErrorNotifier.notify();
                    }
                }
            });
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

        private updateTable() {
            // @ts-ignore
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    try {
                        axios.post(`${baseUrlAPI}constructor/constructor_update`, {
                            table_title: this.$route.params.id,
                            columns: this.tableFields,
                        });

                        this.getTableInfo();
                    } catch {
                        ErrorNotifier.notify();
                    }
                }
            });

        }

        private async getTableInfo() {
            try {
                const res = await axios.get(`${baseUrlAPI}constructor/get_table_info/${this.$route.params.id}`);
                this.tableFields = res.data;
            } catch {
                ErrorNotifier.notify();
            }
        }

        private async dropColumn(tableField: TableField) {
            try {
                const res = await axios.post(`${baseUrlAPI}constructor/drop_column`, {
                    column_tech_title: tableField.tech_title,
                    table_id: this.$route.params.id,
                });

                this.getTableInfo();
            } catch {
                ErrorNotifier.notify();
            }
        }
    }
</script>
