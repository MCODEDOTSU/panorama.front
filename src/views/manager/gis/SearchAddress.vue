<template>
    <div id="search-address-form">
        <input type="text" name="address" v-model="address" v-on:keyup.enter="search"
               placeholder="Введите адрес для поиска"/>
        <button class="btn btn-success"><i class="fa fa-search" v-on:click="search"></i></button>
    </div>
</template>

<script lang="ts">

    import {Component, Provide, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    @Component({})
    export default class SearchAddress extends Vue {

        @Action public setMapCenter: any;

        @Provide() public address = '';

        public search(e) {

            if (this.address === '') {
                return;
            }

            // @ts-ignore
            ymaps.geocode(this.address, {
                results: 1,
            }).then((res) => {

                const firstGeoObject = res.geoObjects.get(0);
                const coordinates = firstGeoObject.geometry.getCoordinates();
                this.setMapCenter({
                    latitude: coordinates[0],
                    longitude: coordinates[1],
                });

            });
        }

    }

</script>