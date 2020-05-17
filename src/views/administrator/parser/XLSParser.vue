<template>
    <div class="manager-geom-data-container">
        <h4>
            Загрузить XLS файл
        </h4>

        <div class="row">
            <div class="col-2">
                <p>Выбрать файл</p>
            </div>
            <div class="col-4">
                <p>Cлой</p>
            </div>
        </div>

        <div class="row">
            <div class="col-2">
                <input id="file" hidden ref="file" type="file" @change="processFile()"/>
                <span @click="attachFile">Прикрепить</span>
            </div>
            <div class="col-4">
                <input class="form-control" id="layer" ref="text" type="text" v-model="layer.title" disabled/>
<!--                <select id="layers" required class="form-control" v-model="layer">-->
<!--                    <option v-for="layer in layerState.layers" :value="layer" :title="layer.title">-->
<!--                        {{ layer.title }}-->
<!--                    </option>-->
<!--                </select>-->
            </div>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    import LayerState from '@/store/modules/administrator/layer/types';
    import ILayer from '@/domain/interfaces/ILayer';

    @Component
    export default class XLSParser extends Vue {

        @Action private uploadParsedFile: any;
        @Action private administratorLayerGetAll: any;

        @State('administratorLayer') private layerState: LayerState;

        @Provide()
        private layer: ILayer = {
            id: null,
            alias: '',
            title: '',
            description: '',
            parent_id: 0,
            module_id: 0,
            visibility: false,
            geometry_type: '',
        };

        private async created() {
            await this.administratorLayerGetAll();
        }

        private attachFile() {
            document.getElementById('file').click();
        }

        private processFile() {
            if (this.layer.id === null) {
                ErrorNotifier.notifyWithCustomMessage('Выберите слой');
                return;
            }

            this.uploadParsedFile({
                fileres: this.$refs.file,
                layerId: this.layer.id,
                parseType: 'xls',
            }).then(() => {
                SuccessNotifier.notify('File has been uploaded', 'It is uploaded');
            });
        }
    }
</script>