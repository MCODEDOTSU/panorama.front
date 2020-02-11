import FileUploaderState from '@/store/modules/components/utils/fileuploader/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';
import {baseUrlAPI} from '@/globals';
import axios from 'axios';

export const state: FileUploaderState = {
    path: '',
    file: null,
};

export const actions: ActionTree<FileUploaderState, RootState> = {
    async uploadFile({state}, payload) {
        const formData = new FormData();
        formData.append('fileres', payload.files[0]);

        try {
            const res = await axios.post(`${baseUrlAPI}util/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            state.path = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const fileuploader: Module<FileUploaderState, RootState> = {
    state, actions,
};
