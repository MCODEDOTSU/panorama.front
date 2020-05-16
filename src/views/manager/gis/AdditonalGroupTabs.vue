<template>
    <div class="addition-group-tabs">
        <ul class="nav nav-tabs" id="tabs" role="tablist" ref="tablist" :style="`margin-left: ${leftMargin}px!important`">
            <li class="nav-item">
                <a class="nav-link active" id="main-tab" data-toggle="tab" href="#main" role="tab" aria-controls="main"
                   aria-selected="true">Главная</a>
            </li>
            <li class="nav-item" v-for="field in constructorState.tableFields">
                <a class="nav-link" :id="field.groupTechName  + '-tab'" data-toggle="tab" :href="'#' + field.groupTechName"
                   role="tab"
                   :aria-controls="field.groupTechName" aria-selected="false">{{ field.group }}</a>
            </li>
        </ul>
        <div class="btn btn-nav-tabs-scroll left" @click="scrollLeft()" v-if="showLeftButton"><i class="fa fa-angle-right"></i></div>
        <div class="btn btn-nav-tabs-scroll right" @click="scrollRight()" v-if="showRightButton"><i class="fa fa-angle-left"></i></div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Provide, Watch} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import ConstructorState from '@/store/modules/constructor/types';

    @Component
    export default class AdditionalGroupTabs extends Vue {

        @State('managerConstructor') public constructorState: ConstructorState;

        @Provide() public leftMargin = 0;
        @Provide() public showLeftButton = false;
        @Provide() public showRightButton = false;

        @Watch('constructorState.tableFields', {deep: true})
        public onChangeTableFields() {
            const tabList: HTMLElement = this.$refs.tablist as HTMLElement;
            if (this.$refs.tablist === undefined) {
                return false;
            }
            this.showLeftButton = ((tabList.clientWidth - 400) > 0);
        }

        public scrollLeft() {
            const tabList: HTMLElement = this.$refs.tablist as HTMLElement;
            const minMargin = -1 * (tabList.clientWidth - 400);
            const margin = this.leftMargin - 200;
            this.leftMargin = margin < minMargin ? minMargin : margin;
            if (this.leftMargin === minMargin) {
                this.showLeftButton = false;
            }
            this.showRightButton = true;
        }

        public scrollRight() {
            const margin = this.leftMargin + 200;
            this.leftMargin = margin > 0 ? 0 : margin;
            if (this.leftMargin === 0) {
                this.showRightButton = false;
            }
            this.showLeftButton = true;
        }
    }

</script>
