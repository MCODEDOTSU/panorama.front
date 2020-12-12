<template>
    <div class="form-group">
        <label>Примечание</label>
        <table class="note-list-items" v-if="notesState.notes.length > 0">
            <tbody>
                <tr class="item" v-for="(note, i) in notesState.notes">
                    <td class="cell-dt">{{ getDateFormat(note.dt) }}</td>
                    <td class="cell-value" v-html="note.value"></td>
                    <td class="cell-author">{{ note.author }}</td>
                    <td class="cell-action">
                        <button class="btn btn-default" v-if="userState.user.role === 'admin'">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="btn" @click="remove(i)">&times;</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="note-list-items model">
            <tr>
                <td class="cell-value" rowspan="2">
                    <textarea class="form-control" placeholder="Примечание" v-model="notesState.note.value"></textarea>
                </td>
                <td class="cell-action">
                    <button class="btn btn-success" @click="add" :disabled="!notesState.note.value">+</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">

    import {Watch, Emit, Provide, Prop, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import INote from '@/domain/interfaces/INote';
    import NotesState from '@/store/modules/components/utils/notes/types';
    import UserState from '@/store/modules/user/types';
    import {userSignature} from '@/domain/services/User/UserService';

    @Component({
        components: {  },
    })
    export default class Notes extends Vue {

        @Action public setNotes: any;
        @Action public addNote: any;
        @Action public removeNote: any;
        @Action public unsetNote: any;

        @Prop() private value: string;

        @State('user') public userState!: UserState;
        @State('notes') public notesState!: NotesState;

        @Watch('value')
        public onChangeValue() {
            this.setNotes({ notes: this.value });
        }

        /**
         * Смонтироали компонент
         */
        public mounted() {
            this.setNotes({ notes: this.value });
        }

        /**
         * Добавить заметку в список
         */
        private add() {
            this.addNote({ author: userSignature(this.userState.user) });
            this.unsetNote();
        }

        /**
         * Удалить заметку из списка
         */
        private remove(index) {
            this.removeNote({ index });
        }

        /**
         * Вывести дату в нужном формате
         * @param dt
         */
        private getDateFormat(dt) {
            const date = new Date(dt);
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }
    }
</script>