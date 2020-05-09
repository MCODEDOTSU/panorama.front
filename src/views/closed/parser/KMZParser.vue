<template>
    <div class="manager-geom-data-container">
        <h4>
            Загрузить KMZ файл
        </h4>
        <input id="file" hidden ref="file" type="file" @change="processFile()"/>
        <span @click="attachFile">Прикрепить</span>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action} from 'vuex-class';
    import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';

    @Component
    export default class KMZParser extends Vue {

        @Action private uploadKmlFile: any;

        private attachFile() {
            document.getElementById('file').click();
        }

        private processFile() {
            // TODO: introduce variable
            // @ts-ignore
            this.file = this.$refs.file.files[0];
            // @ts-ignore
            this.fileName = this.$refs.file.files[0].name;

            this.uploadKmlFile({
                fileres: this.$refs.file,
            }).then(() => {
                SuccessNotifier.notify('File has been uploaded', 'It is uploaded');
            });
        }

    }
</script>