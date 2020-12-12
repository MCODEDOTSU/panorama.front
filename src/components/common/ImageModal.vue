<template>
    <b-modal id="imageModal" centered>
        <div slot="modal-header">
            <button @click="$bvModal.hide('imageModal')" type="button" aria-label="Close" class="close">×</button>
        </div>
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