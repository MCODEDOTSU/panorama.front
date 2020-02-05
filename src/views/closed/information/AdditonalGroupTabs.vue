<template>
    <ul class="nav nav-tabs" id="tabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="main-tab" data-toggle="tab" href="#main" role="tab" aria-controls="main"
               aria-selected="true">Главная</a>
        </li>
        <li class="nav-item" v-for="field in constructorState.tableFields">
            <a class="nav-link" :id="field.group  + '-tab'" data-toggle="tab" :href="'#' + field.group" role="tab"
               :aria-controls="field.group" aria-selected="false">{{ field.group }}</a>
        </li>
    </ul>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import ConstructorState from '@/store/modules/constructor/types';

    @Component
    export default class AdditionalGroupTabs extends Vue {
        @State('constructor') public constructorState: ConstructorState;
    }
</script>
