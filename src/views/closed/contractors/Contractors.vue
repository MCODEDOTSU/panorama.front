<template>
    <div class="manager-modules-container content">

        <h1>Справочник контрагентов</h1>
        <button data-toggle="modal" data-target="#singleContractorModal" @click="unsetSingleContractor" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать нового
        </button>

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
                        <button class="btn-info" data-toggle="modal" data-target="#singleContractorModal" @click="setSingleContractor(contractor)">Изменить</button>
                        <button class="btn-info" data-toggle="modal" data-target="#contractorModules" @click="setSingleContractor(contractor)">Доступные модули</button>
                        <button class="btn-info" @click="getContractorUsers(contractor)">Пользователи</button>
                        <button class="btn-danger"data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(contractor)">Удалить</button>
                    </div>
                </div>
                <div class="col-2"><label class="title">{{ contractor.inn }}</label></div>
                <div class="col-2"><label class="title">{{ contractor.kpp }}</label></div>
                <div class="col-3"><label class="title">
                    {{ contractor.address.city }}, {{ contractor.address.street }}, {{ contractor.address.build }}
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
    import ContractorState from '@/store/modules/manager/contractor/types';
    import SingleContractor from '@/views/closed/contractors/SingleContractor.vue';
    import ContractorModule from '@/views/closed/contractors/ContractorModules.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleContractor, ContractorModule, SureModal},
    })
    export default class Contractors extends Vue {

        @Action public getContractors: any;
        @Action public setSureModal: any;
        @Action public deleteContractor: any;
        @Action public setSingleContractor: any;
        @Action public unsetSingleContractor: any;

        @State('managerContractor') public contractorState: ContractorState;

        public async created() {
            await this.getContractors();
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
                    this.setSingleContractor(contractor);
                    await this.deleteContractor();
                    this.unsetSingleContractor();
                },
            });
        }

        /**
         * Перейти на компонент редактирования пользователей контрагента
         * @param contractor
         */
        public getContractorUsers(contractor: any) {
            this.setSingleContractor(contractor);
            this.$router.push(`/manager/contractors/users/${contractor.id}`);
        }

    }
</script>