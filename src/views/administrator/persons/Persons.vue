<template>
    <div class="manager-container content">

        <h1>Справочник физических лиц</h1>

        <b-button v-b-modal.singlePersonModal @click="administratorPersonUnsetSingle" variant="success">
            <i class="fa fa-user-plus"></i>
            Добавить
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <!-- Фильтр -->
        <div class="table-dynamic-filter">
            <label class="title">Расширенный поиск:
                <button v-if="filterShow" class="btn btn-link" @click="toggleFilterShow()">[свернуть]</button>
                <button v-else class="btn btn-link" @click="toggleFilterShow()">[развернуть]</button>
            </label>
            <div v-show="filterShow">
                <div class="row">
                    <div class="col-3">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Фамилия"
                               v-model="filter.lastname">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Имя"
                               v-model="filter.firstname">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Отчество"
                               v-model="filter.middlename">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Дата рождения"
                               v-model="filter.date_of_birth">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Регион"
                                v-model="filter.region">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Район"
                                v-model="filter.area">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Город, село"
                                v-model="filter.city">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Улица"
                                v-model="filter.street">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Дом"
                                v-model="filter.build">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Телефон"
                                v-model="filter.phone">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 actions">
                        <button class="btn btn-link" @click="cleanFilter()">
                            Сбросить фильтр
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- конец Фильтр -->

        <!-- Список физических лиц -->
        <vue-table-dynamic
                :params="params"
                v-on:cell-click="onClickRow"
                v-on:cell-dblclick="showSinglePersonModal"
                ref="personsTable"
        >

            <!-- Actions -->
            <template class="actions" v-slot:column-9="{ props }">
                <b-button v-b-modal.singlePersonModal @click="personSetSingle(props.cellData)" variant="info">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <button class="btn btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    <i class="fa fa-trash"></i>
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

        @Provide() public params = {
            data: [],
            header: 'row',
            sort: [0, 1, 2, 3, 4, 5, 6, 7],
            pagination: true,
            pageSize: 50,
            pageSizes: [],
            columnWidth: [
                {column: 9, width: 64}
            ],
        };
        @Provide() private tableIdIndex = 9;
        @Provide() private selectedRow = 0;

        @Provide() public persons = [];

        @Provide() public filter = {
            lastname: '',
            firstname: '',
            middlename: '',
            date_of_birth: '',
            region: '',
            area: '',
            city: '',
            street: '',
            build: '',
            phone: '',
        };
        @Provide() public filterShow: boolean = true;

        @Watch('personState.persons', {deep: true})
        public onPersonState() {
            this.personFilter();
        }

        @Watch('filter', {deep: true})
        public onPersonState() {
            this.personFilter();
            localStorage.setItem('persons.filter', JSON.stringify(this.filter));
        }

        @Watch('persons', {deep: true})
        public onPersons() {
            this.params.data = [ [
                'Фамилия',
                'Имя',
                'Отчество',
                'Дата Рождения',
                'Регион',
                'Район',
                'Город/село',
                'Улица',
                'Дом',
                ''
            ] ];
            this.persons.forEach((item, i) => {
                this.params.data.push([
                    item.lastname,
                    item.firstname,
                    item.middlename,
                    this.resolvedDate(item.date_of_birth),
                    this.resolvedRegion(item.address),
                    this.resolvedArea(item.address),
                    this.resolvedCity(item.address),
                    this.resolvedStreet(item.address),
                    this.resolvedBuild(item.address),
                    item.id.toString(),
                ]);
            });
        }

        @Watch('selectedRow')
        public onSelectedRow() {
            const params = { ...this.params };
            params.selectedRow = this.selectedRow;
            this.params = { ...params };
        }

        public async created() {
            this.administratorPersonGetAll();
            // Состояние фильтра
            this.filterState();
        }

        /**
         * Фильтрация
         */
        public personFilter() {
            this.persons = this.personState.persons.filter((item) => {
                return (this.filter.lastname === '' || item.lastname.toLowerCase().indexOf(this.filter.lastname.toLowerCase()) + 1)
                    && (this.filter.firstname === '' || item.firstname.toLowerCase().indexOf(this.filter.firstname.toLowerCase()) + 1)
                    && (this.filter.middlename === '' || item.middlename.toLowerCase().indexOf(this.filter.middlename.toLowerCase()) + 1)
                    && (this.filter.date_of_birth === '' || item.date_of_birth.toLowerCase().indexOf(this.filter.date_of_birth.toLowerCase()) + 1)
                    && (this.filter.region === '' || this.resolvedRegion(item.address).toLowerCase().indexOf(this.filter.region.toLowerCase()) + 1)
                    && (this.filter.area === '' || this.resolvedArea(item.address).toLowerCase().indexOf(this.filter.area.toLowerCase()) + 1)
                    && (this.filter.city === '' || this.resolvedCity(item.address).toLowerCase().indexOf(this.filter.city.toLowerCase()) + 1)
                    && (this.filter.street === '' || this.resolvedStreet(item.address).toLowerCase().indexOf(this.filter.street.toLowerCase()) + 1)
                    && (this.filter.build === '' || this.resolvedBuild(item.address).toLowerCase().indexOf(this.filter.build.toLowerCase()) + 1)
                    && (this.filter.phone === '' || item.phones.toLowerCase().indexOf(this.filter.phone.toLowerCase()) + 1);
            });
        }

        /**
         * Сбросить фильтр
         */
        public cleanFilter() {
            this.filter = {
                lastname: '',
                firstname: '',
                middlename: '',
                date_of_birth: '',
                region: '',
                area: '',
                city: '',
                street: '',
                build: '',
                phone: '',
            };
        }

        /**
         * Свернуть/развернуть фильтр
         */
        public toggleFilterShow() {
            this.filterShow = !this.filterShow;
            localStorage.setItem('persons.filterShow', this.filterShow.toString());
        }

        /**
         * Получить состоние фильтра
         */
        public filterState() {
            if (localStorage.getItem('persons.filterShow')) {
                this.filterShow = localStorage.getItem('persons.filterShow') === 'true';
            }
            if (localStorage.getItem('persons.filter')) {
                this.filter = Object.assign(this.filter, JSON.parse(localStorage.getItem('persons.filter')));
            }
        }

        /**
         * Обработка клика по таблице
         */
        public onClickRow(rowIndex, columnIndex, data) {
            if (this.selectedRow === rowIndex) {
                this.showSinglePersonModal(rowIndex, columnIndex, data);
            }
            this.selectedRow = rowIndex;
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

                if (i === 0) {
                    return [
                        '№ п/п',
                        'Фамилия',
                        'Имя',
                        'Отчество',
                        'Дата Рождения',
                        'Регион',
                        'Район',
                        'Город/село',
                        'Улица',
                        'Дом',
                        'Телефон',
                    ];
                }

                const item = arrayFindFirst(this.personState.persons, parseInt(row.cells[this.tableIdIndex].data, 10));
                return [
                    i,
                    item.lastname,
                    item.firstname,
                    item.middlename,
                    this.resolvedDate(item.date_of_birth),
                    this.resolvedRegion(item.address),
                    this.resolvedArea(item.address),
                    this.resolvedCity(item.address),
                    this.resolvedStreet(item.address),
                    this.resolvedBuild(item.address),
                    this.resolvedPhones(item.phones),
                ];
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
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
        public resolvedStreet(address) {
            return address !== null && address.street !== null ?
                (`${address.street} ${address.street_type}`) : '';
        }

        /**
         * Обработка улицы и дома
         * @param address
         */
        public resolvedBuild(address) {
            return address !== null && address.house !== null ?
                (`${address.house} ${address.house_type}`) : '';
        }

    }
</script>