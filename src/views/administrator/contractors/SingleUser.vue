<template>

    <b-modal id="singleUserModal" size="xl"
             :title="userState.user.id === 0 ? 'Регистрация пользователя' :
             `Изменение пользователя: ${userState.user.email}`">

        <b-container>

            <form class="modal-dialog-user">

                <div class="form-group">
                    <label for="singleUserEmail">Адрес электронной почты *</label>
                    <input type="email" id="singleUserEmail" required
                           class="form-control"
                           placeholder="user@mail.ru"
                           v-model="userState.user.email">
                </div>

                <div class="form-group">
                    <label for="singleUserRole">Роль пользователя</label>
                    <select id="singleUserRole" class="form-control" v-model="userState.user.role">
                        <option value="admin">Управляющий</option>
                        <option value="superadmin">Администратор</option>
                    </select>
                </div>

                <div class="form-group">
                    <awesome-selector title="Физическое лицо" id="singleUserPerson"
                                      :list="resolvedPersons"
                                      v-model="resolvedPerson" v-on:onchange="personChange">
                    </awesome-selector>
                </div>

                <div class="alert alert-info">
                    Если вы не хотите изменять пароль пользователя, оставьте поле "Пароль" пустым
                </div>

                <div class="form-group">
                    <label for="singleUserPassword">Пароль *</label>
                    <input type="password" id="singleUserPassword" required
                           class="form-control"
                           v-model="userState.user.password">
                </div>

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

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import PersonState from '@/store/modules/administrator/person/types';
    import UserState from '@/store/modules/administrator/user/types';
    import Form from 'bootstrap-vue/esm/mixins/form';
    import AwesomeSelector from '@/components/utils/awesomeSelector/AwesomeSelector.vue';

    @Component({ components: { Form, AwesomeSelector } })
    export default class SingleUser extends Vue {

        @Action public administratorUserUpdate: any;
        @Action public administratorPersonGetAll: any;

        @State('administratorUser') public userState: UserState;
        @State('administratorPerson') public personState: PersonState;

        public created() {
            this.administratorPersonGetAll();
        }

        public personChange(item) {
            this.userState.user.person_id = item.id !== 0 ? item.id : null;
            this.resolvedPerson = item;
        }

        public save() {
            this.administratorUserUpdate();
            // @ts-ignore
            this.$bvModal.hide('singleUserModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singleUserModal');
        }

        get resolvedPersons() {
            return this.personState.persons.map((item) => {
                return {
                    id: item.id,
                    title: `${item.lastname} ${item.firstname} ${item.middlename}`,
                };
            });
        }

        get resolvedPerson() {
            return (this.userState.user.person === null || this.userState.user.person === undefined) ? {
                    id: 0,
                    title: '',
                } : {
                    id: this.userState.user.person.id,
                    title: `${this.userState.user.person.lastname} ${this.userState.user.person.firstname} ${this.userState.user.person.middlename}`,
                };
        }

        set resolvedPerson(item) {
            const title = item.title.split(' ');
            this.userState.user.person = item.id !== 0 ? {
                id: item.id,
                firstname: title[1] !== undefined ? title[1] : '',
                lastname: title[0] !== undefined ? title[0] : '',
                middlename: title[2] !== undefined ? title[2] : '',
                fias_address_id: null,
            } : {
                id: 0,
                firstname: '',
                lastname: '',
                middlename: '',
                fias_address_id: null,
            };
        }

    }
</script>
