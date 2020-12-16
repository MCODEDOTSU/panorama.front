<template>
    <div class="form-group">
        <label>Телефоны</label>
        <table class="phones-list-items">
            <tbody>
            <tr class="item" v-for="(phone, i) in phonesState.phones">
                <td class="cell-type">{{ phone.type }}</td>
                <td class="cell-value">
                    <a :href="`tel:${phone.value}`" :title="phone.value">{{ phone.value }}</a>
                </td>
                <td class="cell-action">
                    <button class="btn" @click="remove(i)">&times;</button>
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr v-if="!disabled">
                <td class="cell-type">
                    <select v-model="phonesState.phone.type" class="form-control">
                        <option value="Домашний">Домашний</option>
                        <option value="Рабочий">Рабочий</option>
                        <option value="Мобильный">Мобильный</option>
                    </select>
                </td>
                <td class="cell-value">
                    <the-mask :mask="['#(###)###-##-##', '#(####)##-##-##']"
                              class="form-control" id="singlePersonPhones"
                              v-model="phonesState.phone.value" type="text"></the-mask>
                </td>
                <td class="cell-action">
                    <button class="btn btn-success" @click="add()" :disabled="!phonesState.phone.value">+</button>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">

    import {Watch, Prop, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import PhonesState from '@/store/modules/components/utils/phones/types';
    import UserState from '@/store/modules/user/types';
    import IPhone from "../../../domain/interfaces/IPhone";

    @Component({
        components: {  },
    })
    export default class Phones extends Vue {

        @Action public setPhones: any;
        @Action public addPhone: any;
        @Action public removePhone: any;
        @Action public unsetPhone: any;

        @Prop() private value: IPhone[];
        @Prop() private disabled: Boolean;

        @State('user') public userState!: UserState;
        @State('phones') public phonesState!: PhonesState;

        @Watch('value')
        public onChangeValue() {
            this.setPhones({ phones: this.value });
        }

        /**
         * Смонтироали компонент
         */
        public mounted() {
            this.setPhones({ phones: this.value });
        }

        /**
         * Добавить телефон в список
         */
        private add() {
            this.addPhone({});
            this.unsetPhone();
        }

        /**
         * Удалить телефон из списка
         */
        private remove(index) {
            this.removePhone({ index });
        }
    }
</script>