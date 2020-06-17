<template>
    <div class="layers-list" ref="layers-list">

        <div class="header">

            <h2>Картографические слои</h2>

            <div class="search-panel">
                <input type="text" name="element-search" placeholder="поиск элементов по имени или описанию" />
                <button><i class="fa fa-search"></i></button>
            </div>

        </div>

        <ul class="data-list layers-list">
            <li class="layer-item" v-for="(layer, i) in layerState.layers" :key="layer.id">

                <!-- Строка со слоем -->
                <span class="layer-item-content" :title="`К элементам слоя ${layer.title}`" @click="managerLayerSetSingle({layer})">

                    <label>{{ layer.title }}</label>

                    <i class="fa fa-angle-right"></i>

                </span>

            </li>
        </ul>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import LayerState from '@/store/modules/manager/layer/types';

    @Component({
        components: {},
    })
    export default class LayersList extends Vue {

        @State('managerLayer') public layerState!: LayerState;

        // Слои
        @Action public managerLayerGetByContractor: any;
        @Action public managerLayerSetSingle: any;

        // Карта
        @Action public setMapStyles: any;

        public async created() {
            await this.managerLayerGetByContractor();
            this.setMapStyles({ styles: this.layerState.styles });
            // Last Selected Layer
            const layer = JSON.parse(localStorage.getItem('layerState.layer'));
            if (layer !== null) {
                this.managerLayerSetSingle({ layer });
            }
        }

    }

</script>