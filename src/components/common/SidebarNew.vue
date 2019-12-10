<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            @select="handleSelect"
        >
            <!-- 一级菜单 -->
            <template v-for="item in items">
                <!-- 二级菜单 -->
                <template v-if="item.subs && item.subs.length > 0">
                    <el-submenu :index="item.name" :key="item.name">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item
                            v-for="(subItem, i) in item.subs"
                            :key="i"
                            :index="subItem.name"
                            >{{ subItem.title }}</el-menu-item
                        >
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.name" :key="item.name">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
import * as config from "../../config/index";
export default {
    data() {
        return {
            collapse: false,
            items: null
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        }
    },
    created() {
        this.getMenuList();
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on("collapse", msg => {
            this.collapse = msg;
        });
    },
    methods: {
        handleSelect(key) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item.subs && item.subs.length > 0) {
                    let flag = false;
                    for (let j = 0; j < item.subs.length; j++) {
                        let subItem = item.subs[j];
                        if (key == subItem.name) {
                            bus.$emit("openMenu", subItem);
                            flag = true;
                            break;
                        }
                    }
                    if (flag) break;
                } else {
                    if (key == item.name) {
                        console.log(item);
                        bus.$emit("openMenu", item);
                        break;
                    }
                }
            }
        },
        getMenuList() {
            this.$http.post(config.ctx + "/getMenuList").then(
                response => {
                    // 响应成功回调
                    var body = response.body;
                    if (body.code === "ok") {
                        this.items = body.data;
                    } else {
                        this.$message(body.message);
                    }
                },
                response => {
                    // 响应错误回调
                    this.$message("请求错误");
                }
            );
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
