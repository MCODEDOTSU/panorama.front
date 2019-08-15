<template>
    <div>
        <datepicker v-if="field.type ==='date_field'" placeholder="Выбрать дату" :language="ru" v-model="field.value"></datepicker>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import Datepicker from 'vuejs-datepicker';
    import {en, ru} from 'vuejs-datepicker/dist/locale';

    @Component({
        components: {Datepicker},
    })
    export default class DateField extends Vue {
        @Prop() private field: any;
        @Provide() private ru: any = ru;
    }
</script>
