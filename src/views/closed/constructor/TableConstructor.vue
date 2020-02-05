<template>
    <div class="table-constructor">
        <div class="alert alert-info" v-if="!constructorState.tableFields.length">
            Для данного слоя дополнительные поля формы не заданы.
            Для чтого, что бы создать дополнительные поля в конструкторе формы,
            необходимо создать группу полей, нажав на кнопку "Добавить группу"
        </div>
        <div class="alert alert-info" v-else>
            Для добавления нового поля в группу нажмите "Добавить поле". Укажите тип поля, наименование и техническое наименование поля
        </div>
        <div v-for="(tableGroup, groupKey) in constructorState.tableFields">
            <div class="row align-items-center group-header">
                <div class="col-2">
                    Группа:
                </div>
                <div class="col-7">
                    <input type="text" class="form-control" placeholder="Группа" v-model="tableGroup.group">
                </div>
                <div class="col-3 action">
                    <button type="button" class="btn btn-primary" @click="addField(groupKey, tableGroup.group)">Добавить
                        поле
                    </button>
                </div>
            </div>
            <div>
                <div class="row no-gutters align-items-center constructor-table-fields-header">
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
                    <div class="col-2">
                        <p>Обязательное?</p>
                    </div>
                </div>
                <div class="row constructor-table-fields" v-bind:class="{deleted: tableField.is_deleted}"
                     v-for="(tableField, key) in tableGroup.columns">
                    <div class="col-2 col col-group">
                        <select class="form-control" v-model="tableField.group"
                                @change="changeGroup(tableField, key, groupKey)">
                            <option v-for="tableGroup in constructorState.tableFields" :value="tableGroup.group">{{
                                tableGroup.group }}
                            </option>
                        </select>
                    </div>
                    <div class="col-2 col col-type">
                        <select class="form-control" v-model="tableField.type" :disabled="tableField.id">
                            <option value="text_field">Текстовое поле</option>
                            <option value="long_text_field">Длинное текстовое поле</option>
                            <option value="number_field">Числовое поле</option>
                            <option value="date_field">Дата</option>
                            <option value="one_from_many_field">Один из многих</option>
                            <option value="many_from_many_field">Многие из многих</option>
                            <option value="doc_field">Загрузка документа</option>
                        </select>
                    </div>
                    <div class="col-3 col col-title">
                        <input type="text" :name="'наименование группы ' + tableGroup.group + ' под номером ' + key"
                               data-vv-validate-on="change|blur" class="form-control" v-validate="'required'"
                               placeholder="Наименование поля" v-model="tableField.title">
                        <span class="validation-error">{{ errors.first('наименование группы ' + tableGroup.group + ' под номером ' + key) }}</span>
                    </div>
                    <div class="col-3 col col-tech">
                        <input type="text" class="form-control" v-model="tableField.tech_title"
                               data-vv-validate-on="change|blur" v-validate="'required'"
                               :name="'тех_наименование группы' + tableGroup.group + ' под номером ' + key"
                               placeholder="техническое наименование поля">
                        <span class="validation-error">{{ errors.first('тех_наименование группы' + tableGroup.group + ' под номером ' + key) }}</span>
                    </div>
                    <div class="col-2 col col-required col-action">
                        <div class="input-container">
                            <select class="form-control" v-model="tableField.required">
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </select>
                        </div>
                        <div class="btn-container">
                            <button type="button" class="btn btn-warning btn-link" v-if="tableField.is_deleted === true"
                                    @click="undoColumn(tableField, key, groupKey)"><i class="fas fa-trash-restore"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-link" v-else
                                    @click="dropColumn(tableField, key, groupKey)"><i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-12 col col-enums" v-if="tableField.type === 'one_from_many_field' || tableField.type === 'many_from_many_field'">
                        <div class="row no-gutters">
                            <div class="col-4 col">
                                <div class="alert alert-info">Перечислите значения, разделяя их пробелом</div>
                            </div>
                            <div class="col-8 col">
                                <tag-selector  v-model="tableField.enums" name="enums"/>
                            </div>
                        </div>
                    </div>
                </div>

                <hr>
            </div>
        </div>
        <div class="action">
            <button type="button" class="btn btn-primary btn-link" @click="addGroup"><i class="fas fa-plus-circle"></i>Добавить группу</button>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';
    import ConstructorState from '@/store/modules/constructor/types';
    import {Action, State} from 'vuex-class';
    import TagSelector from 'vue-tag-selector';

    @Component({
        components: { TagSelector },
    })
    export default class TableConstructor extends Vue {

        @Action public getConstructorByLayer: any;

        @State('konstructor') private constructorState: ConstructorState;

        /***
         * Добавить группу
         */
        private addGroup() {
            this.constructorState.tableFields.push({
                group: 'Новая группа',
                columns: [{
                    type: 'text_field',
                    title: '',
                    tech_title: 'name1',
                    required: false,
                    enums: undefined,
                    group: 'Новая группа',
                    is_deleted: false,
                }],
            });
        }

        /***
         * Изменить группу
         * @param tableField
         * @param columnKey
         * @param groupKey
         */
        private changeGroup(tableField, columnKey, groupKey) {
            for (const tableGroup of this.constructorState.tableFields) {
                if (tableGroup.group === tableField.group) {
                    tableGroup.columns.push(tableField);
                    this.constructorState.tableFields[groupKey].columns.splice(columnKey, 1);
                }
            }
        }

        /***
         * Добавить поле
         */
        private addField(groupKey: string, groupName: string) {
            this.constructorState.tableFields[groupKey].columns.push({
                type: 'text_field',
                title: '',
                tech_title: 'name1',
                required: false,
                enums: undefined,
                group: groupName,
                is_deleted: false,
            });
        }

        /***
         * Удалить поле
         * @param tableField
         * @param key
         * @param groupKey
         */
        private async dropColumn(tableField: TableField, key: number, groupKey: string) {
            const group = Object.assign({}, this.constructorState.tableFields[groupKey]);
            group.columns[key].is_deleted = true;
            this.constructorState.tableFields[groupKey] = Object.assign({}, group);
        }

        /***
         * Восстановить поле
         * @param tableField
         * @param key
         * @param groupKey
         */
        private async undoColumn(tableField: TableField, key: number, groupKey: string) {
            const group = Object.assign({}, this.constructorState.tableFields[groupKey]);
            group.columns[key].is_deleted = false;
            this.constructorState.tableFields[groupKey] = Object.assign({}, group);
        }

    }
</script>
