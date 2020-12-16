<template>
    <div class="manager-container content">

        <h1>Импорт XLS-файла</h1>

        <div class="content">

            <div class="alert alert-info">
                Данный инструмент позволяет произвести импорт данных из файла формата .xls.
                <hr>
                <b>Инструмент находится в разработке.</b>
                <hr>
                Правила импорта имеют строгий формат и правила:
                <br>
                1. Производиться импорт данных для уже созданных элементов слоя "Опоры"<br>
                2. Поиск элемента осуществляется по наименованию и наименованию родительского элемента ("Питающий Пункт")<br>
                3. Каждая ячейка таблицы импортируется в поле, строго соответствующее названию:<br>
                - Данные стобца "A" - "organization_name" (Наименование организации)<br>
                - Данные стобца "B" - "combined_title" (№ ПП)<br>
                - Данные стобца "C" - "title" (№ опор по схеме)<br>
                - Данные стобца "E" - "address" (Адрес расположения)<br>
                - Данные стобца "F" - "allocation_type" (Вид размещения)<br>
                - Данные стобца "G" - "places_for_nodes_quantity" (Количество мест на опоре под узлы креплений для данного вида размещений, шт.)<br>
                - Данные стобца "H" - "allocations_quantity" (Количество размещений данного вида на опоре, шт.)<br>
                - Данные стобца "I" - "transfered_places_quantity" (Количество переданных мест на опоре (узлов креплений), шт. Всего)<br>
                - Данные стобца "J" - "transfered_places_quantity_before_2018" (Количество переданных мест на опоре (узлов креплений), шт. В том числе по договорам заключенным до 01.01.2018)<br>
                - Данные стобца "K" - "transfered_places_quantity_after_2019" (Количество переданных мест на опоре (узлов креплений), шт. В том числе по договорам заключенным после 01.01.2019)<br>
                - Данные стобца "L" - "status" (Статус)<br>
                - Данные стобца "M" - "changes_impl_month" (Месяц внесения изменений в договор)
            </div>

        </div>

        <div class="step">
            <h2>Шаг 1. Выберите файл для импорта</h2>
            <button @click="$refs.file.click()" class="btn btn-info">
                <i class="fas fa-plus-circle"></i>
                Выбрать файл
            </button>
            <input id="file" hidden ref="file" type="file" @change="selectFile()" accept=".xls, .xlsx" />
        </div>

        <div class="step" v-if="fileName !== ''">
            <h2>Шаг 2. Выберите слой, в элементы которого необходимо загрузить данные</h2>
            <select id="layers" required class="form-control" v-model="layer">
                <option v-for="layer in resolveLayers" :value="layer" :title="layer.title">
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
        @Action private administratorLayerGetByType: any;

        @State('administratorLayer') private layerState: LayerState;

        @Provide()
        private layer: ILayer = {
            id: 0,
            alias: '',
            title: 'Опоры',
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
                parseType: 'xls',
            }).then(() => {
                SuccessNotifier.notify('Импорт завершен', 'Данные файла были успешно выгружены в систему');
            });
        }

        /***
         * Фильтрация слоёв
         */
        private get resolveLayers() {
            return this.layerState.layers.filter((layer: ILayer) => {
                return (layer.title === 'Опоры' ? true : false);
            });
        }
    }
</script>