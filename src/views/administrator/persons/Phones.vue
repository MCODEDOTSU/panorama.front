<template>
    <div class="form-group">
        <label for="singlePersonPhones" class="title">Телефоны</label>
        <table class="phones-list-items">
            <tbody>
                <tr class="item" v-for="(phone, i) in resolvedPhones">
                    <td class="cell-type">{{ phone.type }}</td>
                    <td class="cell-value"><a :href="`tel:${phone.value}`" :title="phone.value">{{ phone.value }}</a></td>
                    <td class="cell-action">
                        <button class="btn" @click="removePhone(i)">&times;</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td class="cell-type">
                        <select v-model="phone.type" class="form-control">
                            <option value="Домашний">Домашний</option>
                            <option value="Рабочий">Рабочий</option>
                            <option value="Мобильный">Мобильный</option>
                        </select>
                    </td>
                    <td class="cell-value">
                        <the-mask :mask="['#(###)###-##-##', '#(####)##-##-##']"
                                  class="form-control" id="singlePersonPhones"
                                  v-model="phone.value" type="text"></the-mask>
                    </td>
                    <td class="cell-action">
                        <button class="btn btn-success" @click="addPhone()">+</button>
                    </td>
                </tr>
            </tfoot>
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
    export default class Phones extends Vue {

        @State('administratorPerson') public personState: PersonState;

        @Provide() private phone = { type: 'Мобильный', value: '' };

        private addPhone() {
            const phones = this.resolvedPhones;
            phones.push(this.phone);
            this.personState.person.phones = JSON.stringify(phones);
        }

        private removePhone(i) {
            const phones = this.resolvedPhones.splice(i, 1);
            phones.splice(i, 1);
            this.personState.person.phones = JSON.stringify(phones);
        }

        set resolvedPhones(phones) {
            this.personState.person.phones = JSON.stringify(phones);
        }

        get resolvedPhones() {
            if (this.personState.person.phones === null || this.personState.person.phones === '') {
                return [];
            }
            let phones = JSON.parse(this.personState.person.phones);
            if (typeof phones !== 'object') {
                phones = [ { type: 'Мобильный', value: phones } ];
            }
            return phones;
        }

    }
</script>