<template>
    <div class="manager-geom-data-container">
        <h4>
            Загрузить KMZ файл
        </h4>

        <div class="row">
            <div class="col-2">
                <p>Выбрать файл</p>
            </div>
            <div class="col-4">
                <p>Выбрать слой</p>
            </div>
        </div>

        <div class="row">
            <div class="col-2">
                <input id="file" hidden ref="file" type="file" @change="processFile()"/>
                <span @click="attachFile">Прикрепить</span>
            </div>
            <div class="col-4">
                <select id="layers" required class="form-control" v-model="layer">
                    <option v-for="layer in layerState.layers" :value="layer" :title="layer.title">
                        {{ layer.title }}
                    </option>
                </select>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
    import LayerState from '@/store/modules/manager/layer/types';
    import ILayer from '@/domain/entities/interfaces/ILayer';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component
    export default class KMZParser extends Vue {

        @Action private uploadKmlFile: any;
        @Action private managerGetLayers: any;

        @State('managerLayer') private layerState: LayerState;

        @Provide()
        private layer: ILayer = {
            description: '', geometry_type: '', id: null, parent_id: 0, title: '', visibility: false,
        };

        private async created() {
            await this.managerGetLayers();
        }

        private attachFile() {
            document.getElementById('file').click();
        }

        private processFile() {
            if (this.layer.id === null) {
                ErrorNotifier.notifyWithCustomMessage('Выберите слой');
                return;
            }

            this.uploadKmlFile({
                fileres: this.$refs.file,
                layerId: this.layer.id,
            }).then(() => {
                SuccessNotifier.notify('File has been uploaded', 'It is uploaded');
            });
        }

    }
</script>