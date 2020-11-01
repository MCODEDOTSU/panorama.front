<template>
    <b-modal id="imageModal" centered>
        <b-container>
           <div>
               <b-img :src="value" fluid></b-img>
           </div>
        </b-container>
        <div slot="modal-footer"></div>
    </b-modal>
</template>

<script lang="ts">
    import {Provide, Prop, Watch, Component, Vue} from 'vue-property-decorator';
    @Component({ })
    export default class ImageModal extends Vue {
        @Provide() src: string;
        @Prop({ type: String, default: '' }) value!: string;
    }
</script>