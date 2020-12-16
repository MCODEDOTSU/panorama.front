<template>

    <div class="manager-container content">

        <header class="content-header">

            <button @click="back" class="btn btn-info btn-back">
                <i class="fa fa-angle-left"></i>
                Назад
            </button>

            <h1 v-if="contractorTszhId === 0">
                Создание ТСЖ
            </h1>
            <h1 v-else>
                Изменение ТСЖ: <b v-if="contractorTszhState.contractorTszh.full_contractor" class="accent">{{ contractorTszhState.contractorTszh.full_contractor.name }}</b>
            </h1>

        </header>

        <!-- Вкладки -->
        <ul class="nav nav-tabs" id="tabs" role="tablist" ref="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#main" role="tab" aria-controls="main" aria-selected="true">
                    Основные сведения
                </a>
            </li>
        </ul>

        <div class="tab-content">
            <!-- Основные сведения -->
            <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <awesome-selector
                                title="Контрагент"
                                id="singleContractorTszhContractor"
                                :list="resolvedContractors"
                                v-model="resolvedContractor"
                                v-on:onchange="contractorChange"
                            >
                            </awesome-selector>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="content-footer">
            <button @click="save" class="btn btn-success" :disabled="!hasChanges">
                <i class="fa fa-floppy-o"></i>
                Сохранить
            </button>
            <button @click="back" class="btn btn-info">
                <i class="fa fa-angle-left"></i>
                К списку
            </button>
        </footer>

    </div>

</template>

<script lang="ts">

    import {Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {deepEqual} from '@/domain/services/common/ObjectActions';
    import {baseUrl, dadataApiKey} from '@/globals';
    import ContractorTszhState from '@/store/modules/administrator/contractorTszh/types';
    import ContractorState from '@/store/modules/administrator/contractor/types';

    import AwesomeSelector from '@/components/utils/awesomeSelector/AwesomeSelector.vue';
    import IContractorTszh from "@/domain/interfaces/IContractorTszh";

    @Component({
        components: { AwesomeSelector },
    })
    export default class SingleContractorTszh extends Vue {

        @Action public administratorContractorGetAll: any;
        @Action public administratorContractorTszhGetById: any;
        @Action public administratorContractorTszhUpdate: any;
        @Action public administratorContractorTszhSetSingle: any;
        @Action public administratorContractorTszhUnsetSingle: any;

        @State('administratorContractorTszh') public contractorTszhState: ContractorTszhState;
        @State('administratorContractor') public contractorState: ContractorState;

        @Provide() private dadataApiKey = dadataApiKey;
        @Provide() private contractorTszh: IContractorTszh = {
            id: 0,
            contractor_id: 0,
        };

        /**
         * Создание компонента
         */
        public async created() {
            this.administratorContractorGetAll();
            if (this.contractorTszhId === 0) {
                this.administratorContractorTszhUnsetSingle();
            } else {
                await this.administratorContractorTszhGetById({ id: this.contractorTszhId });
            }
            this.contractorTszh = { ...this.contractorTszhState.contractorTszh };
        }

        /**
         * Сохранить
         */
        public async save() {
            await this.administratorContractorTszhUpdate();
            this.contractorTszh = { ...this.contractorTszhState.contractorTszh };
        }

        /**
         * Вернуться к списку
         */
        public back() {
            this.$router.push('/administrator/contractors/tszh/');
        }

        /**
         * ИД
         */
        get contractorTszhId() {
            return this.$route.params.id ? parseInt(this.$route.params.id, 10) : 0;
        }

        /**
         * Есть ли изменения в карточке
         */
        get hasChanges() {
            if (this.contractorTszhId !== 0 && this.contractorTszh.id === 0) {
                return false;
            }
            return !deepEqual(this.contractorTszh, this.contractorTszhState.contractorTszh);
        }

        /**
         * Список контрагентов
         */
        get resolvedContractors() {
            return this.contractorState.contractors.map((item) => {
                return {
                    id: item.id,
                    title: item.name,
                };
            });
        }

        /**
         * Изменили контрагента
         * @param item
         */
        public contractorChange(item) {
            this.contractorTszhState.contractorTszh.contractor_id = item.id;
            this.resolvedContractor = item;
        }

        get resolvedContractor() {
            return (this.contractorTszhState.contractorTszh.full_contractor === null || this.contractorTszhState.contractorTszh.full_contractor === undefined) ? {
                id: 0,
                title: '',
            } : {
                id: this.contractorTszhState.contractorTszh.full_contractor.id,
                title: this.contractorTszhState.contractorTszh.full_contractor.name,
            };
        }

        set resolvedContractor(item) {
            this.contractorTszhState.contractorTszh.full_contractor = Object.assign({}, {
                id: item.id, name: item.title, full_name: item.title,
            });
        }

    }
</script>