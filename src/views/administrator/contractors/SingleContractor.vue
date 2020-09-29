<template>

    <b-modal id="singleContractorModal" size="xl"
             :title='contractorState.contractor.id === 0 ? "Создание нового Контрагента" :
             `Изменение Контрагента: "${contractorState.contractor.name}"`'>

        <b-container>

            <div>

                <div class="row">

                    <div class="col-2">

                        <div class="form-group file-upload">
                            <img :src="getLogoSrc" class="photo" @click="$refs.photo.click()"/>
                            <input type="file" ref="photo" class="form-control-file" @change="uploadLogo"
                                   accept="image/jpeg,image/png,image/gif"/>
                            <button v-if="getLogoSrc !== ''" @click="deleteLogo()">&times;</button>
                        </div>

                    </div>

                    <div class="col-10">

                        <div class="row">

                            <div class="col-4">

                                <div class="form-group">
                                    <label for="singleContractorName">Наименование *</label>
                                    <input type="text" id="singleContractorName" required
                                           class="form-control"
                                           placeholder="Наименование контрагента"
                                           v-model="contractorState.contractor.name">
                                </div>

                            </div>

                            <div class="col-4">

                                <div class="form-group">
                                    <label for="singleContractorINN">ИНН</label>
                                    <input type="text" id="singleContractorINN" required
                                           class="form-control"
                                           placeholder="ИНН"
                                           v-model="contractorState.contractor.inn">
                                </div>

                            </div>

                            <div class="col-4">

                                <div class="form-group">
                                    <label for="singleContractorKPP">КПП</label>
                                    <input type="text" id="singleContractorKPP"
                                           class="form-control"
                                           placeholder="КПП"
                                           v-model="contractorState.contractor.kpp">
                                </div>

                            </div>

                            <div class="col-12">

                                <div class="form-group">
                                    <label for="singleContractorFullName">Полное наименование *</label>
                                    <input type="text" id="singleContractorFullName" required
                                           class="form-control"
                                           placeholder="Полное наименование контрагента"
                                           v-model="contractorState.contractor.full_name">
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label>Адрес</label>
                            <vue-dadata
                                    :onChange="changeAddress"
                                    :query="contractorState.contractor.address ?contractorState.contractor.address.unrestricted_value : ''"
                                    :token="dadataApiKey"
                            ></vue-dadata>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <label for="singleLayerModuleId">Родительский контрагент</label>
                    </div>
                </div>
                <div class="row">

                    <div class="col-12">

                        <select id="singleLayerModuleId"
                                class="form-control"
                                v-model="contractorState.contractor.parent_id">
                            <option value="null" title="Нет родительского контрагента">-</option>
                            <option v-for="contractor in parentContractors" :value="contractor.id"
                                    :title="contractor.name">
                                {{ contractor.name }}
                            </option>
                        </select>

                    </div>

                    <!--<div class="col-1 actions" v-if="contractorState.contractor.parent_id">-->
                    <!--<a href="javascript: void(0);" title="Удалить" class="btn btn-danger circle-btn"-->
                    <!--@click="detachParentContractor(contractorState.contractor)"><i class="fa fa-minus"></i></a>-->
                    <!--</div>-->

                </div>

            </div>

        </b-container>

        <div slot="modal-footer">

            <b-button variant="primary" @click="save" data-dismiss="modal">
                Сохранить
            </b-button>

            <b-button variant="secondary" @click="close">
                Закрыть
            </b-button>

        </div>

    </b-modal>
    
</template>

<script lang="ts">

    import {Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {dadataApiKey} from '@/globals';

    import ContractorState from '@/store/modules/administrator/contractor/types';
    import RegionState from '@/store/modules/region/types';

    @Component({})
    export default class SingleContractor extends Vue {

        @Action public administratorContractorUpdate: any;
        @Action public administratorContractorUploadLogo: any;
        @Action public getRegions: any;
        // @Action public detachParentContractor: any;

        @State('administratorContractor') public contractorState: ContractorState;
        @State('region') public regionState: RegionState;

        @Provide() private dadataApiKey = dadataApiKey;

        get parentContractors() {
            const parentContractors = [];

            this.contractorState.contractors.map((parentContractor) => {
                if ((parentContractor.id !== this.contractorState.contractor.id
                    && parentContractor.parent_id == null)
                    || parentContractor.id === this.contractorState.contractor.parent_id
                ) {
                    parentContractors.push(parentContractor);
                }
            });

            return parentContractors;
        }

        get getLogoSrc() {
            return (this.contractorState.contractor.logo === '' || this.contractorState.contractor.logo === null) ?
                '/images/logo.png' : this.contractorState.contractor.logo;
        }

        public uploadLogo() {
            const $fileInput: HTMLInputElement = (this.$refs.photo as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.administratorContractorUploadLogo({file});
        }

        public deleteLogo() {
            this.contractorState.contractor.logo = '';
        }

        public changeAddress(address) {
            this.contractorState.contractor.address = { ...address.data, unrestricted_value: address.unrestricted_value };
        }

        public save() {
            this.administratorContractorUpdate();
            // @ts-ignore
            this.$bvModal.hide('singleContractorModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singleContractorModal');
        }
    }
</script>