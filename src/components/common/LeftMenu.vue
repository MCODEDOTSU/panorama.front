<template>
    <div class="left-menu" v-bind:class="{ full: leftMenuState.full }">
        <ul class="menu">
            <router-link to="/manager/cabinet" tag="li">
                <i class="fa fa-desktop"></i>
                <label>Рабочий стол</label>
            </router-link>
            <router-link to="/administrator/persons" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-users"></i>
                <label>Физические Лица</label>
            </router-link>
            <router-link to="/administrator/contractors" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-building"></i>
                <label>Контрагенты</label>
            </router-link>
            <router-link to="/manager/gis" tag="li">
                <i class="fa fa-map-marker"></i>
                <label>Картография</label>
            </router-link>
            <router-link to="/administrator/modules" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-th"></i>
                <label>Модули</label>
            </router-link>
            <router-link to="/administrator/layers" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-map-o"></i>
                <label>Слои</label>
            </router-link>
            <router-link to="/administrator/parse/kmz" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-upload"></i>
                <label>Парсинг KMZ</label>
            </router-link>
            <router-link to="/administrator/parse/xls" tag="li" v-if="userState.role === 'superadmin'">
                <i class="fa fa-upload"></i>
                <label>Парсинг XLS</label>
            </router-link>
            <li @click="toggle()">
                <i class="fa fa-angle-left" v-if="leftMenuState.full"></i>
                <i class="fa fa-angle-right" v-else></i>
                <label>Свернуть меню</label>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Provide} from 'vue-property-decorator';
    import {State, Action} from 'vuex-class';
    import UserState from '@/store/modules/user/types';
    import LeftMenuState from '@/store/modules/components/common/leftMenu/types';

    @Component({ })
    export default class TopMenu extends Vue {

        @State('user') public userState!: UserState;
        @State('leftMenu') public leftMenuState!: LeftMenuState;
        @Action public toggleLeftMenu: any;
        @Action public getLeftMenuFull: any;

        private created() {
            this.getLeftMenuFull({ full: localStorage.getItem('left-menu-full') === null ? true : (localStorage.getItem('left-menu-full') === 'true') });
        }

        private toggle() {
            this.toggleLeftMenu();
            localStorage.setItem('left-menu-full', this.leftMenuState.full);
        }
    }
</script>