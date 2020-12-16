<template>
    <div class="manager-container content">

        <h1>Справочник ТОС</h1>

        <button @click="createContractorTos" class="btn btn-success">
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
                Всего записей: <b>{{ contractorsTos.length }}</b>
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
        <div class="table-scroll contarcotrs-tos" v-bind:class="{full: !filterShow}">
            <vue-table-dynamic
                :params="params"
                v-on:cell-click="onClickCell"
                v-on:cell-dblclick="onDblclickCell"
                ref="contractorsTosTable"
            >
                <!-- Actions -->
                <template v-slot:column-8="{ props }">
                    <button class="btn btn-default" @click="editContractorTos(props.cellData)">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                        <i class="fa fa-trash"></i>
                    </button>
                </template>
            </vue-table-dynamic>
        </div>
        <!-- конец Список -->

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Watch, Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import ContractorTosState from '@/store/modules/administrator/contractorTos/types';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { SureModal },
    })
    export default class ContractorsTos extends Vue {

        @Action public administratorContractorTosGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorTosDelete: any;
        @Action public administratorContractorTosSetSingle: any;
        @Action public administratorContractorTosUnsetSingle: any;

        @State('administratorContractorTos') public contractorTosState: ContractorTosState;

        @Provide() public params = {
            data: [],
            header: 'row',
            sort: [0, 1, 2, 3, 4, 5, 6, 7],
            columnWidth: [
                {column: 0, width: 300},
                {column: 8, width: 64},
            ],
            selectedRow: 0,
        };
        @Provide() public tableIdIndex = 8;
        @Provide() public selectedRow = 0;
        @Provide() public contractorsTos = [];
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
            this.contractorsTosFilter();
            localStorage.setItem('contractors.tos.filter', JSON.stringify(this.filter));
        }

        @Watch('contractorsTos', {deep: true})
        public onContractorsTos() {
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
            if (this.contractorTosState.contractorsTos.length === 0) {
                await this.administratorContractorTosGetAll();
            }
            // Состояние фильтра
            this.filterState();
            // Инициализация списка
            this.contractorsTosFilter();
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
            console.log(this.contractorsTos);
            this.contractorsTos.forEach((item, i) => {
                this.params.data.push([
                    item.full_contractor.name,
                    item.full_contractor.inn,
                    item.full_contractor.kpp,
                    this.resolvedRegion(item.full_contractor.address),
                    this.resolvedArea(item.full_contractor.address),
                    this.resolvedCity(item.full_contractor.address),
                    this.resolvedStreet(item.full_contractor.address),
                    this.resolvedBuild(item.full_contractor.address),
                    item.id.toString(),
                ]);
            });
        }

        /**
         * Фильтрация
         */
        public contractorsTosFilter() {
            this.contractorsTos = this.contractorTosState.contractorsTos.filter((item) => {
                return (this.filter.name === '' || item.full_contractor.name.toLowerCase().indexOf(this.filter.name.toLowerCase()) + 1 || item.full_contractor.full_name.toLowerCase().indexOf(this.filter.name.toLowerCase()) + 1)
                    && (this.filter.inn === '' || item.full_contractor.inn.toLowerCase().indexOf(this.filter.inn.toLowerCase()) + 1)
                    && (this.filter.kpp === '' || item.full_contractor.kpp.toLowerCase().indexOf(this.filter.kpp.toLowerCase()) + 1)
                    && (this.filter.region === '' || this.resolvedRegion(item.full_contractor.address).toLowerCase().indexOf(this.filter.region.toLowerCase()) + 1)
                    && (this.filter.area === '' || this.resolvedArea(item.full_contractor.address).toLowerCase().indexOf(this.filter.area.toLowerCase()) + 1)
                    && (this.filter.city === '' || this.resolvedCity(item.full_contractor.address).toLowerCase().indexOf(this.filter.city.toLowerCase()) + 1)
                    && (this.filter.street === '' || this.resolvedStreet(item.full_contractor.address).toLowerCase().indexOf(this.filter.street.toLowerCase()) + 1)
                    && (this.filter.build === '' || this.resolvedBuild(item.full_contractor.address).toLowerCase().indexOf(this.filter.build.toLowerCase()) + 1);
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
            localStorage.setItem('contractors.tos.filterShow', this.filterShow.toString());
        }

        /**
         * Получить состоние фильтра
         */
        public filterState() {
            if (localStorage.getItem('contractors.tos.filterShow')) {
                this.filterShow = localStorage.getItem('contractors.tos.filterShow') === 'true';
            }
            if (localStorage.getItem('contractors.tos.filter')) {
                this.filter = Object.assign(this.filter, JSON.parse(localStorage.getItem('contractors.tos.filter')));
            }
        }

        /**
         * Создать
         */
        public createContractorTos() {
            this.administratorContractorTosUnsetSingle();
            this.$router.push('/administrator/tos/0');
        }

        /**
         * Изменить
         * @param contractorTosId
         */
        public editContractorTos(contractorTosId: any) {
            this.$router.push(`/administrator/tos/${contractorTosId}`);
        }

        /**
         * Выбрать контрагента
         * @param contractorTosId
         */
        public contractorTosSetSingle(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorsTos, parseInt(contractorTosId, 10));
            this.administratorContractorTosSetSingle(contractorTos);
        }

        /**
         * Открыть диалог удаления ТОС
         * @param contractorTosId
         */
        public setSureModalContent(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorsTos, parseInt(contractorTosId, 10));
            this.setSureModal({
                title: 'Удалить ТОС?',
                text: `Вы уверены, что хотите удалить ТОС "${contractorTos.constructor.name}" из системы?`,
                action: async () => {
                    this.administratorContractorTosSetSingle(contractorTos);
                    await this.administratorContractorTosDelete();
                    this.administratorContractorTosUnsetSingle();
                },
            });
        }

        /**
         * Экспорт таблицы в EXCEL
         */
        public excelExport() {

            const contractorsTosTable: HTMLElement = this.$refs.contractorsTosTable as HTMLElement;
            if (!contractorsTosTable) {
                return;
            }

            // @ts-ignore
            const td = contractorsTosTable.tableData;

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

                const item = arrayFindFirst(this.contractorTosState.contractorsTos, parseInt(row.cells[this.tableIdIndex].data, 10));
                return [
                    i,
                    item.full_contractor.name,
                    item.full_contractor.full_name,
                    item.full_contractor.inn,
                    item.full_contractor.kpp,
                    this.resolvedRegion(item.full_contractor.address),
                    this.resolvedArea(item.full_contractor.address),
                    this.resolvedCity(item.full_contractor.address),
                    this.resolvedStreet(item.full_contractor.address),
                    this.resolvedBuild(item.full_contractor.address),
                    this.resolvedFlat(item.full_contractor.address),
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
            const contractorsTosTable: HTMLElement = this.$refs.contractorsTosTable as HTMLElement;
            if (!contractorsTosTable) {
                return;
            }
            // @ts-ignore
            const id = contractorsTosTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.editContractorTos(id);
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
         * Обработка региона
         * @param address
         */
        public resolvedRegion(address) {
            return address && address.region ?
                (`${address.region} ${address.region_type}`) : '';
        }

        /**
         * Обработка района
         * @param address
         */
        public resolvedArea(address) {
            return address && address.area ?
                (`${address.area} ${address.area_type}`) : '';
        }

        /**
         * Обработка города
         * @param address
         */
        public resolvedCity(address) {
            return address && address.city ?
                (`${address.city} ${address.city_type}`) : (address && address.settlement ?
                    (`${address.settlement} ${address.settlement_type}`) : '');
        }

        /**
         * Обработка улицы
         * @param address
         */
        public resolvedStreet(address) {
            return address && address.street ?
                (`${address.street} ${address.street_type}`) : '';
        }

        /**
         * Обработка дома
         * @param address
         */
        public resolvedBuild(address) {
            return address && address.house ?
                (`${address.house}`) : '';
        }

        /**
         * Обработка квартиры
         * @param address
         */
        public resolvedFlat(address) {
            return address && address.flat ?
                (`${address.flat}`) : '';
        }

    }
</script>