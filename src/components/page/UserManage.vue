<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="用户名" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="userName" label="用户名" width="150">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change ="handleCurrentChange"
                        layout="prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="弹出窗口" :visible.sync="dialogFormVisible" width="60%">
            <base-form></base-form>
        </el-dialog>
    </div>
</template>

<script>
    import baseForm from '../page/BaseForm.vue';
    import bus from '../common/bus';
    import * as config from '../../config/index';
    export default {
        components:{
            baseForm
        },
        data() {
            return {
                tableData: [],
                cur_page: 1,
                pageCount: 10,
                total: 0,
                select_word: '',
                multipleSelection: [],
                dialogFormVisible: false
            }
        },
        created(){
            this.getData();
            bus.$on('closeDialog', flag => {
                this.dialogFormVisible = flag;
            })
        },
        methods: {
            // 分页导航
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                this.$http.post(config.ctx + '/user/getUserList', {
                    curPage: this.cur_page,
                    pageCount: this.pageCount,
                    userName: this.select_word
                }).then((response) => {
                    // 响应成功回调
                    var body = response.body
                    if (body.code === 0 && body.data != null) {
                        this.tableData = body.data.list
                        this.total = body.data.total
                    } else {
                        this.$message(body.message)
                    }
                }, (response) => {
                    // 响应错误回调
                    this.$message('请求错误')
                })
            },
            search(){
                this.cur_page = 1;
                this.getData();
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$http.post(config.ctx + '/user/removeUsers', {
                    userIds: row.userId
                }).then((response) => {
                    // 响应成功回调
                    var body = response.body
                    this.$message(body.message)
                    this.getData()
                }, (response) => {
                    // 响应错误回调
                    this.$message('请求错误')
                })
            },
            delAll(){
                let str = new Array();
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    str.push(this.multipleSelection[i].userId);
                }
                if (str.length > 0){
                    this.$http.post(config.ctx + '/user/removeUsers', {
                        userIds: str.join(",")
                    }).then((response) => {
                        // 响应成功回调
                        var body = response.body
                        this.$message(body.message)
                        this.getData()
                    }, (response) => {
                        // 响应错误回调
                        this.$message('请求错误')
                    })
                } else {
                    this.$message('请先选择');
                }
            },
            add(){
              this.dialogFormVisible = true
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
