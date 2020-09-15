<template>

    <b-modal id="singleContractorTosModal" size="xl"
             :title="contractorTosState.contractorTos.id === 0 ? 'Создание нового ТОСа' :
             `Изменение ТОСа: ${contractorTosState.contractorTos.contractor.name}`">

        <b-container>

            <div class="form-group">
                <awesome-selector title="Контрагент" id="singleContractorTosContractor"
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

    import ContractorTosState from '@/store/modules/administrator/contractorTos/types';
    import ContractorState from '@/store/modules/administrator/contractor/types';

    import AwesomeSelector from '@/components/utils/awesomeSelector/AwesomeSelector.vue';

    @Component({
        components: { AwesomeSelector },
    })
    export default class SingleContractorTos extends Vue {

        @Action public administratorContractorTosUpdate: any;
        @Action public administratorContractorGetAll: any;

        @State('administratorContractorTos') public contractorTosState: ContractorTosState;
        @State('administratorContractor') public contractorState: ContractorState;

        public async created() {
            this.administratorContractorGetAll();
        }

        public contractorChange(item) {
            this.contractorTosState.contractorTos.contractor_id = item.id;
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
            return (this.contractorTosState.contractorTos.contractor === null || this.contractorTosState.contractorTos.contractor === undefined) ? {
                id: 0, title: '',
            } : {
                id: this.contractorTosState.contractorTos.contractor.id,
                title: this.contractorTosState.contractorTos.contractor.name,
            };
        }

        set resolvedContractor(item) {
            this.contractorTosState.contractorTos.contractor = Object.assign({}, {
                id: item.id, name: item.title, full_name: item.title,
            });
        }

        public save() {
            this.administratorContractorTosUpdate();
            // @ts-ignore
            this.$bvModal.hide('singleContractorTosModal');
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('singleContractorTosModal');
        }

    }
</script>