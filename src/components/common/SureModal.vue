<template>
    <!-- Modal -->
    <div class="modal fade" id="sureModal" tabindex="-1" role="dialog" aria-labelledby="sureModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="sureModalLabel">{{ sureModalState.modal.title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>{{ sureModalState.modal.text }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" test-tag="button-ok" class="btn btn-danger" data-dismiss="modal" @click="ok()">{{ sureModalState.modal.buttonOk }}</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal" @click="cansel()">{{ sureModalState.modal.buttonCansel }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import SureModalState from '@/store/modules/components/common/sureModal/types';

    @Component({ })
    export default class SureModal extends Vue {

        @State('sureModal') public sureModalState: SureModalState;

        public ok() {
            if (this.sureModalState.modal.action !== false) {
                this.sureModalState.modal.action();
            }
        }

        public cansel() {
            if (this.sureModalState.modal.actionCansel !== false) {
                this.sureModalState.modal.actionCansel();
            }
        }

    }
</script>