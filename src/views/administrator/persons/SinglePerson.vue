<template>

    <b-modal id="singlePersonModal" size="xl"
             :title="personState.person.id === 0 ? 'Создание нового Физического Лица' :
             `Изменение Физического Лица: ${personState.person.lastname} ${personState.person.firstname}`">

        <b-container>

            <div>

                <div class="row">

                    <div class="col-2">

                        <div class="form-group file-upload">
                            <b-button v-if="personState.person.photo !== ''" v-b-modal.imageModal>
                                <img :src="photoThumbnailSrc" class="photo"/>
                            </b-button>
                            <img v-else :src="photoThumbnailSrc" class="photo" @click="$refs.photo.click()"/>
                            <input type="file" ref="photo" class="form-control-file" @change="uploadPhoto"
                                   accept="image/jpeg,image/png,image/gif"/>
                            <button v-if="photoThumbnailSrc !== ''" @click="deletePhoto()">&times;</button>
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
                                           v-model="personState.person.lastname">
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="singlePersonFirstname">Имя *</label>
                                    <input type="text" id="singlePersonFirstname" required
                                           class="form-control"
                                           placeholder="Имя"
                                           v-model="personState.person.firstname">
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="singlePersonMiddlename">Отчество</label>
                                    <input type="text" id="singlePersonMiddlename"
                                           class="form-control"
                                           placeholder="Отчество"
                                           v-model="personState.person.middlename">
                                </div>
                            </div>

                        </div>

                        <div class="row">

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="singlePersonDateOfBirth">Дата рождения</label>
                                    <datepicker id="singlePersonDateOfBirth"
                                                format="dd.MM.yyyy"
                                                :input-class="'form-control'"
                                                v-model="resolvedDate"
                                                placeholder="Дата Рождения"
                                                :language="ru" :typeable="true">
                                    </datepicker>
                                </div>
                            </div>

                            <div class="col-8">
                                <div class="form-group">
                                    <label for="singlePersonPost">Должность</label>
                                    <input type="text" id="singlePersonPost"
                                           class="form-control"
                                           placeholder="Должность"
                                           v-model="personState.person.post">
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
                                    :query="personState.person.address ? personState.person.address.unrestricted_value : ''"
                                    :token="dadataApiKey"
                            ></vue-dadata>
                            <span class="form-group-info" v-if="tszh">
                                По данному адресу найдено ТСЖ <b>"{{ tszh.name }}"</b>. Физическое лицо автоматически будет привязано к данному ТСЖ
                            </span>
                        </div>
                    </div>
                </div>

                <phones></phones>

                <note></note>

                <div class="row">
                    <div class="col-2">
                        <div class="form-group">
                            <label for="singlePersonPassportSeries">Серия паспорта</label>
                            <input type="text" id="singlePersonPassportSeries"
                                   class="form-control"
                                   placeholder="Серия"
                                   v-model="personState.person.passport_series">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <label for="singlePersonPassportNumber">Номер паспорта</label>
                            <input type="text" id="singlePersonPassportNumber"
                                   class="form-control"
                                   placeholder="Номер"
                                   v-model="personState.person.passport_number">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="form-group">
                            <label for="singlePersonPassportPassportIssuedBy">Выдан кем</label>
                            <input type="text" id="singlePersonPassportPassportIssuedBy"
                                   class="form-control"
                                   placeholder="Выдан кем"
                                   v-model="personState.person.passport_issued_by">
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <label for="singlePersonPassportPassportIssuedWhen">Выдан когда</label>
                            <datepicker id="singlePersonPassportPassportIssuedWhen"
                                        format="dd.MM.yyyy"
                                        :input-class="'form-control'"
                                        v-model="resolvedDatePassport"
                                        placeholder="Выдан когда"
                                        :language="ru" :typeable="true">
                            </datepicker>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-group">
                            <label for="singlePersonPassportDepartmentNumber">Номер подразделения</label>
                            <input type="text" id="singlePersonPassportDepartmentNumber"
                                   class="form-control"
                                   placeholder="Номер подразделения"
                                   v-model="personState.person.passport_department_number">
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
                                   v-model="personState.person.own">
                            </textarea>
                        </div>
                    </div>
                </div>

            </div>

            <image-modal v-model="photoSrc"></image-modal>

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

    import {Provide, Watch, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrl, baseUrlAPI, dadataApiKey} from '@/globals';
    import axios from 'axios';

    import PersonState from '@/store/modules/administrator/person/types';
    import RegionState from '@/store/modules/region/types';
    import UserState from '@/store/modules/user/types';

    import {ru} from 'vuejs-datepicker/dist/locale';
    import Datepicker from 'vuejs-datepicker';
    import Phones from '@/views/administrator/persons/Phones.vue';
    import Note from '@/views/administrator/persons/Note.vue';
    import ImageModal from '@/components/common/ImageModal.vue';

    @Component({
        components: { Datepicker, Phones, Note, ImageModal },
    })
    export default class SinglePerson extends Vue {

        @Action public administratorPersonUpdate: any;
        @Action public administratorPersonUploadPhoto: any;
        @Action public getRegions: any;

        @State('administratorPerson') public personState: PersonState;
        @State('region') public regionState: RegionState;
        @State('user') public userState!: UserState;

        @Provide() private ru: any = ru;
        @Provide() private phone = { type: 'Мобильный', value: '' };
        @Provide() private dadataApiKey = dadataApiKey;
        @Provide() private tszh = false;

        @Watch('personState.person.address', {deep: true})
        public onChangePersonAddress() {
            this.tszh = false;
            if (this.personState.person.address && this.personState.person.address.fias_id) {
                this.getTszhByAddress();
            }
        }

        public uploadPhoto() {
            const $fileInput: HTMLInputElement = (this.$refs.photo as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.administratorPersonUploadPhoto({file});
        }

        public deletePhoto() {
            this.personState.person.photo = '';
        }

        get photoThumbnailSrc() {
            return (this.personState.person.photo === '' || this.personState.person.photo === null) ?
                '/images/social.png' : `${baseUrl}/storage/${this.personState.person.photo}`;
        }

        get photoSrc() {
            return (this.personState.person.photo === '' || this.personState.person.photo === null) ?
                '/images/social.png' : `${baseUrl}/storage/${this.personState.person.photo}`;
        }

        public changeAddress(address) {
            this.personState.person.address = { ...address.data, unrestricted_value: address.unrestricted_value };
        }

        public save() {
            const username = this.userState.user.person !== null ? ` (${this.userState.user.person.post}, ${this.userState.user.person.lastname}
                ${this.userState.user.person.firstname} ${this.userState.user.person.middlename})` : '';
            this.administratorPersonUpdate({ username });
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

        public async getTszhByAddress() {
            try {
                const res = await axios.get(`${baseUrlAPI}tszh/fias/${this.personState.person.address.fias_id}`);
                this.tszh = res.data !== "" ? { ...res.data } : false;
            } catch { }
        }

        get resolvedDate() {
            if (this.personState.person.date_of_birth) {
                return this.personState.person.date_of_birth;
            } else {
                return '';
            }
        }

        set resolvedDate(value) {
            const date = new Date(value);
            this.personState.person.date_of_birth = value;
        }

        get resolvedDatePassport() {
            if (this.personState.person.passport_issued_when) {
                return this.personState.person.passport_issued_when;
            } else {
                return '';
            }
        }

        set resolvedDatePassport(value) {
            const date = new Date(value);
            this.personState.person.passport_issued_when = value;
        }

    }
</script>