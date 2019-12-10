<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <el-tabs
                v-model="curTabName"
                type="card"
                closable
                @tab-remove="removeTab"
            >
                <el-tab-pane
                    v-for="(item, index) in tabContaner"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <component :is="item.name"></component>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./SidebarNew.vue";
import bus from "./bus";
import userManage from "../page/UserManage.vue";
import baseTable from "../page/BaseTable.vue";
import baseForm from "../page/BaseForm.vue";
import vueEditor from "../page/VueEditor.vue";
import markdown from "../page/Markdown.vue";
import upload from "../page/Upload.vue";
import baseCharts from "../page/BaseCharts.vue";
import dragList from "../page/DragList.vue";
export default {
    data() {
        return {
            curTabName: "",
            tabContaner: []
        };
    },
    components: {
        vHead,
        vSidebar,
        userManage,
        baseTable,
        baseForm,
        vueEditor,
        markdown,
        upload,
        baseCharts,
        dragList
    },
    created() {
        console.log("首页");
        bus.$on("collapse", msg => {
            this.collapse = msg;
        });
        bus.$on("openMenu", item => {
            this.addTab(item);
        });
    },
    methods: {
        addTab(item) {
            console.log("新增tab：" + item.name);
            //判断容器中是否存在欲加入tab
            let isExsit = false;
            for (let i = 0, len = this.tabContaner.length; i < len; i++) {
                if (item.name === this.tabContaner[i].name) {
                    this.curTabName = item.name;
                    isExsit = true;
                    break;
                }
            }
            //如果容器中不存在加入容器中
            if (!isExsit) {
                this.tabContaner.push(item);
                this.curTabName = item.name;
            }
        },
        removeTab(targetName) {
            let activeName = this.curTabName;
            let tabs = this.tabContaner;
            if (activeName === targetName) {
                // 删除当前选中的选项卡
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1]; // 先显示右边的选项卡，如果不存在，则显示左边的选项卡
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }
            this.curTabName = activeName; // 重置当前选中的选项卡
            this.tabContaner = tabs.filter(tab => tab.name !== targetName); // 过滤掉要删除的选项卡
        }
    }
};
</script>

<style>
.el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid #f0f0f0;
}
.el-tabs__item {
    background-color: #ddd;
}
.is-active {
    background-color: white;
}
</style>
