import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './bootstrap';                   // раличные плагины и пакеты для vuejs
import './registerServiceWorker';
import {addAuthorizationHeaderFromLocalStorage} from '@/domain/util/libraries/AxiosConfig';
import * as bootstrap from 'bootstrap'; // typings - bootstrap
import $ from 'jquery';                 // typings - javascript

Vue.config.productionTip = false;

// @ts-ignore
window.appVue = new Vue({
    router,
    store,
    render: (h) => h(App),

    created() {
        if (localStorage.getItem('vuex')) {
            addAuthorizationHeaderFromLocalStorage(localStorage.getItem('vuex'));
        }
    },
}).$mount('#app');
