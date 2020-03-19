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
    import MapState from '@/store/modules/components/utils/map/types';
    import {WKT} from 'ol/format';
    import {createOLLayer, createOLModify} from '@/domain/services/ol/LayerService';
    import {createOLDraw, createOLSelectInteraction, initOLMap} from '@/domain/services/ol/MapService';

    @Component({
        components: { },
    })
    export default class OlMap extends Vue {

        @State('map') public mapState: MapState;

        @Prop(Boolean) public editor: boolean;

        @Action public createMap: any;
        @Action public getMapCenter: any;

        /**
         * Кликнули по геоэлементу на карте
         */
        @Emit() public selected(e: any) {
            if (e.selected.length !== 0) {
                return e.selected[0].getProperties();
            }
        }

        /**
         * Изменили геометрию на слое
         */
        @Emit() public modifyend(e: any) {
            const features = e.features.getArray();
            for (const feature of features) {
                /* Revision - номер версии объекта. Если номер изменился, значит объект обновился */
                const revision = feature.getRevision();
                let lastRevision = feature.get('revision');
                if (lastRevision !== undefined && revision > lastRevision) {
                    feature.set('revision', revision, true);
                    return {
                        properties: feature.getProperties(),
                        geom: (new WKT()).writeFeature(feature, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }),
                    };
                }
            }
        }

        /**
         * Изменили геометрию на слое
         */
        @Emit() public drawend(e: any) {
            return {
                properties: e.feature.getProperties(),
                geom: (new WKT()).writeFeature(e.feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                }),
            };
        }

        /**
         * Отслеживаем интерактивный режим карты
         */
        @Watch('mapState.interaction.draw.mode')
        public onChangeInteractionDrawMode() {
            if (!this.editor) {
                return;
            }
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

            map.addInteraction(createOLSelectInteraction(this.selected));

            // Зафиксировать текущий zoom для отображения на карте
            map.on('moveend', () => { this.getMapCenter(); });

            // Создание слоев карты
            const layer = createOLLayer();
            map.addLayer(layer);
            if (this.editor) {
                const modify = createOLModify(layer.getSource(), this.modifyend);
                map.addInteraction(modify);
            }
            this.createMap({ map, layer });
        }

        /**
         * Добавить интерактив на карту
         */
        private createInteractions() {
            this.removeInteractions();
            if (this.mapState.interaction.draw.mode === '') {
                return;
            }
            if (!this.mapState.interaction.draw.layer) {
                this.mapState.interaction.draw.layer = createOLLayer();
                this.mapState.map.addLayer(this.mapState.interaction.draw.layer);
            }
            this.mapState.interaction.draw.draw = createOLDraw(
                this.mapState.interaction.draw.mode,
                this.mapState.interaction.draw.layer,
                this.drawend,
            );
            this.mapState.map.addInteraction(this.mapState.interaction.draw.draw);
        }

        /**
         * Удалить интерактив с карты
         */
        private removeInteractions() {
            if (this.mapState.interaction.draw.draw !== false) {
                this.mapState.map.removeInteraction(this.mapState.interaction.draw.draw);
                this.mapState.interaction.draw.draw = false;
                // this.mapState.map.removeLayer(this.mapState.interaction.draw.layer);
                // this.mapState.interaction.draw.layer = false;
            }
        }

    }

</script>
