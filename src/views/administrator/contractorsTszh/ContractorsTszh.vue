<template>
    <div class="manager-container content">

        <h1>Справочник ТСЖ</h1>

        <b-button v-b-modal.singleContractorTszhModal @click="administratorContractorTszhUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <!-- Список -->
        <vue-table-dynamic :params="contractorsTszh" v-on:cell-click="showSingleContractorTszhModal" ref="contractorsTszhTable">

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
                <b-button v-b-modal.singleContractorTszhModal @click="contractorTszhSetSingle(props.cellData)" variant="default">
                    Изменить
                </b-button>
                <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    Удалить
                </button>
            </template>

        </vue-table-dynamic>
        <!-- конец Список -->

        <single-contractorTszh></single-contractorTszh>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Watch, Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import ContractorTszhState from '@/store/modules/administrator/contractorTszh/types';
    import SingleContractorTszh from '@/views/administrator/contractorsTszh/SingleContractorTszh.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleContractorTszh, SureModal },
    })
    export default class ContractorsTszh extends Vue {

        @Action public administratorContractorTszhGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorTszhDelete: any;
        @Action public administratorContractorTszhSetSingle: any;
        @Action public administratorContractorTszhUnsetSingle: any;

        @State('administratorContractorTszh') public contractorTszhState: ContractorTszhState;

        @Provide() public contractorsTszh = {
            data: [],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6],
            pagination: true,
            pageSize: 50,
            pageSizes: [],
        };
        @Provide() private tableIdIndex = 8;

        @Watch('contractorTszhState.contractorTszhes', {deep: true})
        public onContractorTszhes() {
            this.contractorsTszh.data = [ ['Наименование', 'Полное наименование', 'ИНН', 'КПП', 'Регион', 'Район', 'Город/село', 'Улица, дом', ''] ];
            this.contractorTszhState.contractorTszhes.forEach((item, i) => {
                this.contractorsTszh.data.push([
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

        public async created() {
            await this.administratorContractorTszhGetAll();
        }

        public contractorTszhSetSingle(contractorTszhId: any) {
            const contractorTszh = arrayFindFirst(this.contractorTszhState.contractorTszhes, parseInt(contractorTszhId, 10));
            this.administratorContractorTszhSetSingle(contractorTszh);
        }

        public showSingleContractorTszhModal(rowIndex, columnIndex, data) {

            if (columnIndex === this.tableIdIndex) {
                return;
            }

            const contractorsTszhTable: HTMLElement = this.$refs.contractorsTszhTable as HTMLElement;
            if (!contractorsTszhTable) {
                return;
            }

            // @ts-ignore
            const id = contractorsTszhTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.contractorTszhSetSingle(id);
            // @ts-ignore
            this.$bvModal.show('singleContractorTszhModal');
        }

        public setSureModalContent(contractorTszhId: any) {
            const contractorTszh = arrayFindFirst(this.contractorTszhState.contractorTszhes, parseInt(contractorTszhId, 10));
            this.setSureModal({
                title: 'Удалить ТСЖ?',
                text: `Вы уверены, что хотите удалить ТСЖ "${contractorTszh.constructor.name}" из системы?`,
                action: async () => {
                    this.administratorContractorTszhSetSingle(contractorTszh);
                    await this.administratorContractorTszhDelete();
                    this.administratorContractorTszhUnsetSingle();
                },
            });
        }

        public excelExport() {

            const contractorsTszhTable: HTMLElement = this.$refs.contractorsTszhTable as HTMLElement;
            if (!contractorsTszhTable) {
                return;
            }

            // @ts-ignore
            const td = contractorsTszhTable.tableData;

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