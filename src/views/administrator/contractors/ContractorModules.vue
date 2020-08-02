<template>
    <!-- Modal -->
    <div class="modal fade" id="contractorModules" tabindex="-1" role="dialog" aria-labelledby="contractorModulesLabel"
         aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="contractorModulesLabel">
                        <span>Модули контрагента "{{ contractorState.contractor.name }}"</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <include-list></include-list>
                    </form>
                    <p><span class="parent-assigned-module">*</span> Данный модуль присвоен на основе родительского контрагента</p>
                </div>
            </div>
        </div>
    </div>
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

    }
</script>