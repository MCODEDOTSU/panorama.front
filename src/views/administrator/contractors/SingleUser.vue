<template>
    <!-- Modal -->
    <div class="modal fade modal-dialog-user" id="singleUserModal" tabindex="-1" role="dialog"
         aria-labelledby="singleUserModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="singleUserModalLabel">
                        <span v-if="userState.user.id === 0">Регистрация пользователя</span>
                        <span v-else>Изменение пользователя "{{ userState.user.email }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <form>

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
                                <label for="singleUserLastname">Фамилия</label>
                                <input type="text" id="singleUserLastname"
                                       class="form-control"
                                       v-model="userState.user.lastname">
                            </div>

                            <div class="form-group">
                                <label for="singleUserFirstname">Имя</label>
                                <input type="text" id="singleUserFirstname"
                                       class="form-control"
                                       v-model="userState.user.firstname">
                            </div>

                        </div>

                        <div class="form-group">
                            <label for="singleUserMiddlename">Отчество</label>
                            <input type="text" id="singleUserMiddlename"
                                   class="form-control"
                                   v-model="userState.user.middlename">
                        </div>

                        <div class="form-group">
                            <label for="singleUserPost">Занимаемая должность</label>
                            <input type="text" id="singleUserPost"
                                   class="form-control"
                                   v-model="userState.user.post">
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

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="administratorUserUpdate" data-dismiss="modal">
                        Сохранить
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import UserState from '@/store/modules/administrator/user/types';

    @Component({})
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

    }
</script>
