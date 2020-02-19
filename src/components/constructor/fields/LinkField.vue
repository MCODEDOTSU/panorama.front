<template>
    <div>
        
        <div v-if="field.type === 'link_field' && field.required === false">
            <input type="text" :id="field.tech_title" class="form-control" v-model="selectedElementTitle"
                   :placeholder="field.title" :name="field.title" readonly
                   v-b-modal.layerSelectModal>
        </div>
        <div v-if="field.type === 'link_field' && field.required">
            <input type="text" :id="field.tech_title" class="form-control" v-model="selectedElementTitle"
                   :placeholder="field.title" :name="field.title" readonly
                   data-vv-validate-on="change|blur" v-validate="`required`"
                   v-b-modal.layerSelectModal>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>

        <b-modal id="layerSelectModal" title="Выбор ссылки на элемент" hide-footer>
            <input type="text" class="form-control" placeholder="Начните ввод для поиска" v-model="search"/>
            <div class="layer-items">
                <!-- Layers -->
                <div v-for="layer in layerState.layers" v-if="elementsFilter(layer.elements).length !== 0" class="layer-item">
                    <h4>{{ layer.title }}</h4>
                    <!-- Elements -->
                    <div class="row" v-for="element in elementsFilter(layer.elements)">
                        <div class="col-12">
                            <button class="btn btn-link" @click="selectElement(element)">{{ element.title }}</button>
                        </div>
                    </div>
                    <!-- end Elements -->
                </div>
                <!-- end Layers -->
            </div>
            <div class="alert alert-info" v-if="isEmptyList() === true">Список элементов пуст.</div>
        </b-modal>
        
    </div>
</template>

<script lang="ts">

    import {Component, Inject, Prop, Vue, Provide, Watch} from "vue-property-decorator";
    import {Action, State} from 'vuex-class';
    import LayerState from '@/store/modules/gis/layer/types';
    import ElementState from '@/store/modules/manager/element/types';

    @Component
    export default class LinkField extends Vue {

        @Action public gisGetFewLayers: any;
        @Action public managerGetElementById: any;

        @State('gisLayer') public layerState!: LayerState;
        @State('managerElement') public elementState!: ElementState;

        @Prop() private field: any;
        @Inject('validator') private $validator: any;

        @Provide() public search = '';
        @Provide() public selectedElementTitle = '';

        @Watch('field.value', {deep: true})
        public onChangeFieldValue() {
            this.selectedElementTitle = this.field.value !== null ? this.field.value.title : '';
        }

        public async created() {
            let layers = this.field.options.layers.map(function(item) {
                return item.id;
            });
            await this.gisGetFewLayers({ layers });
        }

        public elementsFilter(elements) {
            return elements.filter( (item: any) => {
                return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) + 1);
            });
        }

        public isEmptyList() {
            let result = true;
            this.layerState.layers.forEach((layer) => {
                if (this.elementsFilter(layer.elements).length !== 0) {
                    result = false;
                }
            });
            return result;
        }

        public selectElement(element) {
            this.$bvModal.hide('layerSelectModal');
            this.field.value = element;
            this.selectedElementTitle = element.title;
        }

    }
</script>
