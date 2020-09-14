<template>
    <div class="top-menu">
        <div class="top-menu-left">
            <div class="contractor-logo top-menu-item" v-if="userState.user.contractor !== null && userState.user.contractor !== undefined">
                <img v-if="userState.user.contractor.logo !== '' && userState.user.contractor.logo !== null" :src="userState.user.contractor.logo" />
                <img v-else src="/images/logo-24.png" />
            </div>
            <div class="contractor-name top-menu-item" v-if="userState.user.contractor !== null && userState.user.contractor !== undefined">
                <label>{{ userState.user.contractor.name }}</label>
            </div>
        </div>
        <div class="top-menu-right">
            <div class="person-photo top-menu-item" v-if="userState.user.person !== null && userState.user.person !== undefined">
                <img v-if="userState.user.person.photo !== '' && userState.user.person.photo !== null" :src="userState.user.person.photo" />
                <img v-else src="/images/social-24.png" />
            </div>
            <div class="person-name top-menu-item" v-if="userState.user.person !== null && userState.user.person !== undefined">
                <router-link to="/manager/cabinet" tag="label" class="nav-link" title="Профиль пользователя">
                    {{ userState.user.person.lastname }} {{ userState.user.person.firstname }} {{ userState.user.person ? userState.user.person.middlename : '' }}
                </router-link>
            </div>
            <div class="person-post top-menu-item" v-if="userState.user.person !== null && userState.user.person !== undefined">
                <label>{{ userState.user.person ? `(${userState.user.person.post})` : '' }}</label>
            </div>
            <div class="person-logout top-menu-item">
                <button @click="logout" title="Выйти из Системы" class="btn btn-link">
                    <i class="fa fa-sign-out"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State, Action} from 'vuex-class';
    import UserState from '@/store/modules/user/types';
    @Component({})
    export default class TopMenu extends Vue {
        @State('user') public userState!: UserState;
        @Action public logout: any;
    }
</script>