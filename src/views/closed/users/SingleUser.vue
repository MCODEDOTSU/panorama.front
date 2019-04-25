<template>
    <!-- Modal -->
    <div class="modal fade" id="singleUserModal" tabindex="-1" role="dialog"
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
                            <input type="text" id="singleUserEmail" required
                                   class="form-control"
                                   placeholder="user@mail.ru"
                                   v-model="userState.user.email">
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
                    <button type="button" class="btn btn-primary" @click="updateUser" data-dismiss="modal">
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
    import UserState from '@/store/modules/manager/user/types';

    @Component({ })
    export default class SingleUser extends Vue {

        @Action public updateUser: any;

        @State('managerUser') public userState: UserState;

    }
</script>
