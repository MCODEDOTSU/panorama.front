<template>
    <div>
        <datepicker v-if="field.type === 'date_field'" placeholder="Выбрать дату" :language="ru"
                    :input-class="'form-control'" :disabled-dates="disabledDates" v-model="resolvedDate"></datepicker>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';
    import Datepicker from 'vuejs-datepicker';
    import {ru} from 'vuejs-datepicker/dist/locale';

    @Component({
        components: {Datepicker},
    })
    export default class DateField extends Vue {
        @Prop() private field: any;
        @Provide() private ru: any = ru;

        @Provide() private disabledDates = {
            ranges: [{
                from: new Date(-99999, 0, 0),
                to: new Date(this.field.options.minDate),
            }, {
                from: new Date(this.field.options.maxDate),
                to: new Date(99999, 0, 0),
            }],
        };

        get resolvedDate() {
            if (this.field.value) {
                return this.field.value;
            } else {
                this.field.value = new Date();
                return new Date();
            }
        }

        set resolvedDate(value) {
            this.field.value = value;
        }
    }
</script>
