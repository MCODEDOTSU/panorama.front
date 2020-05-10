import FileUploaderState from '@/store/modules/components/utils/fileuploader/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';
import SuccessNotifier from '@/domain/util/notifications/SuccessNotifier';

export const state: FileUploaderState = {
    path: {
        path: '',
        name: '',
    },
    file: null,
};

export const actions: ActionTree<FileUploaderState, RootState> = {
    uploadFile({state}, payload) {
        const formData = new FormData();
        formData.append('fileres', payload.fileres.files[0]);
        formData.append('identifier', payload.identifier);
        formData.append('elementId', payload.elementId);

        return new Promise((resolve) => {
            axios.post(`${baseUrlAPI}util/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                state.path.path = response.data;
                SuccessNotifier.notify('', 'Файл загружен');
                resolve();
            }).catch((error) => {
                ErrorNotifier.notifyWithCustomMessage(error.response.data);
            });
        });


    },

    async downloadFile({state}, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}util/file/download`, payload, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', payload.filepath.name);
            document.body.appendChild(link);
            link.click();
        } catch {
            ErrorNotifier.notify();
        }
    },

    deleteFile({}, payload) {
        return new Promise((resolve) => {
            axios.post(`${baseUrlAPI}util/file/delete`, payload).then((response) => {
                resolve(response.data);
            }).catch(() => {
                ErrorNotifier.notify();
            });
        });
    },

    uploadKmlFile({state}, payload) {
        const formData = new FormData();
        formData.append('kmz', payload.fileres.files[0]);

        return new Promise((resolve) => {
            axios.post(`${baseUrlAPI}kmz/parse`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(() => {
                SuccessNotifier.notify('', 'Файл загружен');
                resolve();
            }).catch((error) => {
                ErrorNotifier.notifyWithCustomMessage(error.response.data);
            });
        });
    },
};

export const fileuploader: Module<FileUploaderState, RootState> = {
    state, actions,
};
