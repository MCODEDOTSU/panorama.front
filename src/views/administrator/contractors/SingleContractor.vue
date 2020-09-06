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

                    <div class="col-4">

                        <div class="form-group">
                            <label for="singleContractorAddressRegion">Регион</label>
                            <select id="singleContractorAddressRegion" class="form-control" v-model="resolvedRegion">
                                <option v-for="region in regionState.regions" :value="region.id">
                                    {{ region.id < 10 ? `0${region.id}` : region.id }}: {{ region.name }}
                                </option>
                            </select>
                        </div>

                    </div>

                    <div class="col-4">

                        <div class="form-group">
                            <label for="singleContractorAddressDistrict">Район</label>
                            <input type="text" id="singleContractorAddressDistrict"
                                   class="form-control"
                                   v-model="resolvedDistrict">
                        </div>

                    </div>

                    <div class="col-4">

                        <div class="form-group">
                            <label for="singleContractorAddressCity">Город (поселок, село)</label>
                            <input type="text" id="singleContractorAddressCity"
                                   class="form-control"
                                   placeholder="г. Астрахань"
                                   v-model="resolvedCity">
                        </div>
                    </div>

                    <div class="col-8">

                        <div class="form-group">
                            <label for="singleContractorAddressStreet">Улица (переулок)</label>
                            <input type="text" id="singleContractorAddressStreet"
                                   class="form-control"
                                   placeholder="ул. Красная Набережная"
                                   v-model="resolvedStreet">
                        </div>

                    </div>

                    <div class="col-4">

                        <div class="form-group">
                            <label for="singleContractorAddressBuild">Дом (строение)</label>
                            <input type="text" id="singleContractorAddressBuild"
                                   class="form-control"
                                   v-model="resolvedBuild">
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

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

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

        public async created() {
            await this.getRegions();
        }

        get resolvedRegion() {
            if (this.contractorState.contractor.address  === null) {
                return 0;
            }
            return (this.contractorState.contractor.address.region_id === 0 || this.contractorState.contractor.address.region_id === null) ?
                0 : this.contractorState.contractor.address.region_id;
        }

        set resolvedRegion(regionId: number) {
            if (this.contractorState.contractor.address  === null) {
                this.contractorState.contractor.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.contractorState.contractor.address.region_id = regionId;
        }

        get resolvedDistrict() {
            if (this.contractorState.contractor.address  === null) {
                return '';
            }
            return (this.contractorState.contractor.address.district === '' || this.contractorState.contractor.address.district === null) ?
                '' : this.contractorState.contractor.address.district;
        }

        set resolvedDistrict(district: string) {
            if (this.contractorState.contractor.address === null) {
                this.contractorState.contractor.address = {
                    id: 0,
                    district: '',
                    city: '',
                    street: '',
                    build: '',
                    region_id: 0,
                };
            }
            this.contractorState.contractor.address.district = district;
        }

        get resolvedCity() {
            if (this.contractorState.contractor.address === null) {
                return '';
            }
            return (this.contractorState.contractor.address.city === '' || this.contractorState.contractor.address.city === null) ?
                '' : this.contractorState.contractor.address.city;
        }

        set resolvedCity(city: string) {
            if (this.contractorState.contractor.address === null) {
                this.contractorState.contractor.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.contractorState.contractor.address.city = city;
        }

        get resolvedStreet() {
            if (this.contractorState.contractor.address === null) {
                return '';
            }
            return (this.contractorState.contractor.address.street === '' || this.contractorState.contractor.address.street === null) ?
                '' : this.contractorState.contractor.address.street;
        }

        set resolvedStreet(street: string) {
            if (this.contractorState.contractor.address === null) {
                this.contractorState.contractor.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.contractorState.contractor.address.street = street;
        }

        get resolvedBuild() {
            if (this.contractorState.contractor.address === null) {
                return '';
            }
            return (this.contractorState.contractor.address.build === '' || this.contractorState.contractor.address.build === null) ?
                '' : this.contractorState.contractor.address.build;
        }

        set resolvedBuild(build: string) {
            if (this.contractorState.contractor.address === null) {
                this.contractorState.contractor.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.contractorState.contractor.address.build = build;
        }

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