import Vue from 'vue';

class ErrorNotifier {

    public static notify() {
        Vue.prototype.$notify({
            classes: 'vue-notification-error',
            title: 'Ошибка',
            text: 'При выполнении запроса произошла ошибка',
        });
    }

    public static notifyWithCustomMessage(message: string) {
        Vue.prototype.$notify({
            classes: 'vue-notification-error',
            title: 'Ошибка',
            text: message,
        });
    }
}

export default ErrorNotifier;
