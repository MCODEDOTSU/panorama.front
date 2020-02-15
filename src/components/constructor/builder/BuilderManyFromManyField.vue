<template>
    <div class="col-12 col col-enums">
        <div class="row no-gutters" v-if="tableField.type === 'many_from_many_field'">
            <div class="col-4 col">
                <div class="alert alert-info">Перечислите значения, разделяя их пробелом</div>
            </div>
            <div class="col-8 col">
                <tag-selector  v-model="tableField.enums" name="enums"/>
            </div>
        </div>

        <div class="col-12 col col-enums" v-if="tableField.type === 'many_from_many_field'">
            <div class="row no-gutters">
                <div class="col-2 col">
                    <div class="alert alert-info">Мин.</div>
                </div>
                <div class="col-1 col">
                    <input type="number" class="form-control" min="1"
                           placeholder="Кол-во" v-model="tableField.options.min">
                </div>

                <div class="col-2 col">
                    <div class="alert alert-info">Макс.</div>
                </div>
                <div class="col-1 col">
                    <input type="number" class="form-control" min="1"
                           placeholder="Кол-во" v-model="maxCount">
                </div>

                <div class="col-2 col">
                    <div class="alert alert-info">По умолчанию.</div>
                </div>
                <div class="col-4 col">
                    <select class="form-control" id="cars" multiple v-model="tableField.options.default">
                        <option v-for="enumOpt in tableField.enums" :value="enumOpt">{{ enumOpt }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import TagSelector from 'vue-tag-selector';
    import TableField from '@/domain/entities/constructor/TableField';

    @Component({
        components: { TagSelector },
    })
    export default class BuilderManyFromManyField extends Vue {
        @Prop() private tableField: TableField;

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
