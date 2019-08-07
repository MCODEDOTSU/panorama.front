<template>
    <div>
        <input type="text" :id="field.tech_title" v-if="field.type === 'text_field'"
               class="form-control" v-model="field.value"
               :placeholder="field.title">
        <input type="number" :id="field.tech_title" v-if="field.type === 'number_field'"
               class="form-control" v-model="field.value"
               :placeholder="field.title">
        <textarea class="form-control" id="claim_comment" v-if="field.type ==='long_text_field'"
                  rows="3" v-model="field.value"></textarea>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ResolvedField extends Vue {
        @Prop() public field: any;

    }
</script>
