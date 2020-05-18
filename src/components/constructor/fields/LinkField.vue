<template>
    <div>

        <div>
            <input type="text" :id="field.tech_title" class="form-control" v-model="selectedElementTitle"
                   :placeholder="field.title" :name="field.title" readonly
                   data-vv-validate-on="change|blur" v-validate="getValidateRules"
                   :data-vv-as="'\'' + field.title + '\''"
                   data-toggle="modal" :data-target="`#layerSelectModal-${field.tech_title}`">
            <div class="actions">
                <button class="btn btn-link btn-danger" @click="clean">Очистить</button>
            </div>
            <span class="value-length"></span>
            <span class="validation-error">{{ errors.first(field.title) }}</span>
        </div>

        <!-- Modal -->
        <div class="modal fade" :id="`layerSelectModal-${field.tech_title}`" tabindex="-1" role="dialog"
             aria-labelledby="linkFieldLayersListLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Поиск необходимого Элемента</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control" placeholder="Начните ввод для поиска" v-model="search"/>
                        <div class="layer-items">
                            <!-- Layers -->
                            <div v-for="layer in layers" v-if="elementsFilter(layer.elements).length !== 0" class="layer-item">
                                <h4>{{ layer.title }}</h4>
                                <!-- Elements -->
                                <button class="btn btn-link" v-for="element in elementsFilter(layer.elements)"
                                        @click="selectElement(element)" data-dismiss="modal">
                                    {{ element.title }}
                                </button>
                                <!-- end Elements -->
                            </div>
                            <!-- end Layers -->
                        </div>
                        <div class="alert alert-info" v-if="isEmptyList">Список элементов пуст.</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Inject, Prop, Provide, Watch, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ElementState from '@/store/modules/manager/element/types';
    import {baseUrlAPI} from '@/globals';
    import axios from 'axios';

    @Component
    export default class LinkField extends Vue {

        @State('managerElement') public elementState!: ElementState;

        @Provide() public search = '';
        @Provide() public selectedElementTitle = '';
        @Provide() public layers = [];

        @Prop() private field: any;

        @Watch('field.value', {deep: true})
        public onChangeFieldValue() {
            this.selectedElementTitle = this.field.value !== null ? this.field.value.title : '';
        }

        public async created() {

            // Заголовок выбраного элемента
            this.selectedElementTitle = this.field.value !== null ? this.field.value.title : '';

            // Получаем список слоев и их элементов
            const layers = this.field.options.layers.map((item) => {
                return item.id;
            });
            const res = await axios.post(`${baseUrlAPI}gis/layer/few`, {layers});
            this.layers = res.data;
        }

        /**
         * Правила валидации
         */
        get getValidateRules() {
            const rules = [];
            if (this.field.required !== false) {
                rules.push('required');
            }
            return rules.join('|');
        }

        public elementsFilter(elements) {
            return elements.filter((item: any) => {
                return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) + 1);
            });
        }

        get isEmptyList() {
            let result = true;
            this.layers.forEach((layer) => {
                if (this.elementsFilter(layer.elements).length !== 0) {
                    result = false;
                }
            });
            return result;
        }

        public selectElement(element) {
            this.field.value = element;
            this.selectedElementTitle = element.title;
        }

        /**
         * Очистить поле с ссылкой
         */
        public clean() {
            this.field.value = null;
        }

    }
</script>
