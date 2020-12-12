<template>
    <div class="manager-container content">

        <h1>Справочник ТОСов</h1>

        <b-button v-b-modal.singleContractorTosModal @click="administratorContractorTosUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <!-- Список -->
        <vue-table-dynamic :params="contractorsTos" v-on:cell-click="showSingleContractorTosModal" ref="contractorsTosTable">

            <!-- Address -->
            <template v-slot:column-7="{ props }">
                <span v-if="props.cellData !== null">
                    {{ props.cellData.street_with_type }}, {{ props.cellData.house_type }}
                    {{ props.cellData.house }} {{ props.cellData.block_type }} {{ props.cellData.block }}
                </span>
                <span v-else>-</span>
            </template>

            <!-- Actions -->
            <template v-slot:column-8="{ props }">
                <b-button v-b-modal.singleContractorTosModal @click="contractorTosSetSingle(props.cellData)" variant="default">
                    Изменить
                </b-button>
                <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    Удалить
                </button>
            </template>

        </vue-table-dynamic>
        <!-- конец Список -->

        <single-contractorTos></single-contractorTos>

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
    import SingleContractorTos from '@/views/administrator/contractorsTos/SingleContractorTos.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { SingleContractorTos, SureModal },
    })
    export default class ContractorsTos extends Vue {

        @Action public administratorContractorTosGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorTosDelete: any;
        @Action public administratorContractorTosSetSingle: any;
        @Action public administratorContractorTosUnsetSingle: any;

        @State('administratorContractorTos') public contractorTosState: ContractorTosState;

        @Provide() public contractorsTos = {
            data: [],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6],
            pagination: true,
            pageSize: 50,
            pageSizes: [],
        };
        @Provide() private tableIdIndex = 8;

        @Watch('contractorTosState.contractorToses', {deep: true})
        public onContractorToses() {
            this.contractorsTos.data = [ ['Наименование', 'Полное наименование', 'ИНН', 'КПП', 'Регион', 'Район', 'Город/село', 'Улица, дом', ''] ];
            this.contractorTosState.contractorToses.forEach((item, i) => {
                this.contractorsTos.data.push([
                    item.full_contractor.name,
                    item.full_contractor.full_name,
                    item.full_contractor.inn,
                    item.full_contractor.kpp,
                    this.resolvedRegion(item.full_contractor.address),
                    this.resolvedArea(item.full_contractor.address),
                    this.resolvedCity(item.full_contractor.address),
                    item.full_contractor.address,
                    item.id.toString(),
                ]);
            });
        }

        /**
         * При создании компонента
         */
        public async created() {
            await this.administratorContractorTosGetAll();
        }

        /**
         * Выбрать ТОС
         * @param contractorTosId
         */
        public contractorTosSetSingle(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorToses, parseInt(contractorTosId, 10));
            this.administratorContractorTosSetSingle(contractorTos);
        }

        /**
         * Открыть модальное окно для изменения ТОС
         * @param rowIndex
         * @param columnIndex
         * @param data
         */
        public showSingleContractorTosModal(rowIndex, columnIndex, data) {

            if (columnIndex === this.tableIdIndex) {
                return;
            }

            const contractorsTosTable: HTMLElement = this.$refs.contractorsTosTable as HTMLElement;
            if (!contractorsTosTable) {
                return;
            }

            // @ts-ignore
            const id = contractorsTosTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.contractorTosSetSingle(id);
            // @ts-ignore
            this.$bvModal.show('singleContractorTosModal');
        }

        /**
         * Открыть диалог удаления ТОС
         * @param contractorTosId
         */
        public setSureModalContent(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorToses, parseInt(contractorTosId, 10));
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
                const firstCell = i === 0 ? '№ п/п' : i;
                return [ firstCell ].concat(row.cells.map((cell, j) => {
                    if (j !== this.tableIdIndex) {
                        return (j + 1) < row.cells.length ? cell.data : false;
                    }
                }));
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

        /**
         * Обработка региона
         * @param region
         */
        public resolvedRegion(address) {
            return address !== null && address.region !== null ?
                (`${address.region} ${address.region_type}`) : '-';
        }

        /**
         * Обработка района
         * @param address
         */
        public resolvedArea(address) {
            return address !== null && address.area !== null ?
                (`${address.area} ${address.area_type}`) : '-';
        }

        /**
         * Обработка города
         * @param address
         */
        public resolvedCity(address) {
            return address !== null && address.city !== null ?
                (`${address.city} ${address.city_type}`) : (address !== null && address.settlement !== null ?
                    (`${address.settlement} ${address.settlement_type}`) : '-');
        }

    }
</script>