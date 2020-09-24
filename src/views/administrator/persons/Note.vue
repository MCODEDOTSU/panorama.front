<template>
    <div class="form-group">
        <label for="singlePersonNotes">Примечание</label>
        <table class="note-list-items">
            <tbody>
                <tr class="item" v-for="(note, i) in resolvedNote">
                    <td class="cell-dt">{{ getDateFormat(note.dt) }}</td>
                    <td class="cell-value">{{ note.value }}</td>
                    <td class="cell-action"></td>
                </tr>
            </tbody>
        </table>
        <table class="note-list-items">
            <tr>
                <td class="cell-value" rowspan="2">
                    <textarea id="singlePersonNotes" class="form-control"
                              placeholder="Примечание" v-model="note.value">
                    </textarea>
                </td>
                <td class="cell-action">
                    <button class="btn btn-success" @click="addNote()">+</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">

    import {Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import PersonState from '@/store/modules/administrator/person/types';

    @Component({
        components: {  },
    })
    export default class Note extends Vue {

        @State('administratorPerson') public personState: PersonState;

        @Provide() private note = { dt: Date.now(), value: '' };

        private addNote() {
            const note = this.resolvedNote;
            this.note.dt = Date.now();
            note.push(this.note);
            this.personState.person.note = JSON.stringify(note);
        }

        private removeNote(i) {
            const note = this.resolvedNote;
            note.splice(i, 1);
            this.personState.person.note = JSON.stringify(note);
        }

        private getDateFormat(dt) {
            const date = new Date(dt);
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }

        set resolvedNote(note) {
            this.personState.person.note = JSON.stringify(note);
        }

        get resolvedNote() {
            if (this.personState.person.note === null || this.personState.person.note === '') {
                return [ ];
            }
            let note = JSON.parse(this.personState.person.note);
            if (typeof note !== 'object') {
                note = [ { dt: '', value: note } ];
            }
            return note;
        }

    }
</script>