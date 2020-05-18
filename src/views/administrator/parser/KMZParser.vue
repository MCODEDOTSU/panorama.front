<template>
    <div class="manager-container">

        <h1>Импорт KMZ-файла</h1>

        <div class="content">

            <div class="alert alert-info">
                Данный инструмент позволяет произвести импорт данных из файла формата .kmz.
                Данные в файле должны принадлежать одному слою и являться точечными геоэлементами. Геоэлементы другого типа будут игнорироваться.
                Перед началом испорта необходимо выбрать слой, на который будут выгружены все данные, после чего запустить импорт.
            </div>

            <div class="step">
                <h2>Шаг 1. Выберите файл для импорта</h2>
                <button @click="$refs.file.click()" class="btn btn-info">
                    <i class="fas fa-plus-circle"></i>
                    Выбрать файл
                </button>
                <input id="file" hidden ref="file" type="file" @change="selectFile()" accept=".kmz" />
            </div>

            <div class="step" v-if="fileName !== ''">
                <h2>Шаг 2. Выберите слой, куда необходимо загрузить все данные из файла</h2>
                <select id="layers" required class="form-control" v-model="layer">
                    <option v-for="layer in layerState.layers" :value="layer" :title="layer.title">
                        {{ layer.title }}
                    </option>
                </select>
            </div>

            <div class="step" v-if="layer.id !== 0">
                <h2>Шаг 3. Запустите импорт</h2>
                <button @click="start()" class="btn btn-info">
                    <i class="fa fa-play"></i>
                    Запустить импорт
                </button>
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
    export default class KMZParser extends Vue {

        @Action private uploadParsedFile: any;
        @Action private administratorLayerGetByType: any;

        @State('administratorLayer') private layerState: LayerState;

        @Provide()
        private layer: ILayer = {
            id: 0,
            alias: '',
            title: '',
            description: '',
            parent_id: 0,
            module_id: 0,
            visibility: false,
            geometry_type: '',
        };

        @Provide() private fileName = '';

        private async created() {
            await this.administratorLayerGetByType({ type: 'point' });
        }

        /***
         * Выбрать файл
         */
        private selectFile() {
            const $fileInput: HTMLInputElement = (this.$refs.file as HTMLInputElement);
            this.fileName = $fileInput.files[0].name;
        }

        /***
         * Запустить импорт
         */
        private start() {
            this.uploadParsedFile({
                fileres: this.$refs.file,
                layerId: this.layer.id,
                parseType: 'kmz',
            }).then(() => {
                SuccessNotifier.notify('Импорт завершен', 'Данные файла были успешно выгружены в систему');
            });
        }

    }
</script>