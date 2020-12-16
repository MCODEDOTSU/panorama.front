<template>
    <div class="manager-container content">

        <header class="content-header">

            <button @click="back" class="btn btn-info btn-back">
                <i class="fa fa-angle-left"></i>
                Назад
            </button>

            <h1 v-if="contractorId === 0">
                Создание нового Контрагента
            </h1>
            <h1 v-else>
                Изменение Контрагента: <b class="accent">{{ contractorState.contractor.name }}</b>
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

                        <!-- Логотип -->
                        <div class="col-2">
                            <div class="form-group file-upload">
                                <b-button v-if="contractorState.contractor.logo !== '' && contractorState.contractor.logo !== null" v-b-modal.imageModal>
                                    <div class="image" :style="`background-image: url(${resolveLogoSrc})`"></div>
                                </b-button>
                                <img v-else :src="resolveLogoSrc" class="photo" @click="$refs.photo.click()"/>
                                <input
                                    type="file"
                                    ref="logo"
                                    class="form-control-file"
                                    @change="uploadLogo"
                                    accept="image/jpeg,image/png,image/gif"
                                >
                                <button v-if="resolveLogoSrc !== ''" @click="deleteLogo()">&times;</button>
                            </div>
                        </div>

                        <!-- Наименование, ИНН, КПП -->
                        <div class="col-10">
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singleContractorName">Наименование *</label>
                                        <input
                                            type="text"
                                            id="singleContractorName"
                                            required
                                            class="form-control"
                                            placeholder="Наименование контрагента"
                                            v-model="contractorState.contractor.name"
                                        >
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singleContractorINN">ИНН</label>
                                        <input
                                            type="text"
                                            id="singleContractorINN"
                                            required
                                            class="form-control"
                                            placeholder="ИНН"
                                            v-model="contractorState.contractor.inn"
                                        >
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
                            </div>

                            <div class="row">
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
                                    :query="contractorState.contractor.address ? contractorState.contractor.address.unrestricted_value : ''"
                                    :token="dadataApiKey"
                                >
                                </vue-dadata>
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

        <image-modal v-model="resolveLogoSrc"></image-modal>

    </div>
    
</template>

<script lang="ts">

    import {Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {deepEqual} from '@/domain/services/common/ObjectActions';
    import {baseUrl, dadataApiKey} from '@/globals';
    import ContractorState from '@/store/modules/administrator/contractor/types';
    import ImageModal from '@/components/common/ImageModal.vue';
    import IContractor from "@/domain/interfaces/IContractor";

    @Component({
        components: { ImageModal },
    })
    export default class SingleContractor extends Vue {

        @Action public administratorContractorGetById: any;
        @Action public administratorContractorUpdate: any;
        @Action public administratorContractorUploadLogo: any;
        @Action public administratorContractorSetSingle: any;
        @Action public administratorContractorUnsetSingle: any;

        @State('administratorContractor') public contractorState: ContractorState;

        @Provide() private dadataApiKey = dadataApiKey;
        @Provide() private contractor: IContractor = {
            id: 0,
            name: '',
            full_name: '',
        };

        /**
         * Создание компонента
         */
        public async created() {
            if (this.contractorId === 0) {
                this.administratorContractorUnsetSingle();
            } else {
                await this.administratorContractorGetById({ id: this.contractorId });
            }
            this.contractor = { ...this.contractorState.contractor };
        }

        /**
         * Загрузить фото
         */
        public uploadLogo() {
            const $fileInput: HTMLInputElement = (this.$refs.logo as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.administratorContractorUploadLogo({file});
        }

        /**
         * Удалить фото
         */
        public deleteLogo() {
            this.contractorState.contractor.logo = '';
        }

        /**
         * Путь к фотографии
         */
        get resolveLogoSrc() {
            return (this.contractorState.contractor.logo === '' || this.contractorState.contractor.logo === null) ?
                '/images/logo.png' : `${baseUrl}/storage/${this.contractorState.contractor.logo}`;
        }

        /**
         * Изменили адрес
         */
        public changeAddress(address) {
            this.contractorState.contractor.address = { ...address.data, unrestricted_value: address.unrestricted_value };
        }

        /**
         * Сохранить
         */
        public async save() {
            await this.administratorContractorUpdate();
            this.contractor = { ...this.contractorState.contractor };
        }

        /**
         * Вернуться к списку
         */
        public back() {
            this.$router.push('/administrator/contractors/');
        }

        /**
         * ИД
         */
        get contractorId() {
            return this.$route.params.id ? parseInt(this.$route.params.id, 10) : 0;
        }

        /**
         * Родительский контрагент
         */
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

        /**
         * Есть ли изменения в карточке
         */
        get hasChanges() {
            if (this.contractorId !== 0 && this.contractor.id === 0) {
                return false;
            }
            return !deepEqual(this.contractor, this.contractorState.contractor);
        }

    }
</script>