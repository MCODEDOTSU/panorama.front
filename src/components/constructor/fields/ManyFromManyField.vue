<template>
    <div>
        <div v-for="enumValue in field.enums" class="many-from-many-div" v-if="field.type === 'many_from_many_field'">
            <label :for="enumValue">{{ enumValue }}</label>
            <input class="form-control" type="checkbox" :id="enumValue" :value="enumValue"
                   v-model="resolvedValue">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class OneFromManyField extends Vue {

        @Prop() private field: any;

        get resolvedValue() {
            if (this.field.value && this.field.value !== null) {
                return this.field.value;
            } else {
                this.field.value = [];
                return [];
            }
        }

        set resolvedValue(value) {
            this.field.value = value;
        }

    }
</script>
