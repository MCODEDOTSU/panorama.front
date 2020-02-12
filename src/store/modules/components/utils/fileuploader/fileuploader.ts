import FileUploaderState from '@/store/modules/components/utils/fileuploader/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';

export const state: FileUploaderState = {
    path: {
        path: '',
        name: '',
    },
    file: null,
};

export const actions: ActionTree<FileUploaderState, RootState> = {
    async uploadFile({state}, payload) {
        const formData = new FormData();
        formData.append('fileres', payload.files[0]);

        try {
            const res = await axios.post(`${baseUrlAPI}util/file/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            state.path.path = res.data;
        } catch {
            ErrorNotifier.notify();
        }
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

    async deleteFile({}, payload) {
        try {
            const res = await axios.post(`${baseUrlAPI}util/file/delete`, payload);
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const fileuploader: Module<FileUploaderState, RootState> = {
    state, actions,
};
