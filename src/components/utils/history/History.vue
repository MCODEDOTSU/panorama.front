<template>
    <div class="form-group">
        <table class="note-list-items" v-if="historyState.histories && historyState.histories.length > 0">
            <tbody>
            <tr class="item" v-for="(item, i) in historyState.histories">
                <td class="cell-value">
                    <i v-if="item.type === 'system'" class="fa fa-info-circle" title="Системная запись"></i>
                    {{ item.text }}
                </td>
                <td class="cell-author">
                    <label class="author-name">{{ item.create_user.person.lastname }} {{ item.create_user.person.firstname }} {{ item.create_user.person.middlename }}</label>
                    <label class="author-post">{{ item.create_user.post }}</label>
                    <label class="datetime">{{ getDateFormat(item.created_at) }}</label>
                </td>
                <td class="cell-action">
                    <!--<button v-if="item.type === 'user'" class="btn btn-default" @click="update(item)"><i class="fa fa-pencil"></i></button>-->
                    <button v-if="item.type === 'user'" class="btn btn-default" @click="remove(item)" data-toggle="modal" data-target="#sureModal">&times;</button>
                </td>
            </tr>
            </tbody>
        </table>
        <table class="note-list-items model">
            <tr>
                <td class="cell-value" rowspan="2">
                    <textarea class="form-control" placeholder="Примечание" v-model="historyState.history.text"></textarea>
                </td>
                <td class="cell-action">
                    <button class="btn btn-success" @click="add" :disabled="!historyState.history.text">+</button>
                </td>
            </tr>
        </table>

        <sure-modal></sure-modal>

    </div>
</template>

<script lang="ts">

    import {Watch, Emit, Provide, Prop, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import HistorySate from '@/store/modules/components/utils/history/types';
    import UserState from '@/store/modules/user/types';
    import PersonState from '@/store/modules/administrator/person/types';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { SureModal },
    })
    export default class History extends Vue {

        @Action public setHistories: any;
        @Action public addHistory: any;
        @Action public removeHistory: any;
        @Action public setHistory: any;
        @Action public unsetHistory: any;
        @Action public setSureModal: any;

        @Prop() private value: string;
        @Prop() private object: string;

        @State('administratorPerson') public personState: PersonState;
        @State('user') public userState!: UserState;
        @State('history') public historyState!: HistorySate;

        @Watch('value')
        public onChangeValue() {
            this.setHistories({ histories: this.value });
        }

        /**
         * Смонтироали компонент
         */
        public mounted() {
            this.setHistories({ histories: this.value });
        }

        /**
         * Добавить заметку в список
         */
        private add() {
            this.addHistory({
                id: this.personState.person.id,
                object: this.object
            });
            this.unsetHistory();
        }

        /**
         * Удалить заметку из списка
         */
        private remove(item) {
            this.setSureModal({
                title: 'Удалить запись?',
                text: `Вы уверены, что хотите удалить запись "${item.text}" из системы?`,
                action: async () => {
                    this.setHistory(item);
                    this.removeHistory({
                        id: this.personState.person.id,
                        object: this.object
                    });
                    this.unsetHistory();
                },
            });
        }

        /**
         * Вывести дату в нужном формате
         * @param dt
         */
        private getDateFormat(dt) {
            const date = new Date(dt);
            const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        }
    }
</script>
