<script lang="ts">
    import {Vue} from 'vue-property-decorator';

    export default class VueExtended extends Vue {
        public $bvModal = {
            hide: (param: string) => {
                //
            },
        };


        set $bvModalSetter(value: { hide: (param: string) => void }) {
            this.$bvModal = value;
        }
    }
</script>