<template>
    <div class="home">
        <notifications></notifications>
        <div class="main">
            <a href="/" title="Панорама" class="logo"></a>
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Email" v-model="user.email">
                <input type="password" class="form-control" placeholder="Пароль" v-on:keyup.enter="login" v-model="user.password">
                <button @click="login" class="btn btn-lg btn-primary btn-block">Войти</button>
            </div>
        </div>
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
        public user = {
            email: '',
            password: '',
        };

        @State('user') public userState!: UserState;
        @Action public getUser: any;

        public login() {
            axios.post(`${baseUrlAPI}login`, this.user).then((response) => {
                this.userState.token = 'Bearer ' + response.data.access_token;
                this.userState.role = response.data.role;
                addAuthorizationHeader(this.userState);
                this.getUser();
            }).catch((error) => {
                if (error.response.status === 401) {
                    ErrorNotifier.notifyWithCustomMessage('Аутентификация не удалась: неверное имя пользователя или пароль');
                } else {
                    ErrorNotifier.notifyWithCustomMessage(error.data.message);
                }
                this.user.password = '';
            });
        }

    }
</script>
