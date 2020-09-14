<template>

    <b-modal id="singlePersonModal" size="xl"
             :title="personState.person.id === 0 ? 'Создание нового Физического Лица' :
             `Изменение Физического Лица: ${personState.person.lastname} ${personState.person.firstname}`">

        <b-container>

            <div>

                    <div class="row">

                        <div class="col-2">

                            <div class="form-group file-upload">
                                <img :src="photoSrc" class="photo" @click="$refs.photo.click()"/>
                                <input type="file" ref="photo" class="form-control-file" @change="uploadPhoto"
                                       accept="image/jpeg,image/png,image/gif"/>
                                <button v-if="photoSrc !== ''" @click="deletePhoto()">&times;</button>
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
                                                    format="yyyy-MM-dd"
                                                    :input-class="'form-control'"
                                                    v-model="personState.person.date_of_birth"
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

                        <div class="col-4">

                            <div class="form-group">
                                <label for="singlePersonAddressRegion">Регион</label>
                                <select id="singlePersonAddressRegion" class="form-control" v-model="resolvedRegion">
                                    <option v-for="region in regionState.regions" :value="region.id">
                                        {{ region.id < 10 ? `0${region.id}` : region.id }}: {{ region.name }}
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div class="col-4">

                            <div class="form-group">
                                <label for="singlePersonAddressDistrict">Район</label>
                                <input type="text" id="singlePersonAddressDistrict"
                                       class="form-control"
                                       v-model="resolvedDistrict">
                            </div>

                        </div>

                        <div class="col-4">

                            <div class="form-group">
                                <label for="singlePersonAddressCity">Город (поселок, село)</label>
                                <input type="text" id="singlePersonAddressCity"
                                       class="form-control"
                                       placeholder="г. Астрахань"
                                       v-model="resolvedCity">
                            </div>

                        </div>

                        <div class="col-8">

                            <div class="form-group">
                                <label for="singlePersonAddressStreet">Улица (переулок)</label>
                                <input type="text" id="singlePersonAddressStreet"
                                       class="form-control"
                                       placeholder="ул. Красная Набережная"
                                       v-model="resolvedStreet">
                            </div>

                        </div>

                        <div class="col-4">

                            <div class="form-group">
                                <label for="singlePersonAddressBuild">Дом (строение)</label>
                                <input type="text" id="singlePersonAddressBuild"
                                       class="form-control"
                                       v-model="resolvedBuild">
                            </div>

                        </div>

                    </div>

                    <phones></phones>

                    <note></note>

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

    import PersonState from '@/store/modules/administrator/person/types';
    import RegionState from '@/store/modules/region/types';
    import UserState from '@/store/modules/user/types';

    import {ru} from 'vuejs-datepicker/dist/locale';
    import Datepicker from 'vuejs-datepicker';
    import Phones from '@/views/administrator/persons/Phones.vue';
    import Note from '@/views/administrator/persons/Note.vue';

    @Component({
        components: { Datepicker, Phones, Note },
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

        public async created() {
            await this.getRegions();
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

        get photoSrc() {
            return (this.personState.person.photo === '' || this.personState.person.photo === null) ?
                '/images/social.png' : this.personState.person.photo;
        }

        get resolvedRegion() {
            if (this.personState.person.address  === null) {
                return 0;
            }
            return (this.personState.person.address.region_id === 0 || this.personState.person.address.region_id === null) ?
                0 : this.personState.person.address.region_id;
        }

        set resolvedRegion(regionId: number) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.personState.person.address.region_id = regionId;
        }

        get resolvedDistrict() {
            if (this.personState.person.address  === null) {
                return '';
            }
            return (this.personState.person.address.district === '' || this.personState.person.address.district === null) ?
                '' : this.personState.person.address.district;
        }

        set resolvedDistrict(district: string) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.personState.person.address.district = district;
        }

        get resolvedCity() {
            if (this.personState.person.address  === null) {
                return '';
            }
            return (this.personState.person.address.city === '' || this.personState.person.address.city === null) ?
                '' : this.personState.person.address.city;
        }

        set resolvedCity(city: string) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.personState.person.address.city = city;
        }

        get resolvedStreet() {
            if (this.personState.person.address  === null) {
                return '';
            }
            return (this.personState.person.address.street === '' || this.personState.person.address.street === null) ?
                '' : this.personState.person.address.street;
        }

        set resolvedStreet(street: string) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
            }
            this.personState.person.address.street = street;
        }

        get resolvedBuild() {
            if (this.personState.person.address  === null) {
                return '';
            }
            return (this.personState.person.address.build === '' || this.personState.person.address.build === null) ?
                '' : this.personState.person.address.build;
        }

        set resolvedBuild(build: string) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0};
            }
            this.personState.person.address.build = build;
        }

        public save() {
            this.administratorPersonUpdate({ username: this.userState.user.email });
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

    }
</script>