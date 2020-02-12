<template>
    <div v-if="field.type === 'doc_field'">
        <input id="file" hidden ref="file" type="file" @change="processFile()"/>
        <span v-if="fileName === ''" @click="attachFile">Прикрепить</span>
        <span v-else @click="attachFile">{{ fileName }}</span>
        <br>
        <span v-if="field.value !== null">
            <a href="javascript:void(0)" @click="download">Скачать файл</a>
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

    @Component
    export default class DocField extends Vue {
        @Prop() private field: any;

        @Provide() private file = '';
        @Provide() private fileName = '';

        @Action private uploadFile: any;
        @Action private downloadFile: any;
        @State('fileuploader') private fileUploader: any;

        private processFile() {
            // TODO: introduce variable
            // @ts-ignore
            this.file = this.$refs.file.files[0];
            // @ts-ignore
            this.fileName = this.$refs.file.files[0].name;

            this.uploadFile(this.$refs.file).then(() => {
                this.fileUploader.path.name = this.fileName;
                this.$emit('attachFilePath', this.fileUploader.path);
            });

        }

        private attachFile() {
            document.getElementById('file').click();
        }

        private download() {
            if (this.field.value) {
                this.downloadFile({filepath: this.field.value});
            } else {
                ErrorNotifier.notifyWithCustomMessage('Путь к файлу не найден');
            }
        }
    }
</script>

