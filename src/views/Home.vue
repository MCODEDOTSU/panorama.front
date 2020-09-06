<template>
    <div>
        <div class="home">
            <notifications></notifications>
            <div class="main">
                <a href="/" title="Панорама" class="logo"></a>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Email" v-model="user.email">
                    <input type="password" class="form-control" placeholder="Пароль" v-on:keyup.enter="login"
                           v-model="user.password">
                    <button id="login" @click="login" class="btn btn-lg btn-primary btn-block">
                        Войти <i class="fas fa-circle-notch fa-spin" v-show="isLoad"></i>
                    </button>
                </div>
            </div>
        </div>
        <footer class="app-footer">
            <div class="copyright">
                <p>Все права защищены © <span v-html="date.getFullYear()"></span></p>
                <p><a href="https://cityskills.ru/" title="Центр Муниципальных Компетенций">Центр Муниципальных
                    Компетенций</a></p>
                <p class="pink">Интеграционная платформа муниципалитетов</p>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import axios from 'axios';
    import {baseUrlAPI} from '@/globals';
    import {addAuthorizationHeader} from '@/domain/util/libraries/AxiosConfig';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
    import UserState from '@/store/modules/user/types';

    @Component({})
    export default class Home extends Vue {

        @Provide()
        public date = new Date();

        @Provide()
        public user = {
            email: '',
            password: '',
        };

        @Provide()
        public isLoad = false;

        @State('user') public userState!: UserState;
        @Action public getUser: any;

        public login() {

            this.isLoad = true;

            axios.post(`${baseUrlAPI}login`, this.user).then((response) => {
                this.userState.token = 'Bearer ' + response.data.access_token;
                this.userState.role = response.data.role;
                addAuthorizationHeader(this.userState);
                this.getUser();
                this.isLoad = false;
            }).catch((error) => {
                if (error.response && error.response.status === 401) {
                    ErrorNotifier.notifyWithCustomMessage('Аутентификация не удалась: неверное имя пользователя или пароль');
                } else if (error.response && error.response.data.msg) {
                    ErrorNotifier.notifyWithCustomMessage(error.response.data.msg);
                } else if (error.message) {
                    ErrorNotifier.notifyWithCustomMessage(error.message);
                } else {
                    ErrorNotifier.notifyWithCustomMessage('Аутентификация не удалась: неизвестная ошибка');
                }
                this.user.password = '';
                this.isLoad = false;
            });
        }

    }
</script>
