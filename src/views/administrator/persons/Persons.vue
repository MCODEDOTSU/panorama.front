<template>
    <div class="manager-container content">

        <h1>Справочник физических лиц</h1>

        <b-button v-b-modal.singlePersonModal @click="administratorPersonUnsetSingle" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать
        </b-button>

        <!-- Список физических лиц -->

        <div class="grid-data">

            <div class="row row-header">
                <div class="col-3">Фамилия</div>
                <div class="col-3">Имя</div>
                <div class="col-3">Отчество</div>
                <div class="col-1">Дата рождения</div>
                <div class="col-1">Телефоны</div>
                <div class="col-1">Заметка</div>
            </div>

            <div class="row row-body" v-for="person in personState.persons">
                <div class="col-3">
                    <label class="title">{{ person.lastname }}</label>
                    <div class="actions">
                        <b-button v-b-modal.singlePersonModal @click="administratorPersonSetSingle(person)" variant="info">
                            Изменить
                        </b-button>
                        <button class="btn-danger" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(person)">Удалить</button>
                    </div>
                </div>
                <div class="col-3"><label class="title">{{ person.firstname }}</label></div>
                <div class="col-3"><label class="title">{{ person.middlename }}</label></div>
                <div class="col-1"><label class="title">{{ person.date_of_birth }}</label></div>
                <div class="col-1"><label class="title">{{ person.phones }}</label></div>
                <div class="col-1"><label class="title">{{ person.note }}</label></div>
            </div>

            <div class="row row-footer">
                <div class="col-3">Фамилия</div>
                <div class="col-3">Имя</div>
                <div class="col-3">Отчество</div>
                <div class="col-1">Дата рождения</div>
                <div class="col-1">Телефоны</div>
                <div class="col-1">Заметка</div>
            </div>

        </div>
        <!-- конец Список контрагентов -->

        <single-person></single-person>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import PersonState from '@/store/modules/administrator/person/types';

    import SinglePerson from '@/views/administrator/persons/SinglePerson.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SinglePerson, SureModal},
    })
    export default class Persons extends Vue {

        @Action public administratorPersonGetAll: any;
        @Action public setSureModal: any;
        @Action public administratorPersonDelete: any;
        @Action public administratorPersonSetSingle: any;
        @Action public administratorPersonUnsetSingle: any;

        @State('administratorPerson') public personState: PersonState;

        public async created() {
            await this.administratorPersonGetAll();
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param person
         */
        public setSureModalContent(person: any) {
            this.setSureModal({
                title: 'Удалить физическое лицо?',
                text: `Вы уверены, что хотите удалить физическое лицо "${person.lastname} ${person.firstname}" из системы?`,
                action: async () => {
                    this.administratorPersonSetSingle(person);
                    await this.administratorPersonDelete();
                    this.administratorPersonUnsetSingle();
                },
            });
        }

    }
</script>