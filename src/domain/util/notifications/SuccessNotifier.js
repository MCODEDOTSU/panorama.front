import Vue from 'vue';
class SuccessNotifier {
    static notify(title, text) {
        Vue.prototype.$notify({
            title, text,
        });
    }
}
export default SuccessNotifier;
//# sourceMappingURL=SuccessNotifier.js.map