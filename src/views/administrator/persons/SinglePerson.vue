<template>
    <div class="manager-container content">

        <header class="content-header">

            <button @click="back" class="btn btn-info btn-back">
                <i class="fa fa-angle-left"></i>
                Назад
            </button>

            <h1 v-if="personId === 0">
                Создание нового Физического Лица
            </h1>
            <h1 v-else>
                Изменение Физического Лица: <b class="accent">{{ personState.person.lastname }} {{ personState.person.firstname }} {{ personState.person.middlename }}</b>
            </h1>

        </header>

        <!-- Вкладки -->
        <ul class="nav nav-tabs" id="tabs" role="tablist" ref="tablist">
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#main" role="tab" aria-controls="main" aria-selected="true">
                    Основные сведения
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#history" role="tab" aria-controls="history" aria-selected="false">
                    История
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#deputies" role="tab" aria-controls="deputies" aria-selected="false">
                    Депутаты
                </a>
            </li>
        </ul>

        <div class="tab-content">

            <!-- Основные сведения -->
            <div class="tab-pane fade" id="main" role="tabpanel" aria-labelledby="main-tab">
                <div class="card-body">
                    <div class="row">
                        <div class="col-2">
                            <div class="form-group file-upload">
                                <b-button v-if="personState.person.photo !== '' && personState.person.photo !== null" v-b-modal.imageModal>
                                    <div class="image" :style="`background-image: url(${resolvePhotoSrc})`"></div>
                                </b-button>
                                <img v-else :src="resolvePhotoSrc" class="photo" @click="$refs.photo.click()"/>
                                <input
                                    type="file"
                                    ref="photo"
                                    class="form-control-file"
                                    @change="uploadPhoto"
                                    accept="image/jpeg,image/png,image/gif"
                                    :disabled="!hasWrite"
                                >
                                <button v-if="resolvePhotoSrc !== ''" @click="deletePhoto()">&times;</button>
                            </div>
                        </div>
                        <div class="col-10">
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonLastname">Фамилия *</label>
                                        <input type="text" id="singlePersonLastname" required
                                               class="form-control"
                                               placeholder="Фамилия"
                                               v-model="personState.person.lastname"
                                               :disabled="!hasWrite"
                                        >
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonFirstname">Имя *</label>
                                        <input type="text" id="singlePersonFirstname" required
                                               class="form-control"
                                               placeholder="Имя"
                                               v-model="personState.person.firstname"
                                               :disabled="!hasWrite"
                                        >
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonMiddlename">Отчество</label>
                                        <input type="text" id="singlePersonMiddlename"
                                               class="form-control"
                                               placeholder="Отчество"
                                               v-model="personState.person.middlename"
                                               :disabled="!hasWrite"
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonDateOfBirth">Дата рождения</label>
                                        <date-picker
                                                id="singlePersonDateOfBirth"
                                                format="DD.MM.YYYY"
                                                valueType="DD.MM.YYYY"
                                                :editable="true"
                                                :input-class="'form-control'"
                                                v-model="resolvedDate"
                                                placeholder="Дата Рождения"
                                                :disabled="!hasWrite"
                                        >
                                        </date-picker>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonPost">Должность</label>
                                        <input type="text" id="singlePersonPost"
                                               class="form-control"
                                               placeholder="Должность"
                                               v-model="personState.person.post"
                                               :disabled="!hasWrite"
                                        >
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="singlePersonStatus">Статус</label>
                                        <div class="form-check">
                                            <input type="checkbox" id="singlePersonStatus" class="form-check-input" v-model="resolvedStatus" :disabled="!hasWrite"/>
                                            <label class="form-check-label" for="singlePersonStatus">VIP-статус <i class="fas fa-crown"></i></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <phones v-model="personState.person.phones" :disabled="!hasWrite"></phones>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label>Адрес</label>
                                <vue-dadata
                                    :onChange="changeAddress"
                                    :query="personState.person.address ? personState.person.address.unrestricted_value : ''"
                                    :token="dadataApiKey"
                                    :disabled="!hasWrite"
                                ></vue-dadata>
                                <span class="form-group-info" v-if="tszh">
                                    <i class="fa fa-building" aria-hidden="true"></i>
                                    По данному адресу найдено ТСЖ <b>"{{ tszh.name }}"</b>. Физическое лицо автоматически будет привязано к данному ТСЖ
                                </span>
                                <span class="form-group-info" v-if="tos">
                                    <i class="fa fa-cubes" aria-hidden="true"></i>
                                    По данному адресу найдено ТОС <b>"{{ tos.full_contractor.name }}"</b>. Физическое лицо автоматически будет привязано к данному ТОС
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-2">
                            <div class="form-group">
                                <label for="singlePersonPassportSeries">Серия паспорта</label>
                                <input type="text" id="singlePersonPassportSeries"
                                       class="form-control"
                                       placeholder="Серия"
                                       v-model="personState.person.passport_series"
                                       :disabled="!hasWrite">
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-group">
                                <label for="singlePersonPassportNumber">Номер паспорта</label>
                                <input type="text" id="singlePersonPassportNumber"
                                       class="form-control"
                                       placeholder="Номер"
                                       v-model="personState.person.passport_number"
                                       :disabled="!hasWrite">
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="singlePersonPassportPassportIssuedBy">Выдан кем</label>
                                <input type="text" id="singlePersonPassportPassportIssuedBy"
                                       class="form-control"
                                       placeholder="Выдан кем"
                                       v-model="personState.person.passport_issued_by"
                                       :disabled="!hasWrite">
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-group">
                                <label for="singlePersonPassportPassportIssuedWhen">Выдан когда</label>
                                <date-picker
                                        id="singlePersonPassportPassportIssuedWhen"
                                        format="DD.MM.YYYY"
                                        valueType="DD.MM.YYYY"
                                        :editable="true"
                                        :input-class="'form-control'"
                                        v-model="resolvedDatePassport"
                                        placeholder="Выдан когда"
                                        :disabled="!hasWrite">
                                </date-picker>
                            </div>
                        </div>
                        <div class="col-2">
                            <div class="form-group">
                                <label for="singlePersonPassportDepartmentNumber">Номер подразделения</label>
                                <input type="text" id="singlePersonPassportDepartmentNumber"
                                       class="form-control"
                                       placeholder="Номер подразделения"
                                       v-model="personState.person.passport_department_number"
                                       :disabled="!hasWrite">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="singlePersonOwn">Данные о собственности</label>
                                <textarea id="singlePersonOwn"
                                          class="form-control"
                                          placeholder="Данные о собственности"
                                          v-model="personState.person.own"
                                          :disabled="!hasWrite">
                            </textarea>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- История -->
            <div class="tab-pane fade show active" id="history" role="tabpanel" aria-labelledby="history-tab">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <history
                                    v-model="personState.person.history"
                                    :object="'person'"
                            ></history>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Депутаты -->
            <div class="tab-pane fade" id="deputies" role="tabpanel" aria-labelledby="deputies-tab">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <div class="alert alert-info">
                                    Раздел находится в разработке
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <footer class="content-footer">
            <button @click="save" class="btn btn-success" v-if="hasWrite" :disabled="!hasChanges">
                <i class="fa fa-floppy-o"></i>
                Сохранить
            </button>
            <button @click="toggleHasWrite" v-else class="btn btn-warning">
                <i class="fa fa-pencil"></i>
                Редактировать
            </button>
            <button @click="back" class="btn btn-info">
                <i class="fa fa-angle-left"></i>
                К списку
            </button>
        </footer>

        <image-modal v-model="resolvePhotoSrc"></image-modal>

    </div>

