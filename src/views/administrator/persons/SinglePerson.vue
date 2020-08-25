<template>

    <b-modal id="singlePersonModal" size="xl"
             :title="personState.person.id === 0 ? 'Создание нового Физического Лица' :
             `Изменение Физического Лица: ${personState.person.lastname} ${personState.person.firstname}`">

        <b-container>

            <form class="modal-dialog-person">

                <form>

                    <div class="form-group">
                        <label for="singlePersonLastname">Фамилия *</label>
                        <input type="text" id="singlePersonLastname" required
                               class="form-control"
                               placeholder="Фамилия"
                               v-model="personState.person.lastname">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonFirstname">Имя *</label>
                        <input type="text" id="singlePersonFirstname" required
                               class="form-control"
                               placeholder="Имя"
                               v-model="personState.person.firstname">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonMiddlename">Отчество</label>
                        <input type="text" id="singlePersonMiddlename"
                               class="form-control"
                               placeholder="Отчество"
                               v-model="personState.person.middlename">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonDateOfBirth">Дата рождения</label>
                        <datepicker id="singlePersonDateOfBirth"
                                    :input-class="'form-control'"
                                    v-model="personState.person.date_of_birth"
                                    placeholder="Дата Рождения"
                                    :language="ru">
                        </datepicker>
                    </div>

                    <div class="form-group">
                        <label for="singlePersonPhones">Телефоны</label>
                        <textarea id="singlePersonPhones"
                               class="form-control"
                               placeholder="Телефоны"
                               v-model="personState.person.phones">
                        </textarea>
                    </div>

                    <div class="form-group">
                        <label for="singlePersonAddressCity">Город контрагента</label>
                        <input type="text" id="singlePersonAddressCity"
                               class="form-control"
                               placeholder="г. Астрахань"
                               v-model="resolvedCity">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonAddressStreet">Улица</label>
                        <input type="text" id="singlePersonAddressStreet"
                               class="form-control"
                               placeholder="ул. Красная Набережная"
                               v-model="resolvedStreet">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonAddressBuild">Дом, строение</label>
                        <input type="text" id="singlePersonAddressBuild"
                               class="form-control"
                               v-model="resolvedBuild">
                    </div>

                    <div class="form-group">
                        <label for="singlePersonNotes">Примечание</label>
                        <textarea id="singlePersonNotes"
                                  class="form-control"
                                  placeholder="Примечание"
                                  v-model="personState.person.notes">
                        </textarea>
                    </div>

                </form>

            </form>

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

    import {ru} from 'vuejs-datepicker/dist/locale';
    import Datepicker from 'vuejs-datepicker';

    @Component({
        components: { Datepicker },
    })
    export default class SinglePerson extends Vue {

        @Action public administratorPersonUpdate: any;
        @Action public administratorPersonUploadLogo: any;

        @State('administratorPerson') public personState: PersonState;

        @Provide() private ru: any = ru;

        get resolvedCity() {
            if (this.personState.person.address  === null) {
                return '';
            }
            return (this.personState.person.address.city === '' || this.personState.person.address.city === null) ?
                '' : this.personState.person.address.city;
        }

        set resolvedCity(city: string) {
            if (this.personState.person.address  === null) {
                this.personState.person.address = { id: 0, city: '', street: '', build: '', region: ''};
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
                this.personState.person.address = { id: 0, city: '', street: '', build: '', region: ''};
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
                this.personState.person.address = { id: 0, city: '', street: '', build: '', region: ''};
            }
            this.personState.person.address.build = build;
        }

        public save() {
            this.administratorPersonUpdate();
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singlePersonModal');
        }

    }
</script>