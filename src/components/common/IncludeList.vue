<template>
    <div class="include-list">
        <div v-bind:class="{ checkbox: true, checked: item.checked }"
             v-for="item in includeListState.list"
             @click="toggle(item);">
            <div class="checkbox-awesome"></div>
            <label>{{ item.title }}</label>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {State, Action} from 'vuex-class';
    import IncludeListState from '@/store/modules/components/common/includeList/types';

    @Component({ })
    export default class IncludeModule extends Vue {

        @State('includeList') public includeListState: IncludeListState;

        @Action public toggleIncludeItem: any;

        public toggle(item: any) {
            item.checked = !item.checked;
            this.toggleIncludeItem({item});
        }

    }
</script>