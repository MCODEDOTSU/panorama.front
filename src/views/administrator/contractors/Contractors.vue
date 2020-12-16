<template>
    <div class="manager-container content">

        <h1>Справочник контрагентов</h1>

        <button @click="createContractor" class="btn btn-success">
            <i class="fa fa-plus-circle"></i>
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
                Всего записей: <b>{{ contractors.length }}</b>
            </label>
            <div v-show="filterShow">
                <div class="row">
                    <div class="col-4">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Наименование"
                                v-model="filter.name">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="ИНН"
                                v-model="filter.inn">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="КПП"
                                v-model="filter.kpp">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        <div class="form-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Регион"
                                v-model="filter.region">
                        </div>
                    </div>
                    <div class="col-3">
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

        <!-- Список -->
        <div class="table-scroll contarcotrs" v-bind:class="{full: !filterShow}">
            <vue-table-dynamic
                :params="params"
                v-on:cell-click="onClickCell"
                v-on:cell-dblclick="onDblclickCell"
                ref="contractorsTable"
            >
                <template class="actions" v-slot:column-8="{ props }">
                    <button class="btn btn-default" @click="editContractor(props.cellData)">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                        <i class="fa fa-trash"></i>
                    </button>
                    <button class="btn btn-default" @click="getContractorUsers(props.cellData)">
                        <i class="fa fa-users"></i>
                    </button>
                </template>
            </vue-table-dynamic>
        </div>
        <!-- конец Список -->

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Provide, Watch, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import ContractorState from '@/store/modules/administrator/contractor/types';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { SureModal },
    })
    export default class Contractors extends Vue {

        @Action public administratorContractorGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorDelete: any;
        @Action public administratorContractorSetSingle: any;
        @Action public administratorContractorUnsetSingle: any;

        @State('administratorContractor') public contractorState: ContractorState;

        @Provide() public params = {
            data: [],
            header: 'row',
            sort: [0, 1, 2, 3, 4, 5, 6, 7],
            columnWidth: [
                {column: 0, width: 300},
                {column: 8, width: 96},
            ],
            selectedRow: 0,
        };
        @Provide() public tableIdIndex = 8;
        @Provide() public selectedRow = 0;
        @Provide() public contractors = [];
        @Provide() public filter = {
            name: '',
            inn: '',
            kpp: '',
            region: '',
            area: '',
            city: '',
            street: '',
            build: '',
        };
        @Provide() public filterShow: boolean = true;

        @Watch('filter', {deep: true})
        public onFilterChange() {
            this.contractorFilter();
            localStorage.setItem('contractors.filter', JSON.stringify(this.filter));
        }

        @Watch('contractors', {deep: true})
        public onContractors() {
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
            if (this.contractorState.contractors.length === 0) {
                await this.administratorContractorGetAll();
            }
            // Состояние фильтра
            this.filterState();
            // Инициализация списка
            this.contractorFilter();
            // Инициализация
            this.initTable();
        }

        /**
         * Инициализация таблицы
         */
        public initTable() {
            // Иниицализация таблицы
            this.params.data = [ [
                'Наименование',
                'ИНН',
                'КПП',
                'Регион',
                'Район',
                'Город/село',
                'Улица',
                'Дом',
                '',
            ] ];
            this.contractors.forEach((item, i) => {
                this.params.data.push([
                    item.name,
                    item.inn,
                    item.kpp,
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
        public contractorFilter() {
            this.contractors = this.contractorState.contractors.filter((item) => {
                return (this.filter.name === '' || item.name.toLowerCase().indexOf(this.filter.name.toLowerCase()) + 1 || item.full_name.toLowerCase().indexOf(this.filter.name.toLowerCase()) + 1)
                    && (this.filter.inn === '' || item.inn.toLowerCase().indexOf(this.filter.inn.toLowerCase()) + 1)
                    && (this.filter.kpp === '' || item.kpp.toLowerCase().indexOf(this.filter.kpp.toLowerCase()) + 1)
                    && (this.filter.region === '' || this.resolvedRegion(item.address).toLowerCase().indexOf(this.filter.region.toLowerCase()) + 1)
                    && (this.filter.area === '' || this.resolvedArea(item.address).toLowerCase().indexOf(this.filter.area.toLowerCase()) + 1)
                    && (this.filter.city === '' || this.resolvedCity(item.address).toLowerCase().indexOf(this.filter.city.toLowerCase()) + 1)
                    && (this.filter.street === '' || this.resolvedStreet(item.address).toLowerCase().indexOf(this.filter.street.toLowerCase()) + 1)
                    && (this.filter.build === '' || this.resolvedBuild(item.address).toLowerCase().indexOf(this.filter.build.toLowerCase()) + 1);
            });
        }

        /**
         * Сбросить фильтр
         */
        public cleanFilter() {
            this.filter = {
                name: '',
                inn: '',
                kpp: '',
                region: '',
                area: '',
                city: '',
                street: '',
                build: '',
            };
        }

        /**
         * Свернуть/развернуть фильтр
         */
        public toggleFilterShow() {
            this.filterShow = !this.filterShow;
            localStorage.setItem('contractors.filterShow', this.filterShow.toString());
        }

        /**
         * Получить состоние фильтра
         */
        public filterState() {
            if (localStorage.getItem('contractors.filterShow')) {
                this.filterShow = localStorage.getItem('contractors.filterShow') === 'true';
            }
            if (localStorage.getItem('contractors.filter')) {
                this.filter = Object.assign(this.filter, JSON.parse(localStorage.getItem('contractors.filter')));
            }
        }

        /**
         * Создать
         */
        public createContractor() {
            this.administratorContractorUnsetSingle();
            this.$router.push('/administrator/contractor/0');
        }

        /**
         * Изменить
         * @param contractorId
         */
        public editContractor(contractorId: any) {
            this.$router.push(`/administrator/contractor/${contractorId}`);
        }

        /**
         * Выбрать контрагента
         * @param contractorId
         */
        public contractorSetSingle(contractorId: any) {
            const contractor = arrayFindFirst(this.contractorState.contractors, parseInt(contractorId, 10));
            this.administratorContractorSetSingle(contractor);
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param contractorId
         */
        public setSureModalContent(contractorId: any) {
            const contractor = arrayFindFirst(this.contractorState.contractors, parseInt(contractorId, 10));
            this.setSureModal({
                title: 'Удалить контрагента?',
                text: `Вы уверены, что хотите удалить контрагента "${contractor.name}" из системы?`,
                action: async () => {
                    this.administratorContractorSetSingle(contractor);
                    await this.administratorContractorDelete();
                    this.administratorContractorUnsetSingle();
                },
            });
        }

        /**
         * Экспорт таблицы в EXCEL
         */
        public excelExport() {

            const contractorsTable: HTMLElement = this.$refs.contractorsTable as HTMLElement;
            if (!contractorsTable) {
                return;
            }

            // @ts-ignore
            const td = contractorsTable.tableData;

            if (!td || !td.activatedRows) {
                return;
            }

            // @ts-ignore
            const data = td.activatedRows.map((row, i) => {

                if (i === 0) {
                    return [
                        '№ п/п',
                        'Наименование',
                        'Полное наименование',
                        'ИНН',
                        'КПП',
                        'Регион',
                        'Район',
                        'Город/село',
                        'Улица',
                        'Дом',
                        'Офис',
                    ];
                }

                const item = arrayFindFirst(this.contractorState.contractors, parseInt(row.cells[this.tableIdIndex].data, 10));
                return [
                    i,
                    item.name,
                    item.full_name,
                    item.inn,
                    item.kpp,
                    this.resolvedRegion(item.address),
                    this.resolvedArea(item.address),
                    this.resolvedCity(item.address),
                    this.resolvedStreet(item.address),
                    this.resolvedBuild(item.address),
                    this.resolvedFlat(item.address),
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
            const contractorsTable: HTMLElement = this.$refs.contractorsTable as HTMLElement;
            if (!contractorsTable) {
                return;
            }
            // @ts-ignore
            const id = contractorsTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.editContractor(id);
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
         * Перейти на компонент редактирования пользователей контрагента
         * @param contractor
         */
        public getContractorUsers(contractorId: any) {
            this.contractorSetSingle(contractorId);
            this.$router.push(`/administrator/contractors/users/${contractorId}`);
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