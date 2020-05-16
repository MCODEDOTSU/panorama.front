<template>
    <div>
        <div v-for="enumValue in field.enums" class="one-from-many-div">
            <input class="form-control" type="radio" :id="enumValue" :value="enumValue"
                   v-model="resolvedValue">
            <label :for="enumValue">{{ enumValue }}</label>
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
            }
            return this.field.options.default;
        }

        set resolvedValue(value) {
            this.field.value = value;
        }
    }
</script>
