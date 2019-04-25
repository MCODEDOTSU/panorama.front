import Vue from 'vue';
class ErrorNotifier {
    static notify() {
        Vue.prototype.$notify({
            classes: 'vue-notification-error',
            title: 'Ошибка',
            text: 'При выполнении запроса произошла ошибка',
        });
    }
    static notifyWithCustomMessage(message) {
        Vue.prototype.$notify({
            classes: 'vue-notification-error',
            title: 'Ошибка',
            text: message,
        });
    }
}
export default ErrorNotifier;
//# sourceMappingURL=ErrorNotifier.js.map