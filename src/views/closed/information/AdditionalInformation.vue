<template>
    <div>
        <div class="form-group" v-for="field in constructorState.tableFields">
            <label :for="field.tech_title">{{ field.title }} *</label>
            <input type="text" :id="field.tech_title"
                   class="form-control"
                   :placeholder="field.title">
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import ConstructorState from '@/store/modules/constructor/types';

    @Component
    export default class AdditionalInformation extends Vue {

        @State('constructor') public constructorState: ConstructorState;



    }
</script>
