import Vue from "vue";
import App from "./App";
import router from "./router";
import VueResource from "vue-resource";
import axios from "axios";
import ElementUI from "element-ui";
import util from "./util/util";
import store from "./store/store";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import $ from "jquery";
window.$ = $;

Vue.use(VueResource);
Vue.prototype.$axios = axios;
Vue.use(ElementUI, { size: "small" });
Vue.use(util);

//将提交的对象转成对应的参数
Vue.http.options.emulateJSON = true;
//http提交前loading
//拦截器无法终止请求
Vue.http.interceptors.push(function(request, next) {
    let hasLoadEnd = false; // 是否已加载结束
    // 如果加载速度在500毫秒内，则不出现加载框
    setTimeout(function() {
        if (!hasLoadEnd) {
            store.commit("showLoading");
        }
    }, 500);

    next(function(response) {
        if (response.body.code == "50018") {
            router.replace("/login");
        }

        hasLoadEnd = true;
        store.commit("hideLoading");
    });
});
console.log("开始");
window.vuelm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
