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
            <template v-slot:column-7="{ props }">
                <b-button v-b-modal.singleContractorTosModal @click="contractorTosSetSingle(props.cellData)" variant="info">
                    Изменить
                </b-button>
                <button class="btn btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
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
        components: {SingleContractorTos, SureModal },
    })
    export default class ContractorsTos extends Vue {

        @Action public administratorContractorTosGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorTosDelete: any;
        @Action public administratorContractorTosSetSingle: any;
        @Action public administratorContractorTosUnsetSingle: any;

        @State('administratorContractorTos') public contractorTosState: ContractorTosState;

        @Provide() public contractorsTos = {
            data: [ ],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6],
            pagination: true,
            pageSize: 50,
            pageSizes: []
        };
        @Provide() private tableIdIndex = 7;

        @Watch('contractorTosState.contractorToses', {deep: true})
        public onContractorToses() {
            this.contractorsTos.data = [ ['Наименование', 'Полное наименование', 'ИНН', 'КПП', 'Регион', 'Район', 'Город', ''] ];
            this.contractorTosState.contractorToses.forEach((item, i) => {
                this.contractorsTos.data.push([
                    item.contractor.name, item.contractor.full_name, item.contractor.inn, item.contractor.kpp,
                    item.contractor.address ? (item.contractor.address.region ? item.contractor.address.region.name : '') : '',
                    item.contractor.address ? item.contractor.address.district : '',
                    item.contractor.address ? item.contractor.address.city : '',
                    item.id.toString(),
                ]);
            });
        }

        public async created() {
            await this.administratorContractorTosGetAll();
        }

        public contractorTosSetSingle(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorToses, parseInt(contractorTosId, 10));
            this.administratorContractorTosSetSingle(contractorTos);
        }

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

        public setSureModalContent(contractorTosId: any) {
            const contractorTos = arrayFindFirst(this.contractorTosState.contractorToses, parseInt(contractorTosId, 10));
            this.setSureModal({
                title: 'Удалить физическое лицо?',
                text: `Вы уверены, что хотите удалить физическое лицо "${contractorTos.lastname} ${contractorTos.firstname}" из системы?`,
                action: async () => {
                    this.administratorContractorTosSetSingle(contractorTos);
                    await this.administratorContractorTosDelete();
                    this.administratorContractorTosUnsetSingle();
                },
            });
        }

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
                    return (j + 1) < row.cells.length ? cell.data : false;
                }));
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

    }
</script>