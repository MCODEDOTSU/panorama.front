<template>
    <div class="manager-desktop manager" v-bind:class="{ 'left-menu-full': leftMenuState.full }">
        <notifications></notifications>
        <top-menu></top-menu>
        <left-menu></left-menu>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {State, Action} from 'vuex-class';
    import TopMenu from '@/components/common/TopMenu.vue';
    import LeftMenu from '@/components/common/LeftMenu.vue';
    import LeftMenuState from '@/store/modules/components/common/leftMenu/types';
    @Component({
        components: {LeftMenu, TopMenu },
    })
    export default class Desktop extends Vue {
        @State('leftMenu') public leftMenuState!: LeftMenuState;
    }
</script>
