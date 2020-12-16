<template>

    <div class="manager-container content">

        <header class="content-header">

            <button @click="back" class="btn btn-info btn-back">
                <i class="fa fa-angle-left"></i>
                Назад
            </button>

            <h1 v-if="contractorTosId === 0">
                Создание ТОС
            </h1>
            <h1 v-else>
                Изменение ТОС: <b v-if="contractorTosState.contractorTos.full_contractor" class="accent">{{ contractorTosState.contractorTos.full_contractor.name }}</b>
            </h1>

        </header>

        <!-- Вкладки -->
        <ul class="nav nav-tabs" id="tabs" role="tablist" ref="tablist">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#main" role="tab" aria-controls="main" aria-selected="true">
                    Основные сведения
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#addresses" role="tab" aria-controls="addresses" aria-selected="false">
                    Адреса
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
                                id="singleContractorTosContractor"
                                :list="resolvedContractors"
                                v-model="resolvedContractor"
                                v-on:onchange="contractorChange"
                            >
                            </awesome-selector>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Адреса -->
            <div class="tab-pane fade" id="addresses" role="tabpanel" aria-labelledby="addresses-tab">
                <div class="card-body">
                    <div class="row" v-for="address in contractorTosState.contractorTos.addresses">
                        <div class="col-11">
                            <div class="form-group">
                                <label>{{ address.unrestricted_value }}</label>
                            </div>
                        </div>
                        <div class="col-1">
                            <button class="btn btn-default btn-circle" @click="addressesTabDeleteAddress(address)">
                                <i class="fa fa-minus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-11">
                            <vue-dadata
                                :onChange="addressesTabChangeAddress"
                                :token="dadataApiKey"
                            >
                            </vue-dadata>
                        </div>
                        <div class="col-1">
                            <button class="btn btn-success btn-circle" @click="addressesTabAddAddress">
                                <i class="fa fa-plus"></i>
                            </button>
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
    import {removeDeletedItem} from '@/domain/services/common/UpdateItemService';
    import {baseUrl, dadataApiKey} from '@/globals';
    import ContractorTosState from '@/store/modules/administrator/contractorTos/types';
    import ContractorState from '@/store/modules/administrator/contractor/types';
    import AwesomeSelector from '@/components/utils/awesomeSelector/AwesomeSelector.vue';
    import IContractorTos from "@/domain/interfaces/IContractorTos";
    import IFiasAddress from "@/domain/interfaces/IFiasAddress";

    @Component({
        components: { AwesomeSelector },
    })
    export default class SingleContractorTos extends Vue {

        @Action public administratorContractorGetAll: any;
        @Action public administratorContractorTosGetById: any;
        @Action public administratorContractorTosUpdate: any;
        @Action public administratorContractorTosSetSingle: any;
        @Action public administratorContractorTosUnsetSingle: any;
        @Action public administratorContractorTosAddAddress: any;
        @Action public administratorContractorTosDeleteAddress: any;

        @State('administratorContractorTos') public contractorTosState: ContractorTosState;
        @State('administratorContractor') public contractorState: ContractorState;

        @Provide() private address: IFiasAddress;
        @Provide() private dadataApiKey = dadataApiKey;
        @Provide() private contractorTos: IContractorTos = {
            id: 0,
            contractor_id: 0,
        };

        /**
         * Создание компонента
         */
        public async created() {
            this.administratorContractorGetAll();
            if (this.contractorTosId === 0) {
                this.administratorContractorTosUnsetSingle();
            } else {
                await this.administratorContractorTosGetById({ id: this.contractorTosId });
            }
            this.contractorTos = { ...this.contractorTosState.contractorTos };
        }

        /**
         * Сохранить
         */
        public async save() {
            await this.administratorContractorTosUpdate();
            this.contractorTos = { ...this.contractorTosState.contractorTos };
        }

        /**
         * Вернуться к списку
         */
        public back() {
            this.$router.push('/administrator/contractors/tos/');
        }

        /**
         * ИД
         */
        get contractorTosId() {
            return this.$route.params.id ? parseInt(this.$route.params.id, 10) : 0;
        }

        /**
         * Есть ли изменения в карточке
         */
        get hasChanges() {
            if (this.contractorTosId !== 0 && this.contractorTos.id === 0) {
                return false;
            }
            return !deepEqual(this.contractorTos, this.contractorTosState.contractorTos);
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
            this.contractorTosState.contractorTos.contractor_id = item.id;
            this.resolvedContractor = item;
        }

        get resolvedContractor() {
            return (this.contractorTosState.contractorTos.full_contractor === null || this.contractorTosState.contractorTos.full_contractor === undefined) ? {
                id: 0, title: '',
            } : {
                id: this.contractorTosState.contractorTos.full_contractor.id,
                title: this.contractorTosState.contractorTos.full_contractor.name,
            };
        }

        set resolvedContractor(item) {
            this.contractorTosState.contractorTos.full_contractor = Object.assign({}, {
                id: item.id, name: item.title, full_name: item.title,
            });
        }

        /**
         * Добавляем новый адрес в список адресов
         * @param address
         */
        public addressesTabChangeAddress(address) {
            this.address = { ...address.data, unrestricted_value: address.unrestricted_value };
        }

        /**
         * Добавить Адрес в список
         */
        public addressesTabAddAddress() {
            this.administratorContractorTosAddAddress({ address: this.address });
        }

        /**
         * Удалить адрес из списка
         */
        public addressesTabDeleteAddress(address) {
            this.administratorContractorTosDeleteAddress({ address });
        }

    }
</script>