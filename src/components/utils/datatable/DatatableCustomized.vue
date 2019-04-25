<template>
    <div class="datatable">
        <label class="sr-only">Поиск</label>
        <input type="text" class="form-control datatable-search" v-model="tableOptions.filter" placeholder="Поиск">

        <datatable :filter-by="tableOptions.filter"
            :columns="columns"
            :data="data"
        ></datatable>

        <datatable-pager v-model="tableOptions.page" :per-page="tableOptions.perPage" type="abbreviated"></datatable-pager>

        <div class="dropup">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 {{ tableOptions.perPage }}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <li><a @click="changeItemsNumberPerPage(10)" href="javascript:void(0)">10</a></li>
                <li><a @click="changeItemsNumberPerPage(25)" href="javascript:void(0)">25</a></li>
                <li><a @click="changeItemsNumberPerPage(100)" href="javascript:void(0)">100</a></li>
            </ul>
        </div>


    </div>
</template>

<script>
    export default {
        props: {
            columns: [Object, Array],
            data: [Object, Array],
        },

        data() {
            return {
                tableOptions: {
                    page: 1,
                    filter: '',
                    perPage: 10,
                },
            };
        },

        methods: {
            changeItemsNumberPerPage(itemsNumber) {
                this.tableOptions.perPage = itemsNumber;
            },
        },
    };
</script>