import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';
import DirectoryState from '@/store/modules/administrator/constructor/directory/types';
import axios from 'axios';
import {baseUrlAPI} from '@/globals';
import ErrorNotifier from '@/domain/util/notifications/ErrorNotifier';

export const state: DirectoryState = {
    directory: {
        id: null,
        name: '',
        title: '',
    },
    directories: [],
    entities: [],
};

export const actions: ActionTree<DirectoryState, RootState> = {
    async getAllDirectories() {
        try {
            const res = await axios.get(`${baseUrlAPI}directory`);
            state.directories = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },

    async getAllDirectoryEntities({}, payload) {
        try {
            const res = await axios.get(`${baseUrlAPI}directory/entities/${payload}`);
            state.entities = res.data;
        } catch {
            ErrorNotifier.notify();
        }
    },
};

export const directoryForConstructor: Module<DirectoryState, RootState> = {
    state, actions,
};

