<template>
    <div>
        <div class="form-group" v-for="field in constructorState.tableFields">
            <label :for="field.tech_title">{{ field.title }}
                <span v-if="field.required">*</span>
                <span></span>
            </label>
            <resolved-field :field="field"></resolved-field>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import ConstructorState from '@/store/modules/constructor/types';
    import ResolvedField from '@/views/closed/constructor/ResolvedField.vue';
    @Component({
        components: {ResolvedField},
    })
    export default class AdditionalInformation extends Vue {

        @State('constructor') public constructorState: ConstructorState;

    }
</script>
