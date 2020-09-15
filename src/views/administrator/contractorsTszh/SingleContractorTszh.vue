<template>

    <b-modal id="singleContractorTszhModal" size="xl"
             :title="contractorTszhState.contractorTszh.id === 0 ? 'Создание нового ТОСа' :
             `Изменение ТОСа: ${contractorTszhState.contractorTszh.contractor.name}`">

        <b-container>

            <div class="form-group">
                <awesome-selector title="Контрагент" id="singleContractorTszhContractor"
                                  :list="resolvedContractors"
                                  v-model="resolvedContractor" v-on:onchange="contractorChange">
                </awesome-selector>
            </div>

        </b-container>

        <div slot="modal-footer">

            <b-button variant="primary" @click="save" data-dismiss="modal">
                Сохранить
            </b-button>

            <b-button variant="secondary" @click="close">
                Закрыть
            </b-button>

        </div>

    </b-modal>

</template>

<script lang="ts">

    import {Provide, Component, Vue} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import ContractorTszhState from '@/store/modules/administrator/contractorTszh/types';
    import ContractorState from '@/store/modules/administrator/contractor/types';

    import AwesomeSelector from '@/components/utils/awesomeSelector/AwesomeSelector.vue';

    @Component({
        components: { AwesomeSelector },
    })
    export default class SingleContractorTszh extends Vue {

        @Action public administratorContractorTszhUpdate: any;
        @Action public administratorContractorGetAll: any;

        @State('administratorContractorTszh') public contractorTszhState: ContractorTszhState;
        @State('administratorContractor') public contractorState: ContractorState;

        public async created() {
            this.administratorContractorGetAll();
        }

        public contractorChange(item) {
            this.contractorTszhState.contractorTszh.contractor_id = item.id;
            this.resolvedContractor = item;
        }

        get resolvedContractors() {
            return this.contractorState.contractors.map((item) => {
                return {
                    id: item.id,
                    title: item.name,
                };
            });
        }

        get resolvedContractor() {
            return (this.contractorTszhState.contractorTszh.contractor === null || this.contractorTszhState.contractorTszh.contractor === undefined) ? {
                id: 0,
                title: '',
            } : {
                id: this.contractorTszhState.contractorTszh.contractor.id,
                title: this.contractorTszhState.contractorTszh.contractor.name,
            };
        }

        set resolvedContractor(item) {
            this.contractorTszhState.contractorTszh.contractor = Object.assign({}, {
                id: item.id, name: item.title, full_name: item.title,
            });
        }

        public save() {
            this.administratorContractorTszhUpdate();
            // @ts-ignore
            this.$bvModal.hide('singleContractorTszhModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singleContractorTszhModal');
        }

    }
</script>