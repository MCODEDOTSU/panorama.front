<!--suppress TypeScriptCheckImport -->
<template>
    <div>
        <div id="map"></div>
        <div id="mouse-position"></div>
        <div id="current-zoom">{{ mapState.properties.zoom }}</div>

        <div id="layers" title="Выбрать подложку">
            <button @click="showLayersList=!showLayersList"><i class="fa fa-map-o"></i></button>
            <ul v-if="showLayersList">
                <li>
                    <button @click="changeTile('osm')">Open Street Map</button>
                </li>
                <li>
                    <button @click="changeTile('yandex')">Яндекс Карты</button>
                </li>
                <li>
                    <button @click="changeTile('gis')">2GIS</button>
                </li>
            </ul>
        </div>


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
    import {initOLMap, createOLSource, createOLClusterLayer, createOLLayer} from '@/domain/services/ol/MapService';

    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    import {Cluster, OSM as OSMSource, XYZ} from 'ol/source';
    import {Tile as TileLayer} from 'ol/layer';
    // @ts-ignore
    import {createXYZ} from 'ol/tilegrid';
    import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

    @Component({
        components: {},
    })
    export default class OlMap extends Vue {

        @State('map') public mapState: MapState;

        @Prop(Boolean) public editor: boolean;
        @Prop() public modifyElement: IElement;

        @Action public createMap: any;
        @Action public getMapCenter: any;

        @Provide() public showLayersList = false;

        /**
         * Кликнули по геоэлементу на карте
         */
        @Emit()
        public selected(e: any) {
            if (e.selected.length !== 0) {
                const clusterFeature = e.selected[0].getProperties();
                if (clusterFeature.features.length === 1) {
                    return clusterFeature.features[0].getProperties();
                }
            }
            this.mapState.interaction.select.getFeatures().clear();
            return false;
        }

        /**
         * Изменили геометрию на слое
         */
        @Emit()
        public modifyend(e: any) {
            const feature = e.features.getArray()[0];
            let properties = feature.getProperties();
            properties = properties.id === undefined ? properties.features[0].getProperties() : properties;
            return {
                properties,
                geom: (new WKT()).writeFeature(feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3395',
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
                    featureProjection: 'EPSG:3395',
                }),
            };
            // TODO: надо бы прикончить нанесеный объек, но выходит ошибка
            // this.mapState.source.removeFeature(e.feature);
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

            this.mapState.tiles = {
                osm: new TileLayer({
                    title: 'Open Street Map',
                    source: new OSMSource(),
                }),
                yandex: new TileLayer({
                    title: 'Яндекс Карты',
                    type: 'base',
                    source: new XYZ({
                        url: 'http://vec01.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
                        projection: 'EPSG:3395',
                        tileGrid: createXYZ({
                            extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
                        }),
                    }),
                    visible: false,
                }),
                gis: new TileLayer({
                    title: 'Дубль Гис',
                    type: 'base',
                    source: new XYZ({
                        url: 'http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
                    }),
                    visible: false,
                }),
            };

            const map = initOLMap(
                this.mapState.properties.longitude,
                this.mapState.properties.latitude,
                this.mapState.properties.zoom,
                [this.mapState.tiles.osm, this.mapState.tiles.yandex, this.mapState.tiles.gis],
                this.mapState.properties.selectorMapContainer,
            );

            this.mapState.interaction.select = new Select();
            this.mapState.interaction.select.on('select', this.selected);
            map.addInteraction(this.mapState.interaction.select);

            // Зафиксировать текущий zoom для отображения на карте
            map.on('moveend', () => {
                this.getMapCenter();
            });

            const source = createOLSource();

            const layer = createOLClusterLayer(source);

            map.addLayer(layer);

            this.createMap({map, source, layer});

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
                    const feature = this.mapState.source.getFeatureById(this.modifyElement.id);
                    this.mapState.interaction.select.getFeatures().push(feature);
                }
                this.mapState.interaction.draw = new Modify({features: this.mapState.interaction.select.getFeatures()});
                this.mapState.interaction.draw.on('modifyend', this.modifyend);
                this.mapState.map.addInteraction(this.mapState.interaction.draw);
            } else {
                this.mapState.interaction.draw = new Draw({
                    source: this.mapState.source,
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

        /**
         * Изменить слой (подложку) карты
         */
        private changeTile(tile: string) {
            switch (tile) {
                case 'yandex':
                    this.mapState.tiles.osm.setVisible(false);
                    this.mapState.tiles.yandex.setVisible(true);
                    this.mapState.tiles.gis.setVisible(false);
                    break;
                case 'gis':
                    this.mapState.tiles.osm.setVisible(false);
                    this.mapState.tiles.yandex.setVisible(false);
                    this.mapState.tiles.gis.setVisible(true);
                    break;
                default:
                    this.mapState.tiles.osm.setVisible(true);
                    this.mapState.tiles.yandex.setVisible(false);
                    this.mapState.tiles.gis.setVisible(false);
                    break;
            }
            this.showLayersList = false;
        }

    }

</script>
