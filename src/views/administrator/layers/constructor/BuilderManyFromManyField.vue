<template>
    <div class="col-12 col col-enums last-in-row">
        <div class="row no-gutters addition-setting-fields" v-if="tableField.type === 'many_from_many_field'">
            <div class="col-12 col last-in-row">
                <div class="alert alert-info">
                    Дополнительные настройки поля: необходимо перечислить значения, из которых пользовать может выбрать несколько вариантов. Значения необходимо разделять пробелом.
                    При необходимости укажите минимально и максимально допустимое количество вариантов, которые может выбрать пользователь.
                </div>
            </div>
            <div class="col-12 col last-in-row">
                <tag-selector  v-model="tableField.enums" name="enums"/>
            </div>
            <div class="col-12 col last-in-row">
                <label class="label-form-control">Значения, выбранные по умолчанию (можно указать несколько значений):</label>
            </div>
            <div class="col-12 col last-in-row">
                <select class="form-control multiple-select" id="cars" multiple v-model="tableField.options.default">
                    <option v-for="enumOpt in tableField.enums" :value="enumOpt">{{ enumOpt }}</option>
                </select>
            </div>
            <div class="col-6 col">
                <label class="label-form-control">Минимальное количество вариантов:</label>
            </div>
            <div class="col-6 col last-in-row">
                <label class="label-form-control">Максимальное количество вариантов:</label>
            </div>
            <div class="col-6 col">
                <input type="number" class="form-control" min="1"
                       placeholder="Кол-во" v-model="tableField.options.min">
            </div>
            <div class="col-6 col last-in-row">
                <input type="number" class="form-control" min="1"
                       placeholder="Кол-во" v-model="maxCount">
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import TagSelector from 'vue-tag-selector';
    import TableField from '@/domain/interfaces/IConstructorTableField';

    @Component({
        components: { TagSelector },
    })
    export default class BuilderManyFromManyField extends Vue {
        @Prop() private tableField: TableField;

        @Watch('tableField.enums', {deep: true})
        public onChangeEnums() {
            this.autoSelectDefaultValue();
        }

        @Watch('tableField.required')
        public onChangeRequired() {
            this.autoSelectDefaultValue();
        }

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { min: 1, max: 1, default: [] };
            }
            if (!Array.isArray(this.tableField.options.default)) {
                this.tableField.options.default = [];
            }
        }

        public autoSelectDefaultValue() {
            if (this.tableField.required === true &&
                this.tableField.enums.length !== 0 &&
                this.tableField.options.default.length === 0) {
                // @ts-ignore
                const options = { default: [ this.tableField.enums[0] ] };
                this.tableField.options = Object.assign({}, options);
            }
        }

        get maxCount() {
            if (!this.tableField.enums) {
                return this.tableField.options.max;
            }

            if (this.tableField.options.max >= this.tableField.enums.length) {
                return this.tableField.enums.length;
            }

            return this.tableField.options.max;
        }

        set maxCount(value) {
            this.tableField.options.max = value;
        }

    }
</script>
