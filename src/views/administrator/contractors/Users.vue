<template>
    <div class="manager-modules-container content">

        <h1>Пользователи контрагента "{{ contractorState.contractor.name }}"</h1>
        <button data-toggle="modal" data-target="#singleUserModal" @click="createUser()" class="btn btn-info">
            <i class="fas fa-plus-circle"></i>
            Создать нового
        </button>

        <button @click="$router.go(-1)" class="btn btn-info btn-right">
            <i class="fas fa-arrow-circle-left"></i>
            Назад
        </button>

        <!-- Список пользователей -->
        <div class="grid-data">
            <div class="row row-header">
                <div class="col-12">Адрес электронной почты (логин)</div>
            </div>
            <div class="row row-body" v-for="user in userState.users">
                <div class="col-12">
                    <label class="title">{{ user.email }}</label>
                    <div class="actions">
                        <button class="btn-info" data-toggle="modal" data-target="#singleUserModal" @click="administratorUserSetSingle(user)">Изменить</button>
                        <button class="btn-danger"data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(user)">Удалить</button>
                    </div>
                </div>
            </div>
            <div class="row row-footer">
                <div class="col-12">Адрес электронной почты (логин)</div>
            </div>
        </div>
        <!-- конец Список пользователей -->

        <single-user></single-user>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import ContractorState from '@/store/modules/administrator/contractor/types';
    import UserState from '@/store/modules/administrator/user/types';

    import SingleUser from '@/views/administrator/contractors/SingleUser.vue';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: {SingleUser, SureModal},
    })
    export default class Contractors extends Vue {

        @Action public administratorUserGetAllByContractor: any;
        @Action public setSureModal: any;
        @Action public administratorUserDelete: any;
        @Action public administratorUserSetSingle: any;
        @Action public administratorUserUnsetSingle: any;
        @Action public administratorContractorGetById: any;

        @State('administratorContractor') public contractorState: ContractorState;
        @State('administratorUser') public userState: UserState;

        @Watch('this.$route.params.id', { immediate: true, deep: true })
        public async onContractorIdChange() {
            await this.administratorUserGetAllByContractor({ contractorId: this.$route.params.id });
        }

        public async created() {
            await this.administratorContractorGetById({ id: this.$route.params.id });
        }

        /**
         * Регистрация нового пользователя
         */
        public createUser() {
            this.administratorUserUnsetSingle({ contractorId: this.$route.params.id });
        }

        /**
         * Выкинуть окно: "Вы уверены, что хотите удалить?"
         * @param user
         */
        public setSureModalContent(user: any) {
            this.setSureModal({
                title: 'Удалить пользователя?',
                text: `Вы уверены, что хотите удалить пользователя "${user.email}" из системы?`,
                action: async () => {
                    this.administratorUserSetSingle(user);
                    await this.administratorUserDelete();
                    this.administratorUserUnsetSingle({ contractorId: 0 });
                },
            });
        }

    }
</script>