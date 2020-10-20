<template>
    <div class="manager-container content">

        <h1>Справочник контрагентов</h1>

        <b-button v-b-modal.singleContractorModal @click="administratorContractorUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <!-- Список -->
        <vue-table-dynamic :params="contractors" v-on:cell-click="showSingleContractorModal" ref="contractorsTable">

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
                <b-button v-b-modal.singleContractorModal @click="contractorSetSingle(props.cellData)" variant="info">
                    Изменить
                </b-button>
                <button class="btn btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    Удалить
                </button>
            </template>

            <!-- Action: Modules -->
            <template v-slot:column-9="{ props }">
                <b-button v-b-modal.contractorModules @click="contractorSetSingle(props.cellData)" variant="info">
                    Доступные модули
                </b-button>
            </template>

            <!-- Action: Users -->
            <template v-slot:column-10="{ props }">
                <b-button @click="getContractorUsers(props.cellData)" variant="info">
                    Пользователи
                </b-button>
            </template>

        </vue-table-dynamic>
        <!-- конец Список -->

        <single-contractor></single-contractor>

        <contractor-module></contractor-module>

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
    import SingleContractor from '@/views/administrator/contractors/SingleContractor.vue';
    import ContractorModule from '@/views/administrator/contractors/ContractorModules.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleContractor, ContractorModule, SureModal},
    })
    export default class Contractors extends Vue {

        @Action public administratorContractorGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorContractorDelete: any;
        @Action public administratorContractorSetSingle: any;
        @Action public administratorContractorUnsetSingle: any;

        @State('administratorContractor') public contractorState: ContractorState;

        @Provide() public contractors = {
            data: [],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5, 6],
            pagination: true,
            pageSize: 50,
            pageSizes: [],
        };
        @Provide() private tableIdIndexes = [8, 9, 10];

        @Watch('contractorState.contractors', {deep: true})
        public onContractors() {
            this.contractors.data = [ [
                'Наименование', 'Полное наименование', 'ИНН', 'КПП',
                'Регион', 'Район', 'Город/село', 'Улица, дом', '', '', ''
            ] ];
            this.contractorState.contractors.forEach((item, i) => {
                this.contractors.data.push([
                    item.name,
                    item.full_name,
                    item.inn,
                    item.kpp,
                    this.resolvedRegion(item.address),
                    this.resolvedArea(item.address),
                    this.resolvedCity(item.address),
                    item.address,
                    item.id.toString(),
                    item.id.toString(),
                    item.id.toString(),
                ]);
            });
        }

        /**
         * При создании компонента
         */
        public async created() {
            await this.administratorContractorGetAll();
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
         * Открыть модальное окно для изменения контрагента
         * @param rowIndex
         * @param columnIndex
         * @param data
         */
        public showSingleContractorModal(rowIndex, columnIndex, data) {

            if (this.tableIdIndexes.indexOf(columnIndex) !== -1) {
                return;
            }

            const contractorsTable: HTMLElement = this.$refs.contractorsTable as HTMLElement;
            if (!contractorsTable) {
                return;
            }

            // @ts-ignore
            const id = contractorsTable.tableData.rows[rowIndex].cells[this.tableIdIndexes[0]].data;
            this.contractorSetSingle(id);
            // @ts-ignore
            this.$bvModal.show('singleContractorModal');
        }

        /**
         * Открыть диалог удаления контрагента
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
                const firstCell = i === 0 ? '№ п/п' : i;
                return [ firstCell ].concat(row.cells.map((cell, j) => {
                    if (this.tableIdIndexes.indexOf(j) === -1) {
                        return (j + 1) < row.cells.length ? cell.data : false;
                    }
                }));
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
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