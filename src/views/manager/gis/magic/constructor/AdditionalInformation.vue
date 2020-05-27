<template>

    <div class="tab-content" id="mainContent">

        <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">

            <form>

                <div class="alert alert-info">
                    Необходимо заполнить только те поля, которые будут одинаковые для всех элементов в цепочке, а также поля, обязательные для заполнения.
                    <br>
                    В наименовании элемента можно использовать специальный символ <b>%i</b>, который будет заменен на порядковый номер элемента в цепочке.
                </div>

                <!-- Title -->
                <div class="form-group">
                    <label for="singleInformationTitle" class="title">Наименование *</label>
                    <input type="text" id="singleInformationTitle" required
                           class="form-control"
                           placeholder="Наименование элемента"
                           v-model="elementState.magicElement.element.title"
                           name="main-name"
                           data-vv-validate-on="change|blur"
                           v-validate="'required'">
                    <span class="validation-error">{{ errors.first('main-name') }}</span>
                </div>

                <!-- Description -->
                <div class="form-group">
                    <label for="singleInformationDescription" class="title">Описание</label>
                    <vue-editor id="singleInformationDescription"
                                ref="wysiwygContents"
                                v-model="elementState.magicElement.element.description"
                                :editorToolbar="toolbar"></vue-editor>
                </div>

                <!-- Previous Element -->
                <div class="form-group">
                    <label for="singleInformationPrevious" class="title">Предыдущий Элемент для первого</label>

                    <div class="alert alert-info">
                        Алгоритм массового нанесения объектов предполагает, что элементы будут автоматически связываться между собой (поочередно).
                        Необходимо указать, к какому элементу должен быть привязан первый элемент в цепочке.
                    </div>

                    <input type="text" id="singleInformationPrevious" readonly
                           class="form-control"
                           placeholder="Предыдущий Элемент"
                           v-model="resolvedPreviousElement"
                           name="previous-element"
                           data-toggle="modal" data-target="#selectPreviousElementModal">
                    <div class="actions">
                        <a class="btn btn-link btn-danger" @click="managerElementPreviousUnsetSingle">Очистить</a>
                    </div>
                </div>

            </form>

        </div>

        <div v-if="constructorState.isTableExists" v-for="group in constructorState.tableFields"
             class="tab-pane addition-information-tab fade" role="tabpanel"
             :aria-labelledby="group.groupTechName + '-tab'" :id="group.groupTechName">

            <div class="scroll-container">

                <vue-scrollbar class="scrollbar scrollbar-min" ref="Scrollbar">

                    <div>

                        <div class="form-group" v-for="field in group.columns">
                            <label :for="field.tech_title" class="title">
                                {{ field.title }}
                                <span v-if="field.required">*</span>
                            </label>
                            <resolved-field :field="field"/>
                        </div>

                    </div>

                </vue-scrollbar>

            </div>

        </div>

        <!-- Modal For Previous Element -->
        <div class="modal fade" id="selectPreviousElementModal" tabindex="-1" role="dialog"
             aria-labelledby="selectPreviousElementModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Выбор предыдущего Элемента</h5>
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
                        <div class="alert alert-info" v-if="resolvedLayersList">Список элементов пуст.</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue, Inject} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {baseUrlAPI} from '@/globals';
    import axios from 'axios';

    import ElementState from '@/store/modules/manager/element/types';
    import ConstructorState from '@/store/modules/manager/constructor/types';
    import ResolvedField from '@/components/constructor/ResolvedField.vue';
    import {VueEditor} from 'vue2-editor';

    @Component({
        components: {ResolvedField, VueEditor},
    })
    export default class AdditionalInformation extends Vue {

        @Action public managerLayerGetById: any;
        @Action public managerElementPreviousUnsetSingle: any;

        @State('managerConstructor') public constructorState: ConstructorState;
        @State('managerElement') public elementState!: ElementState;

        @Provide('style') public style = {};
        @Provide()
        public toolbar: any = [
            ['bold', 'italic', 'underline', 'strike'],
            [{align: []}],
            [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{color: []}, {background: []}],
            ['clean'],
        ];
        @Provide() public layers = [];
        @Provide() public search = '';

        public async created() {
            const res = await axios.get(`${baseUrlAPI}manager/layer/contractor/get`);
            this.layers = res.data;
        }

        /**
         * Поиск элементов по имени в диалоговом окне выбора предыдущего элемента
         * @param elements
         */
        public elementsFilter(elements) {
            return elements.filter((item: any) => {
                return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) + 1);
            });
        }

        /**
         * Выбрать предыдущий Элемент
         * @param element
         */
        public selectElement(element) {
            this.elementState.magicElement.element.previous = {
                id: this.elementState.magicElement.element.previous.id,
                element_id: element.id,
                next_element_id: this.elementState.magicElement.element.id,
                element,
            };
        }

        /**
         * Получаем наименование предыдущего элемента
         */
        get resolvedPreviousElement() {
            return this.elementState.magicElement.element.previous.element === null ? '' :
                this.elementState.magicElement.element.previous.element.title;
        }

        /**
         * Пустой ли список элоементов в диалоговом окне выбора предыдущего элемента
         */
        get resolvedLayersList() {
            let result = true;
            this.layers.forEach((layer) => {
                if (this.elementsFilter(layer.elements).length !== 0) {
                    result = false;
                }
            });
            return result;
        }

        @Inject('validator') private $validator: any;
    }
</script>
