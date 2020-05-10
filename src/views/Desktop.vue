<template>
    <div class="manager-desktop manager">
        <notifications></notifications>
        <header-component></header-component>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import HeaderComponent from '@/components/common/HeaderClosed.vue';
    @Component({
        components: { HeaderComponent },
    })
    export default class Desktop extends Vue { }
</script>
