<template>
    <!-- Modal -->
    <div class="modal fade modal-dialog-contractor" id="singleContractorModal" tabindex="-1" role="dialog" aria-labelledby="singleContractorModalLabel"
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

                        <div class="form-group file-upload">
                            <img :src="getLogoSrc()" class="photo" @click="$refs.photo.click()"/>
                            <input type="file" ref="photo" class="form-control-file" @change="uploadLogo"
                                   accept="image/jpeg,image/png,image/gif"/>
                            <button v-if="this.contractorState.contractor.logo !== '' && this.contractorState.contractor.logo !== null" @click="deleteLogo()">
                                &times;
                            </button>
                        </div>

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
                            <input type="text" id="singleContractorINN" required
                                   class="form-control"
                                   placeholder="ИНН"
                                   v-model="contractorState.contractor.inn">
                        </div>

                        <div class="form-group">
                            <label for="singleContractorKPP">КПП</label>
                            <input type="text" id="singleContractorKPP"
                                   class="form-control"
                                   placeholder="КПП"
                                   v-model="contractorState.contractor.kpp">
                        </div>

                        <div class="form-group">
                            <label for="singleContractorAddressCity">Город контрагента</label>
                            <input type="text" id="singleContractorAddressCity"
                                   class="form-control"
                                   placeholder="г. Астрахань"
                                   v-model="resolvedCity">
                        </div>

                        <div class="form-group">
                            <label for="singleContractorAddressStreet">Улица</label>
                            <input type="text" id="singleContractorAddressStreet"
                                   class="form-control"
                                   placeholder="ул. Красная Набережная"
                                   v-model="resolvedStreet">
                        </div>

                        <div class="form-group">
                            <label for="singleContractorAddressBuild">Дом, строение</label>
                            <input type="text" id="singleContractorAddressBuild"
                                   class="form-control"
                                   v-model="resolvedBuild">
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label for="singleLayerModuleId">Родительский контрагент</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-10">
                                <select id="singleLayerModuleId"
                                        class="form-control"
                                        v-model="contractorState.contractor.parent_id">
                                    <option v-for="contractor in parentContractors" :value="contractor.id"
                                            :title="contractor.name">
                                        {{ contractor.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-2" v-if="contractorState.contractor.parent_id">
                                <a href="javascript: void(0);" title="Удалить"
                                   @click="detachParentContractor(contractorState.contractor)">Удалить</a>
                            </div>

                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary"
                            @click="administratorContractorUpdate"
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

    import ContractorState from '@/store/modules/administrator/contractor/types';

    @Component({})
    export default class SingleContractor extends Vue {

        @Action public administratorContractorUpdate: any;
        @Action public administratorContractorUploadLogo: any;
        @Action public detachParentContractor: any;

        @State('administratorContractor') public contractorState: ContractorState;

        get resolvedCity() {
            if (this.contractorState.contractor.address  === null) {
                return '';
            }
            return (this.contractorState.contractor.address.city === '' || this.contractorState.contractor.address.city === null) ?
                '' : this.contractorState.contractor.address.city;
        }

        set resolvedCity(city: string) {
            if (this.contractorState.contractor.address  === null) {
                this.contractorState.contractor.address = { id: 0, city: '', street: '', build: '', region: ''};
            }
            this.contractorState.contractor.address.city = city;
        }

        get resolvedStreet() {
            if (this.contractorState.contractor.address  === null) {
                return '';
            }
            return (this.contractorState.contractor.address.street === '' || this.contractorState.contractor.address.street === null) ?
                '' : this.contractorState.contractor.address.street;
        }

        set resolvedStreet(street: string) {
            if (this.contractorState.contractor.address  === null) {
                this.contractorState.contractor.address = { id: 0, city: '', street: '', build: '', region: ''};
            }
            this.contractorState.contractor.address.street = street;
        }

        get resolvedBuild() {
            if (this.contractorState.contractor.address  === null) {
                return '';
            }
            return (this.contractorState.contractor.address.build === '' || this.contractorState.contractor.address.build === null) ?
                '' : this.contractorState.contractor.address.build;
        }

        set resolvedBuild(build: string) {
            if (this.contractorState.contractor.address  === null) {
                this.contractorState.contractor.address = { id: 0, city: '', street: '', build: '', region: ''};
            }
            this.contractorState.contractor.address.build = build;
        }

        get parentContractors() {
            let parentContractors = [];

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

        public getLogoSrc() {
            return (this.contractorState.contractor.logo === '' || this.contractorState.contractor.logo === null) ?
                '/images/empty.jpg' : this.contractorState.contractor.logo;
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
    }
</script>