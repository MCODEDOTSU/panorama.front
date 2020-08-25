<template>
    <div>

        <label :for="id" class="title">{{ title }}</label>
        <input type="text" :id="id" readonly
               class="form-control"
               :placeholder="title"
               v-model="value.title"
               v-b-modal.awesomeSelectorList>
        <div class="actions">
            <a class="btn btn-link btn-danger" @click="clean">Очистить</a>
        </div>

        <b-modal id="awesomeSelectorList" size="l"
                 :title="`Выбрать ${title}`">

            <b-container>

                <form class="awesome-selector-dialog">

                    <div class="awesome-selector-search">
                        <input v-model="search" placeholder="Начните ввод для поиска"/>
                        <button class="btn btn-info btn-clean-search" @click="search = ''"><i class="fa fa-times"></i></button>
                    </div>

                    <div class="awesome-selector-items">

                        <div class="awesome-selector-item" v-for="item in resolveList">
                            <a :href="`#${item.id}`" :title="item.title" @click="select(item)">{{ item.title }}</a>
                        </div>

                    </div>


                </form>

            </b-container>

            <div slot="modal-footer"></div>

        </b-modal>

    </div>
</template>
<script lang="ts">

    import { Component, Vue, Emit, Provide, Prop, Watch } from 'vue-property-decorator';

    @Component({
        components: { },
    })

    export default class AwesomeSelector extends Vue {

        @Prop() private title: string;

        @Prop() private id: string;

        @Prop() private list: Array<{
            id: any;
            title: string;
        }>;

        @Prop() private value: {
            id: number;
            title: string;
        };

        @Provide() private search = '';

        @Emit()
        public onchange(value: any) {
            return value;
        }

        private clean() {
            this.resolveValue = {
                id: 0,
                title: '',
            };
        }

        private select(item) {
            this.resolveValue = item;
            // @ts-ignore
            this.$bvModal.hide('awesomeSelectorList');
        }

        get resolveList() {
            return this.list.filter((item: any) => {
                return (item.title.toLowerCase().indexOf(this.search.toLowerCase()) + 1);
            });
        }

        get resolveValue() {
            return this.value;
        }

        set resolveValue(item) {
            this.onchange(item);
        }

    }

</script>