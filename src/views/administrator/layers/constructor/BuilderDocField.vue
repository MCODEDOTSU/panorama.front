<template>
    <div>
        <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'doc_field'">
            <div class="row no-gutters addition-setting-fields">
                <div class="col-12 col last-in-row">
                    <div class="alert alert-info">
                        Дополнительные ограничения по типу поля: при необходимости укажите формат файлов, которые может загрузить пользователь и максимальное количество файлов.
                        Форматы файлов необходимо разделять пробелами, например: "pdf doc docx"
                    </div>
                </div>
                <div class="col-12 col last-in-row">
                    <label class="label-form-control">Типы файлов (через пробел):</label>
                </div>
                <div class="col-12 col last-in-row">
                    <tag-selector v-model="tableField.enums" name="enums"/>
                </div>
                <div class="col-12 col last-in-row">
                    <label class="label-form-control">Максимальное количество файлов:</label>
                </div>
                <div class="col-12 col last-in-row">
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
    import TableField from '@/domain/interfaces/IConstructorTableField';

    @Component({
        components: { TagSelector },
    })
    export default class BuilderDocField extends Vue {
        @Prop() private tableField: TableField;

        public mounted() {
            if (this.tableField.options.length === 0) {
                this.tableField.options = { quantity: 1 };
            }
        }
    }
</script>
