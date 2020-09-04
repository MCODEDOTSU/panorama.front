<template>
    <div class="manager-container content">

        <h1>Справочник физических лиц</h1>

        <b-button v-b-modal.singlePersonModal @click="administratorPersonUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <!-- Список физических лиц -->
        <vue-table-dynamic :params="persons" ref="personsTable">
            <template v-slot:column-7="{ props }">
                <b-button v-b-modal.singlePersonModal @click="personSetSingle(props.cellData)" variant="info">
                    Изменить
                </b-button>
                <button class="btn btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    Удалить
                </button>
            </template>
        </vue-table-dynamic>
        <!-- конец Список физических лиц -->

        <single-person></single-person>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Watch, Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import PersonState from '@/store/modules/administrator/person/types';
    import SinglePerson from '@/views/administrator/persons/SinglePerson.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SinglePerson, SureModal },
    })
    export default class Persons extends Vue {

        @Action public administratorPersonGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorPersonDelete: any;
        @Action public administratorPersonSetSingle: any;
        @Action public administratorPersonUnsetSingle: any;

        @State('administratorPerson') public personState: PersonState;

        @Provide() public persons = {
            data: [ ],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6],
        };

        @Watch('personState.persons', {deep: true})
        public onPersons() {
            this.persons.data = [ ['Фамилия', 'Имя', 'Отчество', 'Дата Рождения', 'Адрес', 'Телефоны', 'Заметка', ''] ];
            this.personState.persons.forEach((item) => {
                this.persons.data.push([
                    item.lastname, item.firstname, item.middlename, item.date_of_birth,
                    `${item.address.city} ${item.address.street} ${item.address.build}`,
                    item.phones, item.note, item.id.toString(),
                ]);
            });
        }

        public async created() {
            await this.administratorPersonGetAll();
        }

        /**
         * Выбрать физическое лицо для изменения
         * @param personId
         */
        public personSetSingle(personId: any) {
            const person = arrayFindFirst(this.personState.persons, parseInt(personId, 10));
            this.administratorPersonSetSingle(person);
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param personId
         */
        public setSureModalContent(personId: any) {
            const person = arrayFindFirst(this.personState.persons, parseInt(personId, 10));
            this.setSureModal({
                title: 'Удалить физическое лицо?',
                text: `Вы уверены, что хотите удалить физическое лицо "${person.lastname} ${person.firstname}" из системы?`,
                action: async () => {
                    this.administratorPersonSetSingle(person);
                    await this.administratorPersonDelete();
                    this.administratorPersonUnsetSingle();
                },
            });
        }

        public excelExport() {

            const personsTable: HTMLElement = this.$refs.personsTable as HTMLElement;

            if(!personsTable || !personsTable.tableData || !personsTable.tableData.activatedRows) {
                return;
            }

            let data = personsTable.tableData.activatedRows.map((row) => {
                return row.cells.map((cell, index) => {
                    return (index + 1) < row.cells.length ? cell.data : false
                });
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

    }
</script>