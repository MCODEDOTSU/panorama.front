<template>
    <div>
        <input v-if="field.type === 'doc_field'" id="file" ref="file" type="file" @change="processFile()"/>
        <span @click="attachFile">{{ fileName }}</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue} from 'vue-property-decorator';

    @Component
    export default class DocField extends Vue {
        @Prop() private field: any;

        @Provide() private file = '';
        @Provide() private fileName = '';

        private processFile() {
            // TODO: introduce variable
            // @ts-ignore
            this.file = this.$refs.file.files[0];
            // @ts-ignore
            this.fileName = this.$refs.file.files[0].name;

            this.$emit('attachFile', this.$refs.file);
        }

        private attachFile() {
            document.getElementById('file').click();
        }
    }
</script>

