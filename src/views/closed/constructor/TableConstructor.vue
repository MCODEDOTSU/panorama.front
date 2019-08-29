<template>
    <div>
        <div v-for="(tableGroup, groupKey) in tableFields">
            <div class="row">
                <div class="col-1">
                    Группа:
                </div>
                <div class="col-3">
                    <input type="text" class="form-control" placeholder="Группа" v-model="tableGroup.group">
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-primary" @click="addField(groupKey)">Добавить поле</button>
                </div>
            </div>
            <div>
                <div class="row">
                    <div class="col-2">
                        <p>Группа</p>
                    </div>
                    <div class="col-2">
                        <p>Тип</p>
                    </div>
                    <div class="col-3">
                        <p>Наименование</p>
                    </div>
                    <div class="col-3">
                        <p>Тех. наименование</p>
                    </div>
                    <div class="col-1">
                        <p>*</p>
                    </div>
                    <div class="col-1">
                        <p>Удалить</p>
                    </div>
                </div>
                <div class="row constructor-table-fields" v-for="(tableField, key) in tableGroup.columns">
                    <div class="col-2">
                        <select class="form-control" v-model="tableField.group" @change="changeGroup(tableField, key, groupKey)">
                            <option v-for="tableGroup in tableFields" :value="tableGroup.group">{{ tableGroup.group }}</option>
                        </select>
                    </div>
                    <div class="col-2">
                        <select class="form-control" v-model="tableField.type">
                            <option value="text_field">Текстовое поле</option>
                            <option value="long_text_field">Длинное текстовое поле</option>
                            <option value="number_field">Числовое поле</option>
                            <option value="date_field">Дата</option>
                            <option value="one_from_many_field">Один из многих</option>
                            <option value="many_from_many_field">Многие из многих</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <input type="text" :name="'наименование под номером ' + key" data-vv-validate-on="change|blur" class="form-control" v-validate="'required'" placeholder="Наименование поля" v-model="tableField.title">
                        <span class="validation-error" style="color: #ff0000; font-size: 10pt">{{ errors.first('наименование под номером ' + key) }}</span>
                    </div>
                    <div class="col-3">
                        <tag-selector v-if="tableField.type === 'one_from_many_field' || tableField.type === 'many_from_many_field'" v-model="tableField.enums"
                                      name="enums"/>

                        <input type="text" class="form-control" v-model="tableField.tech_title"
                               data-vv-validate-on="change|blur" v-validate="'required'" :name="'техническое_наименование_под_номером_' + key" placeholder="техническое наименование поля">
                        <span class="validation-error" style="color: #ff0000; font-size: 10pt">{{ errors.first('техническое_наименование_под_номером_' + key) }}</span>
                    </div>
                    <div class="col-1">
                        <input type="checkbox" class="form-control" placeholder="Обязательное" v-model="tableField.required">
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn btn-primary" @click="dropColumn(tableField, key, groupKey)">X</button>
                    </div>
                </div>

                <hr>
            </div>
        </div>
        <div class="row">
            <button type="button" class="btn btn-primary" @click="addGroup">Добавить группу</button>

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
    import TagSelector from 'vue-tag-selector';
    import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
    import {arrayIndexOf} from '@/domain/services/common/ArrayActions';
    import TableGroup from '@/domain/entities/constructor/TableGroup';

    @Component({
        components: {TagSelector},
    })
    export default class TableConstructor extends Vue {

        private tableFields: TableGroup[] = [];
        @State('constructor') private constructorState: ConstructorState;

        public created() {
            this.checkIfTableExists();
        }

        private addField(groupKey: string) {
            this.tableFields[groupKey].columns.push({
                type: 'text_field',
                title: '',
                tech_title: undefined,
                required: false,
                enums: undefined,
            });
        }

        private addGroup() {
            this.tableFields.push({
                group: 'Новая группа',
                columns: [{
                    type: 'text_field',
                    title: '',
                    tech_title: undefined,
                    required: false,
                    enums: undefined,
                }],
            });
        }

        private changeGroup(tableField, columnKey, groupKey) {
            for (const tableGroup of this.tableFields) {
                if (tableGroup.group === tableField.group) {
                    tableGroup.columns.push(tableField);
                    this.tableFields[groupKey].columns.splice(columnKey, 1);
                }
            }
        }

        /**
         * Превратить погрупповой массив в простой
         * @param tableGroups
         */
        private plainizeFields(tableGroups: TableGroup[]) {
            const plainizedColumns = [];
            for (const tableGroup of tableGroups) {
                for (const column of tableGroup.columns) {
                    plainizedColumns.push(column);
                }
            }
            return plainizedColumns;
        }

        private createTable() {
            // @ts-ignore
            this.$validator.validateAll().then((validationSuccessed) => {
                if (validationSuccessed) {
                    const plainizedFields = this.plainizeFields(this.tableFields);

                    axios.post(`${baseUrlAPI}constructor/constructor_create`, {
                        table_title: this.$route.params.id,
                        columns: plainizedFields,
                    }).then(() => {
                        this.constructorState.isTableExists = true;
                        this.getTableInfo();
                        SuccessNotifier.notify('Таблица создана', `Таблица для данного слоя создана`);
                    }).catch(() => {
                        ErrorNotifier.notify();
                    });
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
                    const plainizedFields = this.plainizeFields(this.tableFields);

                    axios.post(`${baseUrlAPI}constructor/constructor_update`, {
                        table_title: this.$route.params.id,
                        columns: plainizedFields,
                    }).then(() => {
                        this.getTableInfo();
                        SuccessNotifier.notify('Таблица создана', `Таблица для данного слоя обновлена`);
                    }).catch(() => {
                        ErrorNotifier.notify();
                    });
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

        private async dropColumn(tableField: TableField, key: number, groupKey: string) {
            if (tableField.id) {
                try {
                    const res = await axios.post(`${baseUrlAPI}constructor/drop_column`, {
                        column_tech_title: tableField.tech_title,
                        table_id: this.$route.params.id,
                    });

                    this.getTableInfo();
                } catch {
                    ErrorNotifier.notify();
                }
            } else {
                this.tableFields[groupKey].columns.splice(key, 1);
            }
        }
    }
</script>
<style>
    .constructor-table-fields {
        margin-bottom: 10px;
    }
</style>
