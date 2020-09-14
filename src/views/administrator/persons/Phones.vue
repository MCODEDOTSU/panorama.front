<template>
    <label for="singlePersonPhones" class="title">Телефоны</label>
    <textarea id="singlePersonPhones" class="form-control" v-model="personState.person.phones"></textarea>
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

        set resolvedPhones(type: string, phone: string)
        {
            // this.personState.phones = JSON.stringify()
            let phones = JSON.parse(this.personState.person.phones);
            phones.push({type, phone});
            this.personState.person.phones = JSON.stringify(phones);
        }

        get resolvedPhones() {
            if (this.personState.person.phones === null || this.personState.person.phones === '') {
                return [];
            }
            return JSON.parse(this.personState.person.phones);
        }

    }
</script>