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
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class';
    import ContractorState from '@/store/modules/manager/contractor/types';
    import ModuleState from '@/store/modules/manager/module/types';
    import IncludeList from '@/components/common/IncludeList.vue';

    @Component({
        components: {IncludeList},
    })
    export default class SingleContractor extends Vue {

        @Action public managerGetModules: any;
        @Action public setIncludeList: any;
        @Action public setIncludeListActions: any;
        @Action public attachContractorToModule: any;
        @Action public detachContractorToModule: any;

        @State('managerContractor') public contractorState: ContractorState;
        @State('managerModule') public moduleState: ModuleState;

        @Watch('contractorState.contractor.id')
        public async onChangeContractor() {
            await this.managerGetModules();
            this.setIncludeList({
                list: this.moduleState.modules,
                key: 'contractors',
                parent: this.contractorState.contractor.id,
            });
            this.setIncludeListActions({
                attach: this.attachContractorToModule,
                detach: this.detachContractorToModule,
            });
        }

    }
</script>