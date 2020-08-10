<template>
    <div class="col-12 col col-enums last-in-row" v-if="tableField.type === 'directory_field'">
        <div class="row no-gutters addition-setting-fields">
            <div class="col-6 col last-in-row">
                <div class="alert alert-info">Связанный справочник</div>
            </div>
            <div class="col-6 col">
                <select id="singleUserRole" class="form-control" v-model="defaultLinkedDirectory">
                    <option :value="directory.name" v-for="directory in directoryState.directories">{{ directory.name }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TableField from '@/domain/interfaces/IConstructorTableField';
    import {Action, State} from 'vuex-class';
    import DirectoryState from '@/store/modules/administrator/constructor/directory/types';

    @Component
    export default class BuilderDirectoryField extends Vue {
        @Prop() private tableField: TableField;

        @State('directoryForConstructor') public directoryState: DirectoryState;

        @Action getAllDirectories;

        public created() {
            this.getAllDirectories();
        }

        get defaultLinkedDirectory() {
            if (this.tableField.options.linkedDirectory !== "") {
                return this.tableField.options.linkedDirectory;
            }

            return this.directoryState.directories[0].name;
        }

        set defaultLinkedDirectory(value: string) {
            this.tableField.options.linkedDirectory = value;
        }
    }

</script>