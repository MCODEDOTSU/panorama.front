import Vue from 'vue';

class SuccessNotifier {

    public static notify(title: string, text: string) {
        Vue.prototype.$notify({
            title, text,
        });
    }
}

export default SuccessNotifier;
