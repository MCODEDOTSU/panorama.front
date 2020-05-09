<template>
    <div class="col-12 col col-enums last-in-row">
        <div class="row no-gutters addition-setting-fields" v-if="tableField.type === 'one_from_many_field'">
            <div class="col-12 col last-in-row">
                <div class="alert alert-info">Дополнительные настройки поля: необходимо перечислить значения, из которых пользовать может выбрать один вариант. Значения необходимо разделять пробелом</div>
            </div>
            <div class="col-12 col last-in-row">
                <tag-selector  v-model="tableField.enums" name="enums"/>
            </div>
            <div class="col-12 col last-in-row">
                <label class="label-form-control">Значение, выбранное по умолчанию:</label>
            </div>
            <div class="col-12 col last-in-row">
                <select class="form-control" id="cars" v-model="tableField.options.default">
                    <option v-for="enumOpt in tableField.enums" :value="enumOpt">{{ enumOpt }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import TableField from '@/domain/entities/constructor/TableField';
    import TagSelector from 'vue-tag-selector';

    @Component({
        components: { TagSelector },
    })
    export default class BuilderOneFromManyField extends Vue {

        @Prop() private tableField: TableField;

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options.default = '';
            }
        }

        @Watch('tableField.enums', {deep: true})
        public onChangeEnums() {
            this.autoSelectDefaultValue();
        }

        @Watch('tableField.required')
        public onChangeRequired() {
            this.autoSelectDefaultValue();
        }

        public autoSelectDefaultValue() {
            if (this.tableField.required === true &&
                this.tableField.enums.length !== 0 &&
                this.tableField.enums.indexOf(this.tableField.options.default) === -1) {
                let options = { default: this.tableField.enums[0] };
                this.tableField.options = Object.assign({}, options);
            } else if(this.tableField.enums.length !== 0 &&
                this.tableField.options.default !== '' &&
                this.tableField.enums.indexOf(this.tableField.options.default) === -1) {
                let options = { default: this.tableField.enums[0] };
                this.tableField.options = Object.assign({}, options);
            }
        }
    }
</script>
