<template>
    <div class="manager-container content">

        <h1>Пользователи контрагента "{{ contractorState.contractor.name }}"</h1>

        <b-button v-b-modal.singleUserModal @click="createUser" variant="info">
            <i class="fas fa-plus-circle"></i>
            Создать нового
        </b-button>

        <button @click="excelExport" class="btn btn-info">
            <i class="fa fa-floppy-o"></i>
            Выгрузить в Excel
        </button>

        <button @click="$router.go(-1)" class="btn btn-info btn-right">
            <i class="fas fa-arrow-circle-left"></i>
            Назад
        </button>

        <!-- Список -->
        <vue-table-dynamic :params="users" v-on:cell-click="showSingleUserModal" ref="userTable">
            <template v-slot:column-6="{ props }">
                <b-button v-b-modal.singleUserModal @click="userSetSingle(props.cellData)" variant="default">
                    Изменить
                </b-button>
                <button class="btn btn-default" data-toggle="modal" data-target="#sureModal" @click="setSureModalContent(props.cellData)">
                    Удалить
                </button>
            </template>
        </vue-table-dynamic>
        <!-- конец Список -->

        <single-user></single-user>

        <sure-modal></sure-modal>

    </div>
</template>
<script lang="ts">

    import {Component, Vue, Watch, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import ContractorState from '@/store/modules/administrator/contractor/types';
    import UserState from '@/store/modules/administrator/user/types';

    import SingleUser from '@/views/administrator/contractors/SingleUser.vue';
    import SureModal from '@/components/common/SureModal.vue';
    import IUser from '@/domain/interfaces/IUser';

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

        @Provide() public users = {
            data: [],
            header: 'row', stripe: true, enableSearch: true,
            sort: [0, 1, 2, 3, 4, 5],
        };
        @Provide() private tableIdIndex = 6;

        @Watch('userState.users', {deep: true})
        public onUsers() {
            this.users.data = [ ['Фамилия', 'Имя', 'Отчество', 'Логин', 'Должность', 'Роль', ''] ];
            this.userState.users.forEach((item, i) => {
                this.users.data.push([
                    item.person ? item.person.lastname : '',
                    item.person ? item.person.firstname : '',
                    item.person ? item.person.middlename : '',
                    item.email,
                    item.post,
                    this.resolvedRole(item),
                    item.id.toString(),
                ]);
            });
        }

        @Watch('this.$route.params.id', { immediate: true, deep: true })
        public async onContractorIdChange() {
            await this.administratorUserGetAllByContractor({ contractorId: this.$route.params.id });
        }

        /**
         * При создании компонента
         */
        public async created() {
            await this.administratorContractorGetById({ id: this.$route.params.id });
        }

        /**
         * Выбрать Пользователя
         * @param userId
         */
        public userSetSingle(userId: any) {
            const user = arrayFindFirst(this.userState.users, parseInt(userId, 10));
            this.administratorUserSetSingle(user);
        }

        /**
         * Открыть модальное окно для изменения Пользователя
         * @param rowIndex
         * @param columnIndex
         * @param data
         */
        public showSingleUserModal(rowIndex, columnIndex, data) {

            if (columnIndex === this.tableIdIndex) {
                return;
            }

            const userTable: HTMLElement = this.$refs.userTable as HTMLElement;
            if (!userTable) {
                return;
            }

            // @ts-ignore
            const id = userTable.tableData.rows[rowIndex].cells[this.tableIdIndex].data;
            this.userSetSingle(id);
            // @ts-ignore
            this.$bvModal.show('singleUserModal');
        }

        /**
         * Регистрация нового пользователя
         */
        public createUser() {
            this.administratorUserUnsetSingle({ contractorId: this.$route.params.id });
        }

        /**
         * Открыть диалог удаления ТОС
         * @param userId
         */
        public setSureModalContent(userId: any) {
            const user = arrayFindFirst(this.userState.users, parseInt(userId, 10));
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

        /**
         * Экспорт таблицы в EXCEL
         */
        public excelExport() {

            const userTable: HTMLElement = this.$refs.userTable as HTMLElement;
            if (!userTable) {
                return;
            }

            // @ts-ignore
            const td = userTable.tableData;

            if (!td || !td.activatedRows) {
                return;
            }

            // @ts-ignore
            const data = td.activatedRows.map((row, i) => {
                const firstCell = i === 0 ? '№ п/п' : i;
                return [ firstCell ].concat(row.cells.map((cell, j) => {
                    if (j !== this.tableIdIndex) {
                        return (j + 1) < row.cells.length ? cell.data : false;
                    }
                }));
            });

            axios.post(`${baseUrlAPI}export/excel`, { data }).then((response) => {
                window.open(`${baseUrl}${response.data}`);
            });
        }

        /**
         * Роль пользователя в системе
         */
        public resolvedRole(user: IUser) {
            return user.role === 'admin' ? 'Управляющий' : 'Администратор';
        }

    }
</script>