<template>
    <div class="geom-data-container">
        <gis-data></gis-data>
    </div>
</template>
<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator';
    import GisData from '@/components/utils/GisData/GisData.vue';
    @Component({
        components: { GisData },
    })
    export default class Geo extends Vue { }
</script>