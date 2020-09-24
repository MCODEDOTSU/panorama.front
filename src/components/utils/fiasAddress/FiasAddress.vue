<template>
    <div class="fias-address-input">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="fiasAddress">Адрес</label>
                    <input
                        v-model="address"
                        @change="onChangeAddress()"
                        id="fiasAddress"
                        class="form-control"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import { Component, Vue, Emit, Provide, Prop, Watch } from 'vue-property-decorator';
    import IFiasAddress from '@/domain/interfaces/IFiasAddress';

    @Component({
        components: { },
    })
    export default class FiasAddress extends Vue {

        @Prop('FiasAddress') public value: IFiasAddress = null;
        @Provide('String') public address: string = '';
        @Provide('FiasAddress') public fiasAddress: IFiasAddress;

        // get resolvedAddress() {
        //     if (this.personState.person.address  === null) {
        //         return 0;
        //     }
        //     return (this.personState.person.address.region_id === 0 || this.personState.person.address.region_id === null) ?
        //         0 : this.personState.person.address.region_id;
        // }
        //
        // set resolvedAddress(regionId: number) {
        //     if (this.personState.person.address  === null) {
        //         this.personState.person.address = { id: 0, district: '', city: '', street: '', build: '', region_id: 0 };
        //     }
        //     this.personState.person.address.region_id = regionId;
        // }

        @Watch('value')
        public onChangeValue() {
            this.address = this.value !== null ? this.value.unrestricted_value : '';
        }
        //
        // @Emit() public Change(color: any) {
        //     return color.hex;
        // }

        /**
         * Ввели что-то в строку адреса
         */
        public onChangeAddress() {
            debugger;
        }

    }

</script>

