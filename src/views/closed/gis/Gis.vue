<template>
    <div class="manager-geom-data-container">
        <gis-data-editor></gis-data-editor>
    </div>
</template>
<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import GisDataEditor from '@/components/utils/GisDataEditor/GisDataEditor.vue';
    @Component({
        components: { GisDataEditor },
    })
    export default class Geo extends Vue { }
</script>