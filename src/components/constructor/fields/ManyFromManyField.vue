<template>
    <div>
        <div v-for="enumValue in JSON.parse(field.enums)" class="one-from-many-div" v-if="field.type === 'many_from_many_field'">
            <label :for="enumValue">{{ enumValue }}</label>
            <input type="radio" :id="enumValue" class="form-control" :value="enumValue" v-model="field.value">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class OneFromManyField extends Vue {
        @Prop() private field: any;
    }
</script>
<style>
    .one-from-many-div {
        display: inline-block;
        margin-left: 30px
    }
</style>
