<template>
    <div>
        <datepicker :id="field.tech_title" :input-class="'form-control'" v-model="resolvedDate"
                    placeholder="Выбрать дату" :language="ru" :disabled-dates="disabledDates"></datepicker>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Provide, Vue, Inject} from 'vue-property-decorator';
    import Datepicker from 'vuejs-datepicker';
    import {ru} from 'vuejs-datepicker/dist/locale';

    @Component({
        components: {Datepicker},
    })
    export default class DateField extends Vue {

        @Prop() private field: any;
        @Provide() private ru: any = ru;

        @Provide() private disabledDates = {
            ranges: this.getDisabledDates(),
        };

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Inject('validator') private $validator: any;

        public getDisabledDates() {
            const ranges = [];
            if (this.field.options.minDate) {
                ranges.push({
                    from: new Date(-99999, 0, 0),
                    to: new Date(this.field.options.minDate),
                });
            }
            if (this.field.options.maxDate) {
                ranges.push({
                    from: new Date(this.field.options.maxDate),
                    to: new Date(99999, 0, 0),
                });
            }
            return ranges;
        }

        get resolvedDate() {
            if (this.field.value) {
                return this.field.value;
            } else {
                return '';
            }
        }

        set resolvedDate(value) {
            this.field.value = value;
        }
    }
</script>
