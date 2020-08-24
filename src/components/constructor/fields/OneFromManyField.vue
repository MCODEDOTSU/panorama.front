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
    import {Component, Prop, Vue, Inject} from 'vue-property-decorator';

    @Component
    export default class OneFromManyField extends Vue {

        @Prop() private field: any;

        // TODO: this error is ignored. check if there is another possibility to get rid of this
        // @ts-ignore
        @Inject('validator') private $validator: any;

        get resolvedValue() {
            if (!this.field.value) {
                this.field.value = this.field.options.default;
            }
            return this.field.value;
        }

        set resolvedValue(value) {
            this.field.value = value;
        }
    }
</script>
