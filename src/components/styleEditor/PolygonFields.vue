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

        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label>Цвет обводки</label>
            <color-picker v-model="styleEditorState.style.stroke.color"
                          v-on:change="onChangeStrokeColor"></color-picker>
        </div>

        <div class="form-group" v-if="styleEditorState.style.fill">
            <label>Цвет заливки</label>
            <color-picker v-model="styleEditorState.style.fill.color"
                          v-on:change="onChangeFillColor"></color-picker>
        </div>

        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label for="styleEditorPolygonStrokeOpacity">Прозрачность обводки</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">%</div>
                </div>
                <input type="number" id="styleEditorPolygonStrokeOpacity" required class="form-control"
                       step="5" min="0" max="100"
                       v-model="styleEditorState.style.stroke.opacity"/>
            </div>
        </div>

        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label for="styleEditorPolygonStrokeWidth">Толщина обводки</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">px</div>
                </div>
                <input type="number" id="styleEditorPolygonStrokeWidth" required class="form-control"
                       step="1" min="1" max="20"
                       v-model="styleEditorState.style.stroke.width"/>
            </div>
        </div>

        <div class="form-group" v-if="styleEditorState.style.fill">
            <label for="styleEditorPolygonFillOpacity">Прозрачность заливки</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">%</div>
                </div>
                <input type="number" id="styleEditorPolygonFillOpacity" required class="form-control"
                       step="5" min="0" max="100"
                       v-model="styleEditorState.style.fill.opacity"/>
            </div>
        </div>

    </form>

</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import StyleEditorState from '@/store/modules/components/styleEditor/types';
    import ColorPicker from '@/components/utils/ColorPicker/ColorPicker.vue';

    @Component({
        components: { ColorPicker },
    })
    export default class LayerStyleEditor extends Vue {

        @State('styleEditor') public styleEditorState: StyleEditorState;

        @Action public setMapStyles: any;
        @Action public setMapElements: any;
        @Action public setMapCenterDefault: any;

        /**
         * Изменили значение цвета обводки
         * @param color
         */
        public onChangeStrokeColor(color: string) {
            const style = this.styleEditorState.style;
            style.stroke.color = color;
            this.styleEditorState.style = Object.assign({}, style);
        }

        /**
         * Изменили значение цвета заливки
         * @param color
         */
        public onChangeFillColor(color: string) {
            const style = this.styleEditorState.style;
            style.fill.color = color;
            this.styleEditorState.style = Object.assign({}, style);
        }

    }

</script>
