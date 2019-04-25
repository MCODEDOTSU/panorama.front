<style>
    .vue-tabs ul {
        padding-top: 40px;
    }
</style>
<template>

    <div class="vue-tabs">
        
        <div class="nav-tabs-navigation">
            <div class="nav-tabs-wrapper">
                <ul role="tablist" class="nav nav-tabs">
                    <li class="tab" v-for="(item, index) in module[layer-1]" :key="index" v-bind:class="{ active: (layerItem === item.id) }">
                        
                        <router-link :to="{ name: 'open-data', params: { module: layer, layer: item.id }}"
                            class="tabs__link" v-bind:class="{ active_tab: (layerItem === item.id) }">
                            <img :src="item.img" alt="Paris">
                            <div class="box-title">
                                <span>{{item.title}}</span>
                            </div>
                        </router-link>

                    </li>
                </ul>
            </div>
        </div>

    </div>

</template>
<script lang="ts">
    import { Component, Vue, Prop, Provide, Watch } from 'vue-property-decorator';

    @Component({})
    export default class Submenu extends Vue {

        @Provide() public layer: number = 1;

        @Provide() public layerItem: number = 1;

        @Provide() public module: any[] = [
            [
                {id: 1, title: 'Аварийно-диспетчерские службы', img: '/images/item/001-badge.png'},
                {id: 2, title: 'Опорные пункты полиции', img: '/images/item/002-padlock.png'},
                {id: 3, title: 'Участковые', img: '/images/item/004-car.png'},
            ],
            [
                {id: 4, title: 'Маршруты следования', img: '/images/item/005-minibus.png'},
                {id: 5, title: 'Остановки', img: '/images/item/006-bus-stop.png'},
            ],
            [
                {id: 6, title: 'Объекты торговли', img: '/images/item/008-object.png'},
            ],
            [
                {id: 7, title: 'Управляющие компании', img: '/images/item/009-team.png'},
                {id: 8, title: 'Программа капитального ремонта', img: '/images/item/010-wrench.png'},
                {id: 9, title: 'Программа благоустройства дворов', img: '/images/item/012-shovel.png'},
            ],
            [
                {id: 10, title: 'Плановые', img: '/images/item/013-organize.png'},
                {id: 11, title: 'Аварийные', img: '/images/item/014-exam.png'},
            ],
            [
                {id: 12, title: 'ТОСы', img: '/images/item/016-network.png'},
            ],
            [
                {id: 13, title: 'Избирательные участки', img: '/images/item/019-vote.png'},
            ],
        ];

        @Watch('$route')
        public onChangeRouter(val: any, oldVal: any) {
            this.layer = Number(val.params.module);
            this.layerItem =  Number(val.params.layer);
        }

        public created() {
            this.layer = Number(this.$route.params.module);
            this.layerItem = Number(this.$route.params.layer);
        }

    }
</script>
