<template>
    <div>
        <div class="col-6 col">
            <select id="singleUserRole" class="form-control" v-model="field.value">
                <option :value="entity" v-for="entity in directoryState.entities">{{ entity }}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import DirectoryState from '@/store/modules/administrator/constructor/directory/types';

    @Component
    export default class DirectoryField extends Vue {

        @Prop() private field: any;
        @State('directoryForConstructor') public directoryState: DirectoryState;

        @Action getAllDirectoryEntities;

        // @ts-ignore
        @Inject('validator') private $validator: any;

        public created() {
            this.getAllDirectoryEntities(this.field.options.linkedDirectory);
        }


    }
</script>
