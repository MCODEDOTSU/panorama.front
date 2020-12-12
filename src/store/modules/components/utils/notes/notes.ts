import NotesState from '@/store/modules/components/utils/notes/types';
import {ActionTree, Module} from 'vuex';
import RootState from '@/store/types';

export const state: NotesState = {
    note: {
        dt: Date.now(),
        value: '',
        author: '',
    },
    notes: [],
};

export const actions: ActionTree<NotesState, RootState> = {
    /**
     * Задать список заметок
     * @param state
     * @param payload
     */
    setNotes({state}, payload) {
        if (!payload.notes) {
            state.notes = [];
        } else {
            const notes = JSON.parse(payload.notes);
            state.notes = typeof notes !== 'object' ? [ { dt: '', value: notes, author: '' } ] : notes;
        }
    },
    /**
     * Добавить заметку в список
     * @param state
     * @param payload
     */
    addNote({state}, payload) {
        if (!state.note.value && !payload.note) {
            return;
        }
        state.note.dt = Date.now();
        state.note.author = payload.author;
        state.note.value = payload.note ? payload.note : state.note.value;
        state.notes.push(state.note);
    },
    /**
     * Удалить заметку по индексу
     * @param state
     * @param payload
     */
    removeNote({state}, payload) {
        state.notes.splice(payload.index, 1);
    },
    /**
     * Очистить поле заметки
     */
    unsetNote() {
        state.note = {
            dt: Date.now(),
            value: '',
            author: '',
        };
    },
};

export const notes: Module<NotesState, RootState> = {
    state, actions,
};
