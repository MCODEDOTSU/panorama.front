<template>

    <form>
        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label>Цвет линии</label>
            <color-picker v-model="styleEditorState.style.stroke.color"
                          v-on:change="onChangeStrokeColor"></color-picker>
        </div>
        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label for="styleEditorLinestringStrokeOpacity">Прозрачность линии</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">%</div>
                </div>
                <input type="number" id="styleEditorLinestringStrokeOpacity" required class="form-control"
                       step="5" min="0" max="100"
                       v-model="styleEditorState.style.stroke.opacity"/>
            </div>
        </div>
        <div class="form-group" v-if="styleEditorState.style.stroke">
            <label for="styleEditorLinestringStrokeWidth">Толщина линии</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">px</div>
                </div>
                <input type="number" id="styleEditorLinestringStrokeWidth" required class="form-control"
                       step="1" min="1" max="20"
                       v-model="styleEditorState.style.stroke.width"/>
            </div>
        </div>
    </form>

</template>
<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import StyleEditorState from '@/store/modules/components/utils/styleEditor/types';
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

    }

</script>
