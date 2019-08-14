import Vue from 'vue';

/* Компонент для интернационализации */
// import VueI18n from 'vue-i18n';
// Vue.use(VueI18n);

import DatatableFactory from './components/utils/datatable/VueJsDatatable/index';
Vue.use(DatatableFactory);

/* Vue validation */
import VeeValidate, { Validator } from 'vee-validate';
import ru from 'vee-validate/dist/locale/ru';
Vue.use(VeeValidate, {
    fieldsBagName: 'formFields'
});
Validator.localize('ru', ru);

/* Редактор текста */
import { VueEditor } from 'vue2-editor';

/* Bootstrap компоненты */
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

/* Красивый скролл */
import VueScrollbar from 'vue2-scrollbar';
Vue.component('vue-scrollbar', VueScrollbar);
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css';

/* Loading Jquery */
try {
  window.$ = window.jQuery = require('jquery');
  require('bootstrap');
} catch (e) {}

import Notifications from 'vue-notification';
Vue.use(Notifications);
