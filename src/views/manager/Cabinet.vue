<template>
    <div class="manager-container manager-cabinet content modal-dialog-user">

        <h1>Профиль пользователя</h1>

        <div class="content" v-if="userState.user.person">

            <div class="row">
                <div class="col-2">
                    <b-button v-if="userState.user.person.photo" v-b-modal.imageModal>
                        <img :src="photoThumbnailSrc" class="photo"/>
                    </b-button>
                </div>
                <div class="col-10">

                    <div class="row bg">
                        <div class="col-3">Фамилия:</div>
                        <div class="col-9">{{ userState.user.person ? userState.user.person.lastname : '-' }}</div>
                    </div>

                    <div class="row">
                        <div class="col-3">Имя:</div>
                        <div class="col-9">{{ userState.user.person ? userState.user.person.firstname : '-' }}</div>
                    </div>

                    <div class="row bg">
                        <div class="col-3">Отчество:</div>
                        <div class="col-9">{{ userState.user.person ? userState.user.person.middlename : '-' }}</div>
                    </div>

                </div>
            </div>

            <div class="row bg">
                <div class="col-3">Адрес электронной почты:</div>
                <div class="col-9">{{ userState.user.email }}</div>
            </div>

            <div class="row">
                <div class="col-3">Роль пользователя:</div>
                <div class="col-9">{{ resolvedRole }}</div>
            </div>

            <div class="row" v-if="userState.user.contractor">
                <div class="col-3">Место работы:</div>
                <div class="col-9">{{ userState.user.contractor.name }}</div>
            </div>

            <div class="row bg" v-if="userState.user.person">
                <div class="col-3">Занимаемая должность:</div>
                <div class="col-9">{{ userState.user.person.post }}</div>
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

            <image-modal v-model="photoSrc"></image-modal>

        </div>

        <div class="content" v-else>
            <div class="alert alert-info">
                Для пользователя не задано Физическое Лицо
            </div>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrl} from '@/globals';
    import ImageModal from '@/components/common/ImageModal.vue';
    import UserState from '@/store/modules/user/types';

    @Component({
        components: { ImageModal },
    })
    export default class Desktop extends Vue {

        @State('user') public userState: UserState;

        @Action public logout: any;

        get resolvedRole() {
            return this.userState.user.role === 'superadmin' ? 'Администратор' : 'Управляющий';
        }

        get photoThumbnailSrc() {
            if (!this.userState.user.person) {
                return '/images/social.png';
            }
            return (this.userState.user.person.photo === '' || this.userState.user.person.photo === null) ?
                '/images/social.png' : `${baseUrl}/storage/${this.userState.user.person.photo}`;
        }

        get photoSrc() {
            if (!this.userState.user.person) {
                return '/images/social.png';
            }
            return (this.userState.user.person.photo === '' || this.userState.user.person.photo === null) ?
                '/images/social.png' : `${baseUrl}/storage/${this.userState.user.person.photo}`;
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
