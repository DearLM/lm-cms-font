<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content" :class="{ 'content-collapse': collapse }">
            <el-tabs
                v-model="editableTabsValue"
                type="card"
                closable
                @tab-remove="removeTab"
            >
                <el-tab-pane
                    v-for="(item, index) in editableTabs"
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
import vSidebar from "./Sidebar.vue";
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
            collapse: false,
            editableTabsValue: "",
            editableTabs: []
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
        bus.$on("collapse", msg => {
            this.collapse = msg;
        });
        bus.$on("openMenu", item => {
            this.addTab(item);
        });
    },
    methods: {
        addTab(item) {
            debugger;
            let tabs = this.editableTabs;
            let flag = true;
            tabs.forEach((tab, index) => {
                if (tab.name === item.index) {
                    // 当前选择的菜单对应的选项卡已存在
                    this.editableTabsValue = tab.name; // 选中对应的选项卡
                    flag = false;
                }
            });
            if (flag) {
                this.editableTabs.push({
                    title: item.title,
                    name: item.index
                });
                this.editableTabsValue = item.index;
            }
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
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
            this.editableTabsValue = activeName; // 重置当前选中的选项卡
            this.editableTabs = tabs.filter(tab => tab.name !== targetName); // 过滤掉要删除的选项卡
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
