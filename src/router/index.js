import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
let router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/home",
            component: resolve =>
                require(["../components/common/HomeNew.vue"], resolve),
            meta: {
                permission: true
            }
        },
        {
            path: "/login",
            component: resolve =>
                require(["../components/page/Login.vue"], resolve)
        }
    ]
});

//使用钩子函数对路由进行权限跳转(全局守卫)
router.beforeEach((to, from, next) => {
    if (to.meta.permission) {
        const userInfo = Vue.prototype.getObjItemFromStore("userInfo");
        if (userInfo) {
            next();
        } else {
            Vue.prototype.$message("请先登录");
            next("/login");
        }
    } else {
        // 简单的判断IE不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf("MSIE") > -1 && to.path === "/editor") {
            Vue.prototype.$alert(
                "vue-editor组件不兼容IE浏览器，请使用Chrome浏览器查看",
                "浏览器不兼容通知",
                {
                    confirmButtonText: "确定"
                }
            );
        } else {
            next();
        }
    }
});

export default router;
