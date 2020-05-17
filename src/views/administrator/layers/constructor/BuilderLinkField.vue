<template>
    <div>
        <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'link_field'">
            <div class="row no-gutters addition-setting-fields">
                <div class="col-12 col last-in-row">
                    <div class="alert alert-info">
                        Дополнительные ограничения по типу поля: слои, элементы которых можно выбрать в качестве ссылки
                    </div>
                </div>
                <div class="col-2 col">
                    Элементы слоёв:
                </div>
                <div class="col-10 col last-in-row">
                    <label v-for="(layer, i) in tableField.options.layers" class="alert alert-info alert-layer">{{ layer.title }}
                        <button class="btn btn-link btn-sm btn-cross" @click="deleteLayer(i)">x</button>
                    </label>
                </div>
                <div class="col-10 col">
                    <select class="form-control" v-model="selectLayer">
                        <option v-for="layer in allLayers()" :value="layer">{{ layer.title }}</option>
                    </select>
                </div>
                <div class="col-2 col action last-in-row">
                    <button class="btn btn-link btn-sm" @click="addLayer">Добавить</button>
                </div>
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
        private selectLayer = '';

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { layers: [] };
            }
        }

        public async created() {
            await this.managerGetLayers();
        }

        public allLayers() {
            return this.layerState.layers.filter( (item: any) => {
                return !this.tableField.options.layers.some((a) => a.id === item.id);
            });
        }

        public addLayer() {
            const options = Object.assign({}, this.tableField.options);
            options.layers.push(Object.assign({}, this.selectLayer));
            this.tableField.options = Object.assign({}, options);
        }

        public deleteLayer(i) {
            const options = Object.assign({}, this.tableField.options);
            options.layers.splice(i, 1);
            this.tableField.options = Object.assign({}, options);
        }
    }
</script>
