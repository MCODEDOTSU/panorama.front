import Vue from 'vue';

class ErrorNotifier {

    public static notify() {
        Vue.prototype.$notify({
            type: 'error',
            title: 'Ошибка',
            text: 'При выполнении запроса произошла ошибка',
        });
    }

    public static notifyWithCustomMessage(message: string) {
        Vue.prototype.$notify({
            type: 'error',
            title: 'Ошибка',
            text: message,
        });
    }
}

export default ErrorNotifier;
