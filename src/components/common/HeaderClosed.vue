<template>
    <header class="manager">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark nav-backround">
            <!--<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"-->
            <!--aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">-->
            <!--<span class="navbar-toggler-icon"></span>-->
            <!--</button>-->
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Управление
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuManagerLink">
                            <!--<router-link class="nav-link dropdown-item" to="/manager/layers" tag="a">-->
                                <!--Доступные модули-->
                            <!--</router-link>-->
                            <router-link class="nav-link dropdown-item" to="/manager/gis" tag="a">Картография
                            </router-link>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuManagerLink"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                           v-if="userState.role === 'superadmin'"
                           test-tag="menu-administration"
                        >
                            Администрирование
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuManagerLink">
                            <router-link class="nav-link dropdown-item" to="/administrator/contractors" tag="a">
                                Контрагенты
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/administrator/persons" tag="a">
                                Физические Лица
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/administrator/modules" tag="a">Модули
                            </router-link>
                            <router-link test-tag="manager-layers-link" class="nav-link dropdown-item" to="/administrator/layers" tag="a">Слои
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/administrator/parse/kmz" tag="a">Парсинг KMZ
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/administrator/parse/xls" tag="a">Парсинг XLS
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="collapse navbar-collapse" id="navbarContractor">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item"
                        v-if="userState.user.contractor !== null && userState.user.contractor !== undefined">
                        <img v-if="userState.user.contractor.logo !== '' && userState.user.contractor.logo !== null"
                             :src="userState.user.contractor.logo" class="photo"/>
                    </li>
                    <li class="nav-item">
                        <label class="contractor-name"
                               v-if="userState.user.contractor !== null && userState.user.contractor !== undefined">
                            {{ userState.user.contractor.name }}
                        </label>
                        <label class="person-name">
                            {{ userState.user.person ? userState.user.person.lastname : '-' }}
                            {{ userState.user.person ? userState.user.person.firstname : '-' }}
                            {{ userState.user.person ? userState.user.person.middlename : '-' }}
                        </label>
                        <label class="person-post">
                            {{ userState.user.person ? userState.user.person.post : '-' }}
                        </label>
                    </li>
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/manager/cabinet" tag="a">Профиль<span class="sr-only"></span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <button @click="logout" title="Выйти из Системы"
                                class="btn btn-link nav-link router-link-active">Выход
                        </button>
                    </li>
                </ul>
            </div>

        </nav>
    </header>
</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {State, Action} from 'vuex-class';
    import UserState from '@/store/modules/user/types';

    @Component({})
    export default class Header extends Vue {

        @State('user') public userState!: UserState;

        @Action public logout: any;

    }
</script>
