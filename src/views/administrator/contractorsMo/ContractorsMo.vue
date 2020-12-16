<template>
    <div class="manager-container content">

        <h1>Справочник Муниципальных Образований</h1>

        <br><br>
        <div class="alert alert-info">
            Инструмент находится в разработке
        </div>

    </div>
</template>

<script lang="ts">

    import {Watch, Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import {arrayFindFirst} from '@/domain/services/common/ArrayActions';
    import axios from 'axios';
    import {baseUrl, baseUrlAPI} from '@/globals';
    import ContractorTosState from '@/store/modules/administrator/contractorTos/types';
    import SureModal from '@/components/common/SureModal.vue';

    @Component({
        components: { SureModal },
    })
    export default class ContractorsMo extends Vue { }
</script>