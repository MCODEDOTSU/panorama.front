<template>
    <!-- Modal -->
    <div class="modal fade" id="singleContractorModal" tabindex="-1" role="dialog" aria-labelledby="singleContractorModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleContractorModalLabel">
                        <span v-if="contractorState.contractor.id === 0">Создание нового контрагента</span>
                        <span v-else>Изменение контрагента "{{ contractorState.contractor.name }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="singleContractorName">Наименование *</label>
                            <input type="text" id="singleContractorName" required
                                   class="form-control"
                                   placeholder="Наименование контрагента"
                                   v-model="contractorState.contractor.name">
                        </div>
                        <div class="form-group">
                            <label for="singleContractorFullName">Полное наименование *</label>
                            <input type="text" id="singleContractorFullName" required
                                   class="form-control"
                                   placeholder="Полное наименование контрагента"
                                   v-model="contractorState.contractor.full_name">
                        </div>
                        <div class="form-group">
                            <label for="singleContractorINN">ИНН *</label>
                            <input type="number" id="singleContractorINN" required
                                   class="form-control"
                                   placeholder="ИНН"
                                   v-model="contractorState.contractor.inn">
                        </div>
                        <div class="form-group">
                            <label for="singleContractorKPP">КПП</label>
                            <input type="number" id="singleContractorKPP"
                                   class="form-control"
                                   placeholder="КПП"
                                   v-model="contractorState.contractor.kpp">
                        </div>
                        <div class="form-group" v-if="contractorState.contractor.address">
                            <label for="singleContractorAddressCity">Город контрагента</label>
                            <input type="text" id="singleContractorAddressCity"
                                   class="form-control"
                                   placeholder="г. Астрахань"
                                   v-model="contractorState.contractor.address.city">
                        </div>
                        <div class="form-group" v-if="contractorState.contractor.address">
                            <label for="singleContractorAddressStreet">Улица</label>
                            <input type="text" id="singleContractorAddressStreet"
                                   class="form-control"
                                   placeholder="ул. Кр.Набережная"
                                   v-model="contractorState.contractor.address.street">
                        </div>
                        <div class="form-group" v-if="contractorState.contractor.address">
                            <label for="singleContractorAddressBuild">Дом, строение</label>
                            <input type="text" id="singleContractorAddressBuild"
                                   class="form-control"
                                   v-model="contractorState.contractor.address.build">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            @click="updateContractor"
                            data-dismiss="modal">
                        Сохранить
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ContractorState from '@/store/modules/manager/contractor/types';

    @Component({})
    export default class SingleContractor extends Vue {

        @Action public updateContractor: any;

        @State('managerContractor') public contractorState: ContractorState;

    }
</script>