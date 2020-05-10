<template>

    <form>

        <div class="form-group" v-if="styleEditorState.style.pointType">
            <label for="styleEditorShowTitle">Отображать наименование?</label>
            <select id="styleEditorShowTitle" class="form-control"
                    v-model="styleEditorState.style.showTitle">
                <option value="true">Да</option>
                <option value="false">Нет</option>
            </select>
        </div>

        <div class="form-group" v-if="styleEditorState.style.pointType">
            <label for="styleEditorPointType">Фигура или иконка</label>
            <select id="styleEditorPointType" class="form-control"
                    v-model="styleEditorState.style.pointType">
                <option value="shape">Фигура</option>
                <option value="icon">Иконка</option>
            </select>
        </div>

        <div v-if="styleEditorState.style.pointType === 'shape'">
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label>Цвет обводки</label>
                <color-picker v-model="styleEditorState.style.shape.stroke.color"
                              v-on:change="onChangeStrokeColor"></color-picker>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label>Цвет заливки</label>
                <color-picker v-model="styleEditorState.style.shape.fill.color"
                              v-on:change="onChangeFillColor"></color-picker>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointStrokeRadius">Радиус фигуры</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">px</div>
                    </div>
                    <input type="number" id="styleEditorPointStrokeRadius" class="form-control"
                           step="1" min="3" max="20"
                           v-model="styleEditorState.style.shape.radius"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointStrokePoints">Количество вершин фигуры</label>
                <select id="styleEditorPointStrokePoints" class="form-control"
                        v-model="styleEditorState.style.shape.points">
                    <option value="11">Окружность</option>
                    <option value="3">Треугольник</option>
                    <option value="4">Квадрат</option>
                    <option value="5">Пятиугольник (пентагон)</option>
                    <option value="6">Шестиугольник (гексагон)</option>
                    <option value="7">Семиугольник (гептагон)</option>
                    <option value="8">Восьмиугольник (октагон)</option>
                    <option value="9">Девятиугольник (нонагон)</option>
                    <option value="10">Десятиугольник (декагон)</option>
                </select>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointStrokeRotation">Поворот</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">°</div>
                    </div>
                    <input type="number" id="styleEditorPointStrokeRotation" class="form-control"
                           step="5" min="-180" max="180"
                           v-model="resolvedRotation"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointStrokeOpacity">Прозрачность обводки</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">%</div>
                    </div>
                    <input type="number" id="styleEditorPointStrokeOpacity" class="form-control"
                           step="5" min="0" max="100"
                           v-model="styleEditorState.style.shape.stroke.opacity"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointStrokeWidth">Толщина обводки</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">px</div>
                    </div>
                    <input type="number" id="styleEditorPointStrokeWidth" class="form-control"
                           step="1" min="0" max="20"
                           v-model="styleEditorState.style.shape.stroke.width"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.shape">
                <label for="styleEditorPointFillOpacity">Прозрачность заливки</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">%</div>
                    </div>
                    <input type="number" id="styleEditorPointFillOpacity" class="form-control"
                           step="5" min="0" max="100"
                           v-model="styleEditorState.style.shape.fill.opacity"/>
                </div>
            </div>
        </div>
        <div v-if="styleEditorState.style.pointType === 'icon'">
            <div class="form-group file-upload">
                <label for="styleEditorPointIconSrc">Изображение</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <img :src="styleEditorState.style.icon.src" class="icon"/>
                        </div>
                    </div>
                    <input type="text" id="styleEditorPointIconSrc" class="form-control" readonly
                           value="Выбрать иконку" @click="$refs.icon.click()"/>
                </div>
                <input type="file" ref="icon" class="form-control-file"
                       @change="uploadIcon" accept="image/jpeg,image/png,image/gif" />
            </div>
            <div class="form-group" v-if="styleEditorState.style.icon">
                <label for="styleEditorPointIconAnchor0">Смещение по горизонтали влево</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">px</div>
                    </div>
                    <input type="number" id="styleEditorPointIconAnchor0" class="form-control"
                           step="1" min="-256" max="256"
                           v-model="styleEditorState.style.icon.anchor[0]"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.icon">
                <label for="styleEditorPointIconAnchor1">Смещение по вертикали вверх</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">px</div>
                    </div>
                    <input type="number" id="styleEditorPointIconAnchor1" class="form-control"
                           step="1" min="-256" max="256"
                           v-model="styleEditorState.style.icon.anchor[1]"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.icon">
                <label for="styleEditorPointIconOpacity">Прозрачность</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">%</div>
                    </div>
                    <input type="number" id="styleEditorPointIconOpacity" class="form-control"
                           step="5" min="0" max="100"
                           v-model="styleEditorState.style.icon.opacity"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.icon">
                <label for="styleEditorPointIconScale">Масштаб</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">х</div>
                    </div>
                    <input type="number" id="styleEditorPointIconScale" class="form-control"
                           step="0.05" min="0" max="5"
                           v-model="styleEditorState.style.icon.scale"/>
                </div>
            </div>
            <div class="form-group" v-if="styleEditorState.style.icon">
                <label for="styleEditorPointIconRotation">Поворот</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">°</div>
                    </div>
                    <input type="number" id="styleEditorPointIconRotation" class="form-control"
                           step="5" min="-180" max="180"
                           v-model="styleEditorState.style.icon.rotation"/>
                </div>
            </div>
        </div>
        <div>
            <div class="form-group">
                <label for="styleEditorPointList">Связывать элементы в список</label>
                <select id="styleEditorPointList" class="form-control"
                        v-model="styleEditorState.style.list.hasList">
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </div>
            <div class="form-group" v-if="styleEditorState.style.list.hasList">
                <label for="styleEditorPointListVisibility">Отображать связь на карте</label>
                <select id="styleEditorPointListVisibility" class="form-control"
                        v-model="styleEditorState.style.list.visibility">
                    <option value="true">Отображать</option>
                    <option value="false">Скрывать</option>
                </select>
            </div>
            <div class="form-group list-color-style" v-if="styleEditorState.style.list.visibility">
                <label>Цвет линии связи</label>
                <color-picker v-model="styleEditorState.style.list.color"
                              v-on:change="onChangeListColor"></color-picker>
            </div>
            <div class="form-group" v-if="styleEditorState.style.list.visibility">
                <label for="styleEditorPointListOpacity">Прозрачность линии связи</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">%</div>
                    </div>
                    <input type="number" id="styleEditorPointListOpacity" class="form-control"
                           step="5" min="0" max="100"
                           v-model="styleEditorState.style.list.opacity"/>
                </div>
            </div>
        </div>
    </form>

</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import StyleEditorState from '@/store/modules/components/utils/styleEditor/types';
    import ColorPicker from '@/components/utils/ColorPicker/ColorPicker.vue';

    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget;
    }

    @Component({
        components: { ColorPicker },
    })
    export default class LayerStyleEditor extends Vue {

        @State('styleEditor') public styleEditorState: StyleEditorState;

        @Action public setMapStyles: any;
        @Action public setMapElements: any;
        @Action public setMapCenterDefault: any;
        @Action public uploadIconByStyleEditor: any;

        /**
         * Изменили значение цвета обводки
         * @param color
         */
        public onChangeStrokeColor(color: string) {
            const style = this.styleEditorState.style;
            style.shape.stroke.color = color;
            this.styleEditorState.style = Object.assign({}, style);
        }

        /**
         * Изменили значение цвета заливки
         * @param color
         */
        public onChangeFillColor(color: string) {
            const style = this.styleEditorState.style;
            style.shape.fill.color = color;
            this.styleEditorState.style = Object.assign({}, style);
        }

        /**
         * Изменили значение цвета линии связи
         * @param color
         */
        public onChangeListColor(color: string) {
            const style = this.styleEditorState.style;
            style.list.color = color;
            this.styleEditorState.style = Object.assign({}, style);
        }

        /**
         * Загружаем иконку на сервер
         */
        public uploadIcon() {
            const $fileInput: HTMLInputElement = (this.$refs.icon as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const file = $fileInput.files[0];
            this.uploadIconByStyleEditor({file});
        }

        /**
         * Пересчитываем градусы в радианы
         */
        get resolvedRotation() {
            return Math.round((this.styleEditorState.style.shape.rotation * 180) / Math.PI);
        }

        set resolvedRotation(value) {
            const shape = Object.assign({}, this.styleEditorState.style.shape, { rotation: (value * Math.PI) / 180 });
            this.styleEditorState.style.shape = Object.assign({}, shape);
        }

    }

</script>
