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

                <div class="alert alert-info">
                    Дополнительная информация о пользователе будет отображаться в его личном кабинете при входе
                    в систему
                </div>

                <div class="form-group file-upload">
                    <img :src="getPhotoSrc()" class="photo" @click="$refs.photo.click()"/>
                    <input type="file" ref="photo" class="form-control-file" @change="uploadPhoto"
                           accept="image/jpeg,image/png,image/gif"/>
                    <button v-if="this.userState.user.photo !== '' && this.userState.user.photo !== null" @click="deletePhoto()">
                        &times;
                    </button>
                </div>

                <div class="form-group right-group">

                    <div class="form-group">
                        <label for="singleUserPerson">Физическое лицо</label>
                        <input type="text" id="singleUserPerson"
                               class="form-control"
                               v-model="userState.user.person_id">
                    </div>

                    <div class="form-group">
                        <label for="singleUserPost">Занимаемая должность</label>
                        <input type="text" id="singleUserPost"
                               class="form-control"
                               v-model="userState.user.post">
                    </div>

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
    import UserState from '@/store/modules/administrator/user/types';
    import Form from 'bootstrap-vue/esm/mixins/form';

    @Component({ components: { Form } })
    export default class SingleUser extends Vue {

        @Action public administratorUserUpdate: any;
        @Action public administratorUserUploadPhoto: any;

        @State('administratorUser') public userState: UserState;

        public getPhotoSrc() {
            return (this.userState.user.photo === '' || this.userState.user.photo === null) ? '/images/social.png' : this.userState.user.photo;
        }

        public uploadPhoto() {
            const $fileInput: HTMLInputElement = (this.$refs.photo as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.administratorUserUploadPhoto({file});
        }

        public deletePhoto() {
            this.userState.user.photo = '';
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

    }
</script>
