<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import {Component, Provide, Vue} from 'vue-property-decorator';
import {Action, State} from 'vuex-class';
import UserState from '@/store/modules/user/types';
import Router from '@/router';

@Component({})
export default class App extends Vue {

    @State('user') public userState!: UserState;
    @Action public getUser: any;

    public created() {
        if (this.userState.token !== '') {
            this.getUser();
        } else {
            Router.push({name: 'home'});
        }

    }

}
</script>

<style lang="scss">
    @import "./public/sass/app.scss";
</style>
