<template>
    <div class="layers-list" ref="layers-list">

        <h2>Картографические слои</h2>

        <ul class="data-list layers-list">
            <li class="layer-item" v-bind:class="{empty: (layer.elements.length === 0)}"
                v-for="(layer, i) in layerState.layers" :key="layer.id">

                <!-- Строка со слоем -->
                <span class="layer-item-content" :title="`К элементам слоя ${layer.title}`" @click="setSingleManagerLayer({layer})">

                    <label>{{ layer.title }}</label>

                    <i class="fa fa-angle-right" v-if="layer.elements.length !== 0"></i>

                </span>

            </li>
        </ul>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import LayerState from '@/store/modules/layer/types';

    @Component({
        components: {},
    })
    export default class LayersList extends Vue {

        @State('managerLayer') public layerState!: LayerState;

        // Слои
        @Action public managerLayerGetAll: any;
        @Action public setSingleManagerLayer: any;

        // Карта
        @Action public setMapStyles: any;

        public async created() {
            await this.managerLayerGetAll();
            this.setMapStyles({ styles: this.layerState.styles });
            // Last Layer
            const layer = JSON.parse(localStorage.getItem('layerState.layer'));
            if (layer !== null) {
                this.setSingleManagerLayer({ layer });
            }
        }

    }

</script>