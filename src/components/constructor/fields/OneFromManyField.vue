<template>
    <div>
        <div v-for="enumValue in field.enums" class="one-from-many-div" v-if="field.type === 'one_from_many_field'">
            <label :for="enumValue">{{ enumValue }}</label>
            <input class="form-control" type="radio" :id="enumValue" :value="enumValue"
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
            if (this.field.value) {
                return this.field.value;
            } else {
                this.field.value = this.field.enums[0];
                return this.field.enums[0];
            }
        }

        set resolvedValue(value) {
            this.field.value = value;
        }
    }
</script>
