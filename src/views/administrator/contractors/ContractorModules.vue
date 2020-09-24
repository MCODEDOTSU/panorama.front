<template>

    <b-modal id="contractorModules" size="xl"
             :title='`Модули контрагента ${contractorState.contractor.name}`'>

        <b-container>

            <div>

                <form>
                    <include-list></include-list>
                </form>

                <p><span class="parent-assigned-module">*</span> Данный модуль присвоен на основе родительского контрагента</p>

            </div>

        </b-container>

        <div slot="modal-footer">

            <b-button variant="secondary" @click="close">
                Закрыть
            </b-button>

        </div>

    </b-modal>

</template>

<script lang="ts">

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';

    import ContractorState from '@/store/modules/administrator/contractor/types';
    import ModuleState from '@/store/modules/administrator/module/types';

    import IncludeList from '@/components/common/IncludeList.vue';

    @Component({
        components: {IncludeList},
    })
    export default class ContractorModules extends Vue {

        @Action public administratorModuleGetAll: any;
        @Action public setIncludeList: any;
        @Action public setIncludeListActions: any;
        @Action public administratorContractorAttachToModule: any;
        @Action public administratorContractorDetachToModule: any;

        @State('administratorContractor') public contractorState: ContractorState;
        @State('administratorModule') public moduleState: ModuleState;

        @Watch('contractorState.contractor.id')
        public async onChangeContractor() {
            await this.administratorModuleGetAll();
            this.setIncludeList({
                list: this.moduleState.modules,
                key: 'contractors',
                parent: this.contractorState.contractor.id,
                availableAsChild: this.contractorState.contractor.parent_id, // Доступ от родительского контрагента
            });
            this.setIncludeListActions({
                attach: this.administratorContractorAttachToModule,
                detach: this.administratorContractorDetachToModule,
            });
        }

        public close() {
            // @ts-ignore
            this.$bvModal.hide('contractorModules');
        }

    }
</script>