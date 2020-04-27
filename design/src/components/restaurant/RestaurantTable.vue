<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>餐厅系信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">添加</el-button>

                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>


                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10" style="width:150px"></el-input>
                <el-date-picker
                        v-model="query.st"
                        type="datetimerange"
                        align="right"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00', '08:00:00']" style="width:300px" >
                </el-date-picker>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id"  align="center" v-if="false"></el-table-column>
                <el-table-column prop="username" label="账号"></el-table-column>
                <el-table-column prop="nickName" label="昵称"></el-table-column>
              <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="birthday" label="生日" width="100"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status==='启用'?'success':(scope.row.status==='禁用'?'danger':'')"
                        >{{scope.row.status}}</el-tag>
                    </template>
                </el-table-column>
              <!--  <el-table-column prop="invitationCode" label="邀请码" width="170"></el-table-column>-->
                <el-table-column prop="level" label="会员等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='1'">普通会员</el-tag>
                        <el-tag v-if="scope.row.level==='2'">黄金会员</el-tag>
                        <el-tag v-if="scope.row.level==='3'">钻石会员</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="registerTime" label="注册时间"></el-table-column>-->
                <el-table-column prop="integral" label="积分" width="55"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="添加" :visible.sync="insertVisible" width="30%">
            <el-form ref="form" :model="insertform" label-width="70px">
                <el-form-item label="账号">
                    <el-input v-model="insertform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="insertform.currentPassword"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="insertform.phone"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="insertform.avatar"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker v-model="insertform.birthday" type="datetime" placeholder="选择日期时间"
                                    align="right" >
                      <!--  :picker-options="pickerOptions"-->
                    </el-date-picker>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="updateform.id"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="updateform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="updateform.currentPassword"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="updateform.phone"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <!--<el-input v-model="form.avatar"></el-input>-->
                    <el-upload
                            class="avatar-uploader"
                            action="http://127.0.0.1:666/login/upload"
                            :show-file-list="false"
                            >
                        <!--:on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"-->
                        <img v-if="true" :src="updateform.avatar" class="avatar" />

                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker
                            v-model="updateform.birthday"
                            type="datetime"
                            placeholder="选择日期时间"
                            align="right"
                            >
                    </el-date-picker>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
export default {
    name: 'account-table',
    data() {
        return {

            query: {
                user:{
                pageExample: {
                    pageNumber: 1,
                    pageSize: 10
              },
                }
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            insertVisible:false,
            pageTotal: 0,
            updateform: {},
            insertform: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {

        //图片上传
        uploadHeadImg: function () {
            this.$el.querySelector('.hiddenInput').click()
        },
        // 获取 easy-mock 的模拟数据
        getData:function () {
           /* fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });*/
           console.log(this.query);
            this.$request.post("/api/searchUsers",this.query.user).then(res=>{
             console.log(res)
                this.tableData = res.content;

                this.pageTotal=res.totalPages;
                this.pageSize=res.pageable.pageSize;
            }).catch(res=>{
                console.log(res)
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {

                    this.$request.delete("/api/deleteUser?ids="+index+"").then(res=>{
                        console.log(res)
                        if (res=="success"){
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        }
                    }).catch(res=>{
                        console.log(res)
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        //添加用户
        insertData(){
            this.insertVisible = true;

        },
        //保存添加
        saveInsert(){
            this.$request.post("/api/register",this.insertform).then(res=>{
                console.log(res)
                if (res=="success"){
                    this.tableData.push(this.insertform)
                    this.$message.success('添加成功');
                }
                this.$message.error('添加成功');
            }).catch(res=>{
                console.log(res)
            });

            this.insertVisible=false;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.updateform = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.updateform);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
