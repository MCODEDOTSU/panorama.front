<template>
    <header class="manager">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark nav-backround">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/" tag="a">На главную <span class="sr-only"></span>
                        </router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Управление
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuManagerLink">
                            <router-link class="nav-link dropdown-item" to="/manager/contractors/modules" tag="a">Доступные модули
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/manager/gis" tag="a">Картография
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/manager/parse_kmz" tag="a">Парсинг KMZ
                            </router-link>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuManagerLink"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-if="userState.role === 'superadmin'" >
                            Администрирование
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuManagerLink">
                            <router-link class="nav-link dropdown-item" to="/manager/contractors" tag="a">Контрагенты
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/manager/modules" tag="a">Модули
                            </router-link>
                            <router-link class="nav-link dropdown-item" to="/manager/layers" tag="a">Слои</router-link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <button @click="logout" title="Выйти из Системы" class="btn btn-link nav-link router-link-active">Выйти</button>
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
