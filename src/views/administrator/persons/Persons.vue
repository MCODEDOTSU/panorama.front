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

        <!--
        <vuetable
                ref="vuetable"
                :api-mode="false"
                :fields="fields"
                :data="resolvedPersons"
                :sort-order="[{field:'lastname',direction:'asc'}]"
                @vuetable:loaded="onLoaded"
        >
        </vuetable>
        -->

        <!-- Список физических лиц -->
        <vue-table-dynamic :params="persons" v-on:cell-click="showSinglePersonModal" ref="personsTable">

            <!-- Actions -->
            <template v-slot:column-9="{ props }">
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
    import Vuetable from 'vuetable-2';

    @Component({
        components: {SinglePerson, SureModal, Vuetable },
    })
    export default class Persons extends Vue {

        @Action public administratorPersonGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorPersonDelete: any;
        @Action public administratorPersonSetSingle: any;
        @Action public administratorPersonUnsetSingle: any;

        @State('administratorPerson') public personState: PersonState;

        @Provide() private fields = [
            {
                name: 'lastname',
                title: 'Фамилия',
                sortField: 'lastname',
            },
            {
                name: 'firstname',
                title: 'Имя',
            },
            {
                name: 'middlename',
                title: 'Отчество',
            },
            {
                name: 'date_of_birth',
                title: 'Дата рождения',
            },
            {
                name: 'region',
                title: 'Регион',
            },
            {
                name: 'area',
                title: 'Район',
            },
            {
                name: 'city',
                title: 'Город/село',
            },
            {
                name: 'house',
                title: 'Улица, дом',
            },
            {
                name: 'phone',
                title: 'Телефоны',
            },
        ];

        @Provide() public persons = {
            data: [],
            header: 'row',
            stripe: true,
            enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            pagination: true,
            pageSize: 50,
            pageSizes: [],
        };
        @Provide() private tableIdIndex = 9;

        @Watch('personState.persons', {deep: true})
        public onPersons() {
            this.persons.data = [ [
                'Фамилия',
                'Имя',
                'Отчество',
                'Дата Рождения',
                'Регион',
                'Район',
                'Город/село',
                'Улица, дом',
                'Телефоны',
                ''
            ] ];
            this.personState.persons.forEach((item, i) => {
                this.persons.data.push([
                    item.lastname,
                    item.firstname,
                    item.middlename,
                    this.resolvedDate(item.date_of_birth),
                    this.resolvedRegion(item.address),
                    this.resolvedArea(item.address),
                    this.resolvedCity(item.address),
                    this.resolvedStreetHouse(item.address),
                    this.resolvedPhones(item.phones),
                    item.id.toString(),
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
         * Окно изменения физического лица
         */
        public showSinglePersonModal(rowIndex, columnIndex, data) {

            if (columnIndex === this.tableIdIndex) {
                return;
            }

            const personsTable: HTMLElement = this.$refs.personsTable as HTMLElement;
            if (!personsTable) {
                return;
            }

            // @ts-ignore
            const id = personsTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.personSetSingle(id);
            // @ts-ignore
            this.$bvModal.show('singlePersonModal');
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

        /**
         * Export to EXCEL
         */
        public excelExport() {

            const personsTable: HTMLElement = this.$refs.personsTable as HTMLElement;
            if (!personsTable) {
                return;
            }

            // @ts-ignore
            const td = personsTable.tableData;

            if (!td || !td.activatedRows) {
                return;
            }

            // @ts-ignore
            const data = td.activatedRows.map((row, i) => {
                const firstCell = i === 0 ? '№ п/п' : i;
                return [ firstCell ].concat(row.cells.map((cell, j) => {
                    return (j + 1) < row.cells.length ? cell.data : false;
                }));
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

        /**
         * Обработка данных
         */
        private get resolvedPersons() {
            return this.personState.persons.map((person) => {
                return {
                    lastname: person.lastname,
                    firstname: person.firstname,
                    middlename: person.middlename,
                    date_of_birth: this.resolvedDate(person.date_of_birth),
                    region: this.resolvedRegion(person.address),
                    area: this.resolvedArea(person.address),
                    city: this.resolvedCity(person.address),
                    house: this.resolvedStreetHouse(person.address),
                    phone: this.resolvedPhones(person.phones),
                    id: person.id,
                };
            });
        }

        /**
         * Обработка даты
         * @param date
         */
        public resolvedDate(date) {
            date = new Date(date);
            const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
            return `${day}.${month}.${date.getFullYear()}`;
        }

        /**
         * Обработка телефона
         * @param phones
         */
        public resolvedPhones(phones) {
            if (phones === null || phones === '') {
                return '';
            }
            phones = JSON.parse(phones);
            if (typeof phones !== 'object') {
                phones = [ { type: 'Мобильный', value: phones } ];
            }
            return phones.length > 0 ? phones[0].value : '-';
        }

        /**
         * Обработка региона
         * @param region
         */
        public resolvedRegion(address) {
            return address !== null && address.region !== null ?
                (`${address.region} ${address.region_type}`) : '';
        }

        /**
         * Обработка района
         * @param address
         */
        public resolvedArea(address) {
            return address !== null && address.area !== null ?
                (`${address.area} ${address.area_type}`) : '';
        }

        /**
         * Обработка города
         * @param address
         */
        public resolvedCity(address) {
            return address !== null && address.city !== null ?
                (`${address.city} ${address.city_type}`) : (address !== null && address.settlement !== null ?
                    (`${address.settlement} ${address.settlement_type}`) : '');
        }

        /**
         * Обработка улицы и дома
         * @param address
         */
        public resolvedStreetHouse(address) {
            const house = address !== null && address.house !== null ?
                (`, ${address.house} ${address.house_type}`) : '';
            return address !== null && address.street !== null ?
                (`${address.street} ${address.street_type}${house}`) : '-';
        }

    }
</script>