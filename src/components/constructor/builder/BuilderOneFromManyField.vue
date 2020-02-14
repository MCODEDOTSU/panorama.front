<template>
    <div class="col-12 col col-enums">
        <div class="row no-gutters" v-if="tableField.type === 'one_from_many_field'">
            <div class="col-4 col">
                <div class="alert alert-info">Перечислите значения, разделяя их пробелом</div>
            </div>
            <div class="col-8 col">
                <tag-selector  v-model="tableField.enums" name="enums"/>
            </div>
        </div>

        <div class="col-12 col col-enums" v-if="tableField.type === 'one_from_many_field'">
            <div class="row no-gutters">
                <div class="col-2 col">
                    <div class="alert alert-info">По умолчанию:</div>
                </div>
                <div class="col-4 col">
                    <select class="form-control" id="cars" v-model="tableField.options.default">
                        <option v-for="enumOpt in tableField.enums" :value="enumOpt">{{ enumOpt }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import TableField from '@/domain/entities/constructor/TableField';
    import TagSelector from 'vue-tag-selector';

    @Component({
        components: { TagSelector }
    })
    export default class BuilderOneFromManyField extends Vue {
        @Prop() private tableField: TableField;


    }
</script>
