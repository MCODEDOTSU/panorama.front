<!--suppress TypeScriptCheckImport -->
<template>
    <div>
        <div id="map"></div>
        <div id="mouse-position"></div>
        <div id="current-zoom">{{ mapState.properties.zoom }}</div>
    </div>
</template>


<script lang="ts">

    import {Component, Vue, Provide, Watch, Emit, Prop} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import IElement from '@/domain/interfaces/IElement';
    import MapState from '@/store/modules/components/utils/map/types';
    import {WKT} from 'ol/format';
    // @ts-ignore
    import {Select, Modify, Draw} from 'ol/interaction';
    import {initOLMap, createOLLayer, createOLCluster} from '@/domain/services/ol/MapService';

    @Component({
        components: {},
    })
    export default class OlMap extends Vue {

        @State('map') public mapState: MapState;

        @Prop(Boolean) public editor: boolean;
        @Prop() public modifyElement: IElement;

        @Action public createMap: any;
        @Action public getMapCenter: any;

        /**
         * Кликнули по геоэлементу на карте
         */
        @Emit()
        public selected(e: any) {
            if (e.selected.length !== 0) {
                return e.selected[0].getProperties();
            }
        }

        /**
         * Изменили геометрию на слое
         */
        @Emit()
        public modifyend(e: any) {
            const feature = this.mapState.layer.getSource().getFeatureById(this.modifyElement.id);
            return {
                properties: feature.getProperties(),
                geom: (new WKT()).writeFeature(feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                }),
            };
        }

        /**
         * Изменили геометрию на слое
         */
        @Emit()
        public drawend(e: any) {
            return {
                properties: e.feature.getProperties(),
                geom: (new WKT()).writeFeature(e.feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                }),
            };
            // TODO: надо бы прикончить нанесеный объек, но выходит ошибка
            // this.mapState.layer.getSource().removeFeature(e.feature);
        }

        /**
         * Отслеживаем изменение режима рыботы карты
         */
        @Watch('mapState.interaction.mode')
        public onChangeInteractionDrawMode() {
            this.createInteractions();
            this.mapState.map.render();
        }

        /**
         * Монтирование компонента
         */
        public mounted() {
            this.init();
        }

        /**
         * Инициализация карты
         */
        private init() {

            const map = initOLMap(
                this.mapState.properties.longitude,
                this.mapState.properties.latitude,
                this.mapState.properties.zoom,
                this.mapState.properties.selectorMapContainer,
            );

            this.mapState.interaction.select = new Select();
            this.mapState.interaction.select.on('select', this.selected);
            map.addInteraction(this.mapState.interaction.select);

            // Зафиксировать текущий zoom для отображения на карте
            map.on('moveend', () => {
                this.getMapCenter();
            });

            // Создание слоев карты
            const layer = createOLLayer();
            map.addLayer(layer);

            // Создание Кластеризации
            // const clusterLayer = createOLCluster(layer.getSource());
            // map.addLayer(clusterLayer, this.mapState.styles);

            this.createMap({map, layer});
        }

        /**
         * Добавить интерактив на карту
         */
        private createInteractions() {

            this.removeInteractions();

            if (!this.editor || this.mapState.interaction.mode === 'select') {
                this.mapState.interaction.select.getFeatures().clear();
                return;
            }

            if (this.mapState.interaction.mode === 'modify') {
                if (this.mapState.interaction.select.getFeatures().getLength() === 0) {
                    const feature = this.mapState.layer.getSource().getFeatureById(this.modifyElement.id);
                    this.mapState.interaction.select.getFeatures().push(feature);
                }
                this.mapState.interaction.draw = new Modify({features: this.mapState.interaction.select.getFeatures()});
                this.mapState.interaction.draw.on('modifyend', this.modifyend);
                this.mapState.map.addInteraction(this.mapState.interaction.draw);
            } else {
                this.mapState.interaction.draw = new Draw({
                    source: this.mapState.layer.getSource(),
                    type: this.mapState.interaction.mode,
                });
                this.mapState.interaction.draw.on('drawend', this.drawend);
                this.mapState.map.addInteraction(this.mapState.interaction.draw);
            }
        }

        /**
         * Удалить интерактив с карты
         */
        private removeInteractions() {
            if (this.mapState.interaction.draw !== false) {
                this.mapState.map.removeInteraction(this.mapState.interaction.draw);
                this.mapState.interaction.draw = false;
            }
        }

    }

</script>