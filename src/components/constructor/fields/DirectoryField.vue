<template>
    <div>
        <div class="col-6 col">
            <select id="singleUserRole" class="form-control" v-model="field.value">
                <option :value="entity.id" v-for="entity in directoryState.entities">{{ entity.value }}</option>
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

        @State('directoryForConstructor') public directoryState: DirectoryState;

        @Action public getAllDirectoryEntities;

        @Prop() private field: any;

        // @ts-ignore
        @Inject('validator') private $validator: any;

        public created() {
            this.getAllDirectoryEntities(this.field.options.linkedDirectory);
        }


    }
</script>