</template>

<script lang="ts">

    import {Provide, Watch, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {deepEqual} from '@/domain/services/common/ObjectActions';
    import {baseUrl, baseUrlAPI, dadataApiKey} from '@/globals';
    import axios from 'axios';
    import PersonState from '@/store/modules/administrator/person/types';
    import UserState from '@/store/modules/user/types';
    import PhonesState from '@/store/modules/components/utils/phones/types';
    import HistorySate from '@/store/modules/components/utils/history/types';
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';
    import 'vue2-datepicker/locale/ru';
    import ImageModal from '@/components/common/ImageModal.vue';
    import History from '@/components/utils/history/History.vue';
    import Phones from '@/components/utils/phones/Phones.vue';
    import IPerson from "@/domain/interfaces/IPerson";

    @Component({
        components: { DatePicker, ImageModal, History, Phones },
    })
    export default class SinglePerson extends Vue {

        @Action public administratorPersonGetById: any;
        @Action public administratorPersonUpdate: any;
        @Action public administratorPersonUploadPhoto: any;
        @Action public administratorPersonSetSingle: any;
        @Action public administratorPersonUnsetSingle: any;
        @Action public addPhone: any;
        @Action public unsetPhone: any;

        @State('administratorPerson') public personState: PersonState;
        @State('user') public userState!: UserState;
        @State('phones') public phonesState!: PhonesState;
        @State('history') public historyState!: HistorySate;

        @Provide() private dadataApiKey = dadataApiKey;
        @Provide() private tszh = false;
        @Provide() private tos = false;
        @Provide() private person: IPerson = {
            id: 0,
            firstname: '',
            lastname: '',
            middlename: '',
            fias_address_id: 0,
        };
        @Provide() private hasWrite: Boolean = false;

        @Watch('personState.person.address', {deep: true})
        public onChangePersonAddress() {
            this.tszh = false;
            if (this.personState.person.address && this.personState.person.address.fias_id) {
                this.getTszhByAddress();
                this.getTosByAddress();
            }
        }

        @Watch('historyState.histories', {deep: true})
        public onChangeHistory() {
            this.personState.person.history = this.historyState.histories;
        }

        /**
         * Создание компонента
         */
        public async created() {
            if (this.personId === 0) {
                this.hasWrite = true;
                this.administratorPersonUnsetSingle();
            } else {
                await this.administratorPersonGetById({ id: this.personId });
            }
            this.person = { ...this.personState.person };
        }

        /**
         * Загрузить фото
         */
        public uploadPhoto() {
            const $fileInput: HTMLInputElement = (this.$refs.photo as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.administratorPersonUploadPhoto({file});
        }

        /**
         * Удалить фото
         */
        public deletePhoto() {
            this.personState.person.photo = '';
        }

        /**
         * Путь к фотографии
         */
        get resolvePhotoSrc() {
            return (this.personState.person.photo === '' || this.personState.person.photo === null) ?
                '/images/social.png' : `${baseUrl}/storage/${this.personState.person.photo}`;
        }

        /**
         * Изменили адрес
         */
        public changeAddress(address) {
            this.personState.person.address = { ...address.data, unrestricted_value: address.unrestricted_value };
        }

        /**
         * Сохранить
         */
        public async save() {
            this.parsePhones();

            await this.administratorPersonUpdate();

            if (this.personId === 0) {
                this.$router.push(`/administrator/person/${this.personState.person.id}`);
            }
            this.person = { ...this.personState.person };

            this.toggleHasWrite();
        }

        /**
         * Обработка телефонов
         */
        public parsePhones() {
            if (this.phonesState.phone.value !== '') {
                this.addPhone({});
                this.unsetPhone();
            }
            this.personState.person.phones = JSON.stringify(this.phonesState.phones);
        }

        /**
         * Вернуться к списку Физических лиц
         */
        public back() {
            this.$router.push('/administrator/persons/');
        }

        /**
         * Получить ТСЖ по адресу ФЛ
         */
        public async getTszhByAddress() {
            try {
                const res = await axios.get(`${baseUrlAPI}tszh/fias/${this.personState.person.address.fias_id}`);
                this.tszh = res.data !== '' ? { ...res.data } : false;
            } catch {
                // ...
            }
        }

        /**
         * Получить ТОС по адресу ФЛ
         */
        public async getTosByAddress() {
            try {
                const res = await axios.get(`${baseUrlAPI}tos/fias/${this.personState.person.address.fias_id}`);
                this.tos = res.data !== '' ? { ...res.data } : false;
            } catch {
                // ...
            }
        }

        get resolvedDate() {
            if (this.personState.person.date_of_birth) {
                const parseValue = this.personState.person.date_of_birth.split('-');
                return `${parseValue[2]}.${parseValue[1]}.${parseValue[0]}`;
            } else {
                return '';
            }
        }

        set resolvedDate(value) {
            const parseValue = value.split('.');
            this.personState.person.date_of_birth = `${parseValue[2]}-${parseValue[1]}-${parseValue[0]}`;
        }

        get resolvedDatePassport() {
            if (this.personState.person.passport_issued_when) {
                const parseValue = this.personState.person.passport_issued_when.split('-');
                return `${parseValue[2]}.${parseValue[1]}.${parseValue[0]}`;
            } else {
                return '';
            }
        }

        set resolvedDatePassport(value) {
            const parseValue = value.split('.');
            this.personState.person.passport_issued_when = `${parseValue[2]}-${parseValue[1]}-${parseValue[0]}`;
        }

        /**
         * ИД Физического лица
         */
        get personId() {
            return this.$route.params.id ? parseInt(this.$route.params.id, 10) : 0;
        }

        /**
         * Статус
         */
        get resolvedStatus() {
            return this.personState.person.status === 'vip';
        }
        set resolvedStatus(status) {
            this.personState.person.status = status === true ? 'vip' : null;
        }

        /**
         * Есть ли изменения в карточке
         */
        get hasChanges() {
            if (this.personId !== 0 && this.person.id === 0) {
                return false;
            }
            return !deepEqual(this.person, this.personState.person)
                || !deepEqual(this.person.phones, this.phonesState.phones);
        }

        /**
         * Включить/отключить режим редактирования
         */
        public toggleHasWrite() {
            this.hasWrite = !this.hasWrite;
        }

    }
</script>