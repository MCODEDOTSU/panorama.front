<template>
    <div>
        <div class="files-uploader" v-bind:class="{drag: isDragover}" @drop.prevent="dropFiles" @dragover.prevent="dragoverFiles" @dragleave.prevent="dragleaveFiles">

            <div v-if="(field.value !== null && field.value !== 0) || (uploadsErrors.length !== 0)" class="files-list">

                <div class="file-item-extension" v-bind:class="{deleted: file.isDeleted }"
                     v-for="(file, i) in field.value" :title="file.title">

                    <div class="file-item-container">

                        <a class="image" v-if="isImage(file)" target="_blank"
                           :href="file.path" :style="`background-image:url('${file.path}')`">
                        </a>
                        <div class="image" v-else>
                            <a :href="file.path" target="_blank">
                                <img :src="getDocumentSrc(file)" />
                            </a>
                        </div>

                        <label class="file-title">{{ file.title }}</label>

                        <button type="button" class="btn btn-link" @click="restoreFile(i)" v-if="file.isDeleted === true">
                            <label>восстановить файл</label>
                        </button>
                        <button type="button" class="btn btn-link" @click="deleteFile(i)" v-else>
                            <label>удалить файл</label>
                        </button>

                    </div>

                </div>

                <div class="file-item error-file-item" v-for="(file, i) in uploadsErrors" :title="file.title">
                    <label class="file-title">Ошибка при загрузке "{{ file.title }}": {{ file.error }}</label>
                </div>

            </div>

            <label v-else class="add-file-info">
                Перетащите файлы в данную зону или нажмите кнопку "Добавить Файлы", что бы выбрать файлы в проводнике
            </label>

            <button class="add-file btn btn-primary" @click="selectFiles" :title="buttonText">{{ buttonText }}</button>

            <input type="file" multiple="true" class="files" ref="files" @change="uploadFiles" :accept="resolvedAccept"/>

        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
    import TableField from '@/domain/entities/constructor/TableField';
    import {IFile} from '@/store/modules/components/utils/fileuploader/types';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';

    @Component
    export default class DocField extends Vue {

        @Provide() public buttonText = 'Добавить файлы';
        @Provide() public isDragover = false;
        @Provide() public uploadsErrors = [];

        @Prop() private field: any;

        public selectFiles() {
            // @ts-ignore
            this.$el.querySelector('input.files').click();
        }

        public uploadFiles() {

            if (this.field.value === null) {
                this.field.value = [];
            }

            this.buttonText = 'Загрузка ...';

            const $fileInput: HTMLInputElement = (this.$refs.files as HTMLInputElement);
            if (!$fileInput || !$fileInput.files || $fileInput.files.length === 0) {
                return;
            }
            const data = new FormData();
            for (const file of $fileInput.files) {
                data.append('files[]', file, file.name);
            }
            data.append('metadata_id', this.field.id);
            data.append('current_count', this.field.value.length);

            axios.post(`${baseUrlAPI}files/upload`, data).then((response) => {
                this.field.value = this.field.value.concat(response.data.result);
                this.uploadsErrors = response.data.errors;
                this.buttonText = 'Добавить файлы';
            }).catch((error) => {
                ErrorNotifier.notify();
                this.buttonText = 'Добавить файлы';
            });

        }

        public dropFiles(e) {

            const droppedFiles = e.dataTransfer.files;
            if (!droppedFiles) {
                return;
            }

            if (this.field.value === null) {
                this.field.value = [];
            }

            const data = new FormData();
            for (const file of droppedFiles) {
                data.append('files[]', file, file.name);
            }
            data.append('metadata_id', this.field.id);
            data.append('current_count', this.field.value.length);

            axios.post(`${baseUrlAPI}files/upload`, data).then((response) => {
                this.field.value = this.field.value.concat(response.data.result);
                this.uploadsErrors = response.data.errors;
                this.buttonText = 'Добавить файлы';
            }).catch((error) => {
                ErrorNotifier.notify();
                this.buttonText = 'Добавить файлы';
            });

            this.isDragover = false;
        }

        public dragoverFiles() {
            this.isDragover = true;
        }

        public dragleaveFiles() {
            this.isDragover = false;
        }

        public deleteFile(i) {
            const file = Object.assign({}, this.field.value[i], { isDeleted: true });
            this.field.value.splice(i, 1, file);
        }

        public restoreFile(i) {
            const file = Object.assign({}, this.field.value[i], { isDeleted: false });
            this.field.value.splice(i, 1, file);
        }

        get resolvedAccept() {
            return this.field.enums.map((item) => {
                return '.' + item;
            }).join(',');
        }

        public isImage(file) {
            return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(file.extension) !== -1 ? true : false;
        }

        public getDocumentSrc(file) {

            if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(file.extension) !== -1) {
                return file.path;
            }

            if (['doc', 'docx'].indexOf(file.extension) !== -1) {
                return '/images/word.png';
            }

            if (['xls', 'xlsx'].indexOf(file.extension) !== -1) {
                return '/images/excel.png';
            }

            if (['ppt', 'pptx'].indexOf(file.extension) !== -1) {
                return '/images/powerpoint.png';
            }

            if (['psd'].indexOf(file.extension) !== -1) {
                return '/images/photoshop.png';
            }

            if (['ai', 'svg'].indexOf(file.extension) !== -1) {
                return '/images/program.png';
            }

            if (['3g2', '3gp', 'avi', 'flv', 'f4v', 'm4v', 'mkv', 'mov', 'mp4', 'webm', 'wmv', 'vod'].indexOf(file.extension) !== -1) {
                return '/images/vlc.png';
            }

            return '/images/window.png';
        }

    }
</script>