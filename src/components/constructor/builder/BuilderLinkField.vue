<template>
    <div class="col-12 col col-enums" v-if="tableField.type === 'link_field'">
        <div class="row no-gutters">
            <div class="col-2 col">
                Элементы слоёв:
            </div>
            <div class="col-10 col">
                <label v-for="(layer, i) in tableField.options.layers" class="alert alert-info alert-layer">{{ layer.title }}
                    <button class="btn btn-link btn-sm btn-cross" @click="deleteLayer(i)">x</button>
                </label>
            </div>
            <div class="col-10 col">
                <select class="form-control" v-model="selectLayer">
                    <option v-for="layer in allLayers()" :value="layer">{{ layer.title }}</option>
                </select>
            </div>
            <div class="col-2 col action">
                <button class="btn btn-link btn-sm" @click="addLayer">Добавить слой</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue, Provide} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import TableField from '@/domain/entities/constructor/TableField';
    import LayerState from '@/store/modules/manager/layer/types';

    @Component
    export default class BuilderLinkField extends Vue {

        @Action public managerGetLayers: any;
        @State('managerLayer') public layerState: LayerState;

        @Prop() private tableField: TableField;

        @Provide()
        public selectLayer = '';

        public async created() {
            await this.managerGetLayers();
        }

        public allLayers() {
            return this.layerState.layers.filter( (item: any) => {
                return !this.tableField.options.layers.some(a => a.id === item.id);
            });
        }

        public addLayer() {
            let options = Object.assign({}, this.tableField.options);
            options.layers.push(Object.assign({}, this.selectLayer));
            this.tableField.options = Object.assign({}, options);
        }

        public deleteLayer(i) {
            let options = Object.assign({}, this.tableField.options);
            options.layers.splice(i, 1);
            this.tableField.options = Object.assign({}, options);
        }
    }
</script>
