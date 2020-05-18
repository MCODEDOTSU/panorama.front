<template>
    <div class="manager-container manager-cabinet content modal-dialog-user">

        <h1>Профиль пользователя</h1>

        <div class="content">

            <div class="row bg">
                <div class="col-3">Адрес электронной почты:</div>
                <div class="col-9">{{ userState.user.email }}</div>
            </div>

            <div class="row">
                <div class="col-3">Роль пользователя:</div>
                <div class="col-9">{{ resolvedRole }}</div>
            </div>

            <div class="row">
                <div class="col-2"><img :src="resolvedPhotoSrc" class="photo"/></div>
                <div class="col-10">

                    <div class="row bg">
                        <div class="col-3">Фамилия:</div>
                        <div class="col-9">{{ userState.user.lastname }}</div>
                    </div>

                    <div class="row">
                        <div class="col-3">Имя:</div>
                        <div class="col-9">{{ userState.user.firstname }}</div>
                    </div>

                    <div class="row bg">
                        <div class="col-3">Отчество:</div>
                        <div class="col-9">{{ userState.user.middlename }}</div>
                    </div>

                </div>
            </div>

            <div class="row" v-if="userState.user.contractor">
                <div class="col-3">Место работы:</div>
                <div class="col-9">{{ userState.user.contractor.name }}</div>
            </div>

            <div class="row bg" v-if="userState.user.contractor">
                <div class="col-3">Занимаемая должность:</div>
                <div class="col-9">{{ userState.user.post }}</div>
            </div>

            <div class="row" v-if="userState.user.contractor">
                <div class="col-2"><img :src="resolvedLogoSrc" class="photo"/></div>
                <div class="col-10">

                    <div class="row">
                        <div class="col-3">Полное наименование:</div>
                        <div class="col-9">{{ userState.user.contractor.full_name }}</div>
                    </div>

                    <div class="row bg">
                        <div class="col-3">ИНН:</div>
                        <div class="col-9">{{ userState.user.contractor.inn }}</div>
                    </div>

                    <div class="row">
                        <div class="col-3">КПП:</div>
                        <div class="col-9">{{ userState.user.contractor.kpp }}</div>
                    </div>

                    <div class="row bg">
                        <div class="col-3">Адрес:</div>
                        <div class="col-9">{{ resolvedAddress }}</div>
                    </div>

                </div>
            </div>

            <div class="row cabinet-actions">
                <div class="col-12">
                    <router-link class="nav-link btn btn-primary" to="/manager/gis" tag="button">
                        Перейти к редактору карты
                    </router-link>
                    <button @click="logout" title="Выйти из Системы" class="btn btn btn-warning">
                        Выйти из системы
                    </button>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import UserState from '@/store/modules/user/types';

    @Component({
        components: {},
    })
    export default class Desktop extends Vue {

        @State('user') public userState: UserState;

        @Action public logout: any;

        get resolvedRole() {
            return this.userState.user.role === 'superadmin' ? 'Администратор' : 'Управляющий';
        }

        get resolvedPhotoSrc() {
            return (this.userState.user.photo === '' || this.userState.user.photo === null) ?
                '/images/social.png' : this.userState.user.photo;
        }

        get resolvedLogoSrc() {
            return (this.userState.user.contractor.logo === '' || this.userState.user.contractor.logo === null) ?
                '/images/logo.png' : this.userState.user.contractor.logo;
        }

        get resolvedAddress() {

            const address = this.userState.user.contractor_address;

            if (address === null || address === undefined) {
                return '';
            }

            const result = [];

            if (address.index !== null && address.index !== '') {
                result.push(address.index);
            }

            if (address.city !== null && address.city !== '') {
                result.push(address.city);
            }

            if (address.street !== null && address.street !== '') {
                result.push(address.street);
            }

            if (address.build !== null && address.build !== '') {
                result.push(address.build);
            }

            return result.join(', ');

        }
    }

</script>
