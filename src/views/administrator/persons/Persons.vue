<template>
    <div class="manager-container content">

        <h1>Справочник физических лиц</h1>

        <button @click="createPerson" class="btn btn-success">
            <i class="fa fa-user-plus"></i>
            Добавить
        </button>

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
            <label class="title info">
                Всего записей: <b>{{ persons.length }}</b>
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
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Имя"
                               v-model="filter.firstname">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                               class="form-control"
                               placeholder="Отчество"
                               v-model="filter.middlename">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Дата рождения"
                                v-model="filter.date_of_birth">
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <select class="form-control" v-model="filter.tos">
                                <option value="">Все</option>
                                <option :value="tos" v-for="(tos, i) in contractorTosState.contractorsTos">
                                    {{ tos.full_contractor.name }}
                                </option>
                            </select>
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
        <div class="table-scroll persons" v-bind:class="{full: !filterShow}">
            <vue-table-dynamic
                :params="params"
                v-on:cell-click="onClickCell"
                v-on:cell-dblclick="onDblclickCell"
                ref="personsTable"
            >
                <!-- Фамилия и статус -->
                <template class="actions" v-slot:column-0="{ props }">
                    <span v-html="props.cellData"></span>
                </template>

                <!-- Actions -->
                <template class="actions" v-slot:column-9="{ props }">
                    <button class="btn btn-default" @click="editPerson(props.cellData)">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                        <i class="fa fa-trash"></i>
                    </button>
                </template>

            </vue-table-dynamic>
        </div>

        <!-- конец Список физических лиц -->

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
    import ContractorTosState from '@/store/modules/administrator/contractorTos/types';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SureModal},
    })
    export default class Persons extends Vue {

        @Action public administratorPersonGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorPersonDelete: any;
        @Action public administratorPersonSetSingle: any;
        @Action public administratorPersonUnsetSingle: any;
        @Action public administratorContractorTosGetAll: any;

        @State('administratorPerson') public personState: PersonState;
        @State('administratorContractorTos') public contractorTosState: ContractorTosState;

        @Provide() public params = {
            data: [],
            header: 'row',
            sort: [0, 1, 2, 3, 4, 5, 6, 7],
            columnWidth: [
                {column: 3, width: 100},
                {column: 8, width: 64},
                {column: 9, width: 64},
            ],
            selectedRow: 0,
        };
        @Provide() public tableIdIndex = 9;
        @Provide() public selectedRow = 0;
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
            tos: '',
        };
        @Provide() public filterShow: boolean = true;

        @Watch('filter', {deep: true})
        public onFilterChange() {
            this.personFilter();
            localStorage.setItem('persons.filter', JSON.stringify(this.filter));
        }

        @Watch('persons', {deep: true})
        public onPersons() {
            this.initTable();
        }

        @Watch('selectedRow')
        public onSelectedRow() {
            const params = { ...this.params };
            params.selectedRow = this.selectedRow;
            this.params = { ...params };
        }

        /**
         * Создание компонента
         */
        public async created() {
            if (this.personState.persons.length === 0) {
                await this.administratorPersonGetAll();
            }
            // Состояние фильтра
            this.filterState();
            // Инициализация списка
            this.personFilter();
            // Инициализация
            this.initTable();
            // Список ТОС для фильтра
            this.administratorContractorTosGetAll();
        }

        /**
         * Инициализация таблицы
         */
        public initTable() {
            // Иниицализация таблицы
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
                '',
            ] ];
            this.persons.forEach((item, i) => {
                this.params.data.push([
                    item.lastname + (item.status === 'vip' ? ' <i class="fas fa-crown"></i>' : ''),
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

        /**
         * Фильтрация
         */
        public personFilter() {
            const filter = { ...this.filter };
            this.persons = this.personState.persons.filter((item) => {
                let hasAddressInTos = true;
                if (filter.tos !== '' && filter.tos.addresses && filter.tos.addresses.length !== 0) {
                    hasAddressInTos = item.address && (filter.tos.addresses.filter((address) => {
                        return address.fias_id === item.address.fias_id;
                    })).length !== 0;
                }
                return (filter.lastname === '' || item.lastname.toLowerCase().indexOf(filter.lastname.toLowerCase()) + 1)
                    && (filter.firstname === '' || item.firstname.toLowerCase().indexOf(filter.firstname.toLowerCase()) + 1)
                    && (filter.middlename === '' || item.middlename.toLowerCase().indexOf(filter.middlename.toLowerCase()) + 1)
                    && (filter.date_of_birth === '' || item.date_of_birth.toLowerCase().indexOf(filter.date_of_birth.toLowerCase()) + 1)
                    && (filter.region === '' || this.resolvedRegion(item.address).toLowerCase().indexOf(filter.region.toLowerCase()) + 1)
                    && (filter.area === '' || this.resolvedArea(item.address).toLowerCase().indexOf(filter.area.toLowerCase()) + 1)
                    && (filter.city === '' || this.resolvedCity(item.address).toLowerCase().indexOf(filter.city.toLowerCase()) + 1)
                    && (filter.street === '' || this.resolvedStreet(item.address).toLowerCase().indexOf(filter.street.toLowerCase()) + 1)
                    && (filter.build === '' || this.resolvedBuild(item.address).toLowerCase().indexOf(filter.build.toLowerCase()) + 1)
                    && (filter.phone === '' || item.phones.toLowerCase().indexOf(filter.phone.toLowerCase()) + 1)
                    && hasAddressInTos;
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
                tos: '',
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
         * Создать
         */
        public createPerson() {
            this.administratorPersonUnsetSingle();
            this.$router.push('/administrator/person/0');
        }

        /**
         * Изменить
         * @param personId
         */
        public editPerson(personId: any) {
            this.$router.push(`/administrator/person/${personId}`);
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
                        'Квартира',
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
                    this.resolvedFlat(item.address),
                    this.resolvedPhones(item.phones),
                ];
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

        /**
         * Двойной клик по ячейке
         */
        public onDblclickCell(rowIndex, columnIndex, data) {
            if (columnIndex === this.tableIdIndex) {
                return;
            }
            const personsTable: HTMLElement = this.$refs.personsTable as HTMLElement;
            if (!personsTable) {
                return;
            }
            // @ts-ignore
            const id = personsTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.editPerson(id);
        }

        /**
         * Клик по ячейке
         */
        public onClickCell(rowIndex, columnIndex, data) {
            if (this.selectedRow === rowIndex) {
                this.onDblclickCell(rowIndex, columnIndex, data);
            }
            this.selectedRow = rowIndex;
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
         * Обработка улицы
         * @param address
         */
        public resolvedStreet(address) {
            return address !== null && address.street !== null ?
                (`${address.street} ${address.street_type}`) : '';
        }

        /**
         * Обработка дома
         * @param address
         */
        public resolvedBuild(address) {
            return address !== null && address.house !== null ?
                (`${address.house}`) : '';
        }

        /**
         * Обработка квартиры
         * @param address
         */
        public resolvedFlat(address) {
            return address !== null && address.flat !== null ?
                (`${address.flat}`) : '';
        }

    }
</script>