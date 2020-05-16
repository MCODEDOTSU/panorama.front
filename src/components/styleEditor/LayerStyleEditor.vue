<template>
    <div class="style-editor">
        <div class="style-editor-fields" v-if="styleEditorState.geometryType !== ''">
            <vue-scrollbar class="scrollbar scrollbar-min" ref="Scrollbar">
                <point-fields v-if="styleEditorState.geometryType === 'point'"></point-fields>
                <linestring-fields v-if="styleEditorState.geometryType === 'linestring'"></linestring-fields>
                <polygon-fields v-if="styleEditorState.geometryType === 'polygon'"></polygon-fields>
            </vue-scrollbar>
        </div>
        <div class="style-editor-map clearfix">
            <ol-map></ol-map>
        </div>
    </div>
</template>
<script lang="ts">

    import {Vue, Component, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import StyleEditorState from '@/store/modules/components/styleEditor/types';
    import OlMap from '@/components/utils/Map/Map.vue';
    import PointFields from './PointFields.vue';
    import LinestringFields from './LinestringFields.vue';
    import PolygonFields from './PolygonFields.vue';

    @Component({
        components: {LinestringFields, PointFields, PolygonFields, OlMap},
    })
    export default class LayerStyleEditor extends Vue {

        @State('styleEditor') public styleEditorState: StyleEditorState;

        @Action public setMapStyles: any;
        @Action public removeFeatureFromMap: any;
        @Action public addFeatureToMap: any;
        @Action public setMapCenterDefault: any;

        @Watch('styleEditorState.style', {deep: true})
        public onChangeStyle() {
            // Обновляем стиль на карте
            // noinspection TypeScriptUnresolvedVariable
            this.setMapStyles({
                styles: [
                    Object.assign({}, { id: 1 }, this.styleEditorState.style),
                ],
            });

        }

        @Watch('styleEditorState.geometryType')
        public onChangeGeometryType(type: string) {

            // Удаляем с карты старую геометрию
            this.removeFeatureFromMap({ id: 'style-editor' });

            if (type === 'point') {
                // Добавляем на карту точку
                this.addFeatureToMap({
                    id: 'style-editor', layer_id: 1,
                    geom: 'POINT(48.0355525016785 46.3538888154049)',
                    property: { title: 'Точечный геоэлемент', layer_id: 1 },
                });
            } else if (type === 'linestring') {
                // Добавляем на карту линию
                this.addFeatureToMap({
                    id: 'style-editor', layer_id: 1,
                    geom: `LINESTRING(48.0336213111877 46.3516524398736,
                        48.0339002609253 46.3519338431522,
                        48.0376124382019 46.3529113380201,
                        48.0377840995789 46.3535778017697,
                        48.0348873138428 46.3541109669178,
                        48.0343723297119 46.3535926119829,
                        48.0333423614502 46.3540665366874,
                        48.0337715148926 46.3544960274008,
                        48.0353379249573 46.3547033665372)`,
                    property: { title: 'Линейный геоэлемент', layer_id: 1 },
                });
            } else {
                // Добавляем на карту полигон
                this.addFeatureToMap({
                    id: 'style-editor', layer_id: 1,
                    geom: `POLYGON((48.0351877212524 46.3537110935444,
                        48.0341362953186 46.3548810851708,
                        48.0366039276123 46.3545256473257,
                        48.0377197265625 46.3535629915525,
                        48.0375909805298 46.3528817172203,
                        48.0363893508911 46.3531631141696,
                        48.0342864990234 46.3515043323028,
                        48.0351877212524 46.3537110935444))`,
                    property: { title: 'Полигональный геоэлемент', layer_id: 1 },
                });
            }

            // Задаем стиль
            this.setMapStyles({
                styles: [
                    Object.assign({}, { id: 1 }, this.styleEditorState.style),
                ],
            });

            this.setMapCenterDefault();

            // Прокручиваем скролл
            if (this.$refs.Scrollbar) {
                // @ts-ignore
                this.$refs.Scrollbar.scrollToY(0);
            }

        }

    }
</script>
