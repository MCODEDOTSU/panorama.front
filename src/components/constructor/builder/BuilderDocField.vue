<template>
    <div>
        <div class="col-12 col col-enums" v-if="tableField.type === 'doc_field'">
            <div class="row no-gutters">
                <div class="col-4 col">
                    <div class="alert alert-info">Перечислите типы файлов, разделяя их пробелом</div>
                </div>
                <div class="col-8 col">
                    <tag-selector v-model="tableField.enums" name="enums"/>
                </div>
            </div>
        </div>

        <div class="col-12 col col-enums" v-if="tableField.type === 'doc_field'">
            <div class="row no-gutters">
                <div class="col-4 col">
                    <div class="alert alert-info">Макс. кол-во</div>
                </div>
                <div class="col-4 col">
                    <input type="number" class="form-control" min="1"
                           placeholder="Кол-во" v-model="tableField.options.quantity">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import TagSelector from 'vue-tag-selector';

    @Component({
        components: { TagSelector, BuilderDocField },
    })
    export default class BuilderDocField extends Vue {
        @Prop() private tableField: any;

    }
</script>
