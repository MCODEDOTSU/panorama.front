<template>
    <div v-if="field.type === 'doc_field'">
        <div class="file-type">
            <span >Тип документа: </span>
            <label v-for="enumValue in field.enums">"{{ enumValue }}" &nbsp</label>
            <span>Осталось файлов: {{ totalQuantity }}</span>
        </div>
        <input id="file" hidden ref="file" type="file" @change="processFile()"/>
        <span @click="attachFile">Прикрепить</span>
        <div v-for="(attachedFile, index) in field.value" :key="index">
            <div>
                <button class="btn btn-danger btn-link" @click="download(attachedFile)">{{ attachedFile.name }}</button>
                <button type="button" class="btn btn-danger btn-link"
                    @click="remove(field, attachedFile, index)"><i class="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
    import TableField from '@/domain/entities/constructor/TableField';
    import {IFile} from '@/store/modules/components/utils/fileuploader/types';

    @Component
    export default class DocField extends Vue {
        @Prop() private field: any;

        @Provide() private totalQuantityValue: number = 3;

        @Provide() private file = '';
        @Provide() private fileName = '';

        @Action private uploadFile: any;
        @Action private downloadFile: any;
        @Action private deleteFile: any;
        @State('fileuploader') private fileUploader: any;
        @State('konstructor') private konstructor: any;

        private processFile() {
            // TODO: introduce variable
            // @ts-ignore
            this.file = this.$refs.file.files[0];
            // @ts-ignore
            this.fileName = this.$refs.file.files[0].name;

            if (this.totalQuantity <= 0) {
                ErrorNotifier.notifyWithCustomMessage('Достигнуто максимальное кол-во прикрепляемых файлов');
                return;
            }

            this.uploadFile({
                fileres: this.$refs.file,
                identifier: this.field.id,
            }).then(() => {
                this.fileUploader.path.name = this.fileName;

                if (!this.field.value) {
                    this.field.value = [];
                }
                this.field.value.push({...this.fileUploader.path});
            });

        }

        private attachFile() {
            document.getElementById('file').click();
        }

        private download(attachedFile: IFile) {
            if (attachedFile) {
                this.downloadFile({filepath: attachedFile});
            } else {
                ErrorNotifier.notifyWithCustomMessage('Путь к файлу не найден');
            }
        }

        private remove(field: TableField, attachedFile: IFile, index: number) {
            this.deleteFile({
                filepath: attachedFile.path,
                tableIdentifier: field.table_identifier,
                columnName: field.tech_title,
                elementId: this.konstructor.element.id,
                index,
            }).then((response) => {
                field.value = response;
            });
        }

        get totalQuantity() {
            if (this.field.value) {
                return this.totalQuantityValue - this.field.value.length;
            }

            return this.totalQuantityValue;
        }
    }
</script>

<style>
    .file-type {
        color: red;
    }
</style>
