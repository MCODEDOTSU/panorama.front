<template>
    <div class="manager-container content">

        <h1>Справочник контрагентов</h1>

        <b-button v-b-modal.singleContractorModal @click="administratorContractorUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <!-- Список контрагентов -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-5">Наименование</div>
                <div class="col-2">ИНН</div>
                <div class="col-2">КПП</div>
                <div class="col-3">Адрес</div>
            </div>
            <div class="row row-body" v-for="contractor in contractorState.contractors">
                <div class="col-5">
                    <label class="title">{{ contractor.name }}</label>
                    <label class="description">{{ contractor.full_name }}</label>
                    <div class="actions">
                        <b-button v-b-modal.singleContractorModal @click="administratorContractorSetSingle(contractor)" variant="info">
                            Изменить
                        </b-button>
                        <button class="btn-info" data-toggle="modal" data-target="#contractorModules" @click="administratorContractorSetSingle(contractor)">Доступные модули</button>
                        <button class="btn-info" @click="getContractorUsers(contractor)">Пользователи</button>
                        <button class="btn-danger"data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(contractor)">Удалить</button>
                    </div>
                </div>
                <div class="col-2"><label class="title">{{ contractor.inn }}</label></div>
                <div class="col-2"><label class="title">{{ contractor.kpp }}</label></div>
                <div class="col-3"><label class="title">
                    <span v-if="contractor.address">
                        <span>{{ contractor.address.city }}</span>
                        <span v-if="contractor.address.city && contractor.address.street">, </span>
                        <span>{{ contractor.address.street }}</span>
                        <span v-if="(contractor.address.city || contractor.address.street) && contractor.address.build">, </span>
                        <span>{{ contractor.address.build }}</span>
                    </span>
                </label></div>
            </div>
            <div class="row row-footer">
                <div class="col-5">Наименование</div>
                <div class="col-2">ИНН</div>
                <div class="col-2">КПП</div>
                <div class="col-3">Адрес</div>
            </div>
        </div>
        <!-- конец Список контрагентов -->

        <single-contractor></single-contractor>

        <contractor-module></contractor-module>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

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

        public async created() {
            await this.administratorContractorGetAll();
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param contractor
         */
        public setSureModalContent(contractor: any) {
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
         * Перейти на компонент редактирования пользователей контрагента
         * @param contractor
         */
        public getContractorUsers(contractor: any) {
            this.administratorContractorSetSingle(contractor);
            this.$router.push(`/administrator/contractors/users/${contractor.id}`);
        }

    }
</script>