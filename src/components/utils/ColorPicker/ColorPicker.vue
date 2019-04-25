<template>
    <div class="color-picker" v-if="value">

        <div class="input-group" @click="isShowModal = !isShowModal">
            <div class="input-group-prepend color-picker-input">
                <div class="input-group-text" :style="`background-color:${color.hex};`"><i class="fas fa-palette"></i></div>
            </div>
            <input type="text" class="form-control color-picker-input" v-model="color.hex"
                   :style="`background-color:${color.hex}30;`"
                   readonly/>
        </div>

        <div class="color-picker-modal" v-show="isShowModal">
            <div class="color-picker-modal-wrapper" @click="isShowModal = false"></div>
            <sketch-picker v-model="color" class="color-picker-sketch-picker" @input="Change"></sketch-picker>
        </div>

    </div>
</template>
<script lang="ts">

    import { Component, Vue, Emit, Provide, Prop, Watch } from 'vue-property-decorator';
    import { Sketch } from 'vue-color';

    @Component({
        components: {'sketch-picker': Sketch},
    })
    export default class ColorPicker extends Vue {

        @Prop() public value: any;

        @Provide('Boolean') public isShowModal = false;
        @Provide() public color = {
            hex: this.value,
        };

        @Watch('value', {deep: true})
        public onChangeValue() {
            this.color = {
                hex: this.value,
            };
        }

        @Emit() public Change(color: any) {
            return color.hex;
        }

    }

</script>

<style lang="scss">
    .color-picker {
        position: relative;
        .color-picker-input {
            cursor: pointer;
        }
        .color-picker-modal {
            position: absolute;
            top: -20px;
            left: 20px;
        }
        .color-picker-sketch-picker {
            position: relative;
            z-index: 10000;
        }
        .color-picker-modal-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }
        .fa-palette {
            background: #fff;
            padding: 3px;
            border-radius: 50%;
        }
    }
</style>

