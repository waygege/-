<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  用户信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="statusOn">启用</el-button>
                <el-button type="danger" icon="el-icon-error" class="handle-del mr10" @click="statusOff">禁用</el-button>

                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>


                <el-input v-model="query.user.nickName" placeholder="用户名" class="handle-input mr10" style="padding-left:30px; width:150px"></el-input>
                <el-input v-model="query.user.phone" placeholder="手机号" class="handle-input mr10" style="padding-left:30px;padding-right:40px; width:150px"></el-input>
                <el-select v-model="query.user.type" placeholder="类型" >
                    <el-option
                            v-for="item in statuses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>

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
                <el-table-column prop="type" label="类型">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type==='User'">普通用户</el-tag>
                        <el-tag v-if="scope.row.type==='Manager'">管理员</el-tag>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="registerTime" label="注册时间"></el-table-column>-->
                <el-table-column prop="integral" label="积分" width="55"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-info"
                                @click="checkInfo(scope.$index, scope.row)"
                        >查看</el-button>

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
              <!--  <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>-->
                <el-pagination

                        @current-change="handleCurrentChange"
                        :current-page.sync="query.user.pageExample.pageNumber"
                        :page-size="query.user.pageExample.pageSize"
                        layout="total, prev, pager, next"
                        :total="pageTotal">
                </el-pagination>

            </div>
        </div>

        <el-dialog title="查看" :visible.sync="checkVisible" width="30%">

            <el-form ref="form" :model="checkform" label-width="70px">
                <el-row>
                <el-col :span="8">
                <el-form-item label="头像">
                    <el-image
                            class="table-td-thumb"
                            :src="checkform.avatar"
                            :preview-src-list="[checkform.avatar]"
                    ></el-image>
                </el-form-item>
                </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                <el-form-item label="账号">
                    <el-tag type="info">{{checkform.username}}</el-tag>
                </el-form-item>
                    </el-col>
                    <el-col :span="8">
                <el-form-item label="昵称">
                    <el-tag type="info">{{checkform.nickName}}</el-tag>
                </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                <el-form-item label="密码">
                    <el-tag type="info">{{checkform.currentPassword}}</el-tag>
                </el-form-item>
                    </el-col>
                    <el-col :span="8">
                <el-form-item label="手机号">
                    <el-tag type="info">{{checkform.phone}}</el-tag>
                </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                <el-form-item label="生日">
                    <el-tag type="info">{{checkform.birthday}}</el-tag>
                </el-form-item>
                    </el-col>
                        <el-col :span="8">
                <el-form-item label="会员等级">

                        <el-tag v-if="checkform.level==='1'">普通会员</el-tag>
                        <el-tag v-if="checkform.level==='2'">黄金会员</el-tag>
                        <el-tag v-if="checkform.level==='3'">钻石会员</el-tag>

                </el-form-item>
                            <el-form-item label="会员等级">

                                <el-tag v-if="checkform.type==='User'">普通用户</el-tag>
                                <el-tag v-if="checkform.type==='Manager'">管理员</el-tag>
                            </el-form-item>
                        </el-col>
                </el-row>
               <!-- <el-form-item label="邮箱">
                    <el-tag type="info">{{checkform.email}}</el-tag>
                </el-form-item>-->

            </el-form>

        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="updateform.id"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="updateform.nickName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="updateform.currentPassword"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="updateform.phone"></el-input>
                </el-form-item>
                <el-form-item label="头像">

                    <el-upload
                            class="avatar-uploader"
                            style="width:100px; height:100px"
                            action="api/picture/up"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" enctype="multipart/form-data"  >
                        <img v-if="updateform.avatar" :src="updateform.avatar" class="avatar" enctype="multipart/form-data" width="100px" height="100px">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px; height:100px"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="updateform.type" placeholder="请选择" >
                        <el-option
                                v-for="item in statuses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
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
import VueCropper  from 'vue-cropperjs';
export default {
    name: 'account-table',
    data() {
        return {

            query: {
                user:{
                  nickName:'',
                    phone:'',
                    type:'',
                pageExample: {
                    pageNumber: 1,
                    pageSize: 10
              },
                }
            },
            statuses: [{
                value: '',
                label: ''
            },{
                value: 'User',
                label: '普通用户'
            }, {
                value: 'Manager',
                label: '管理员',
            }
            ],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            insertVisible:false,
            checkVisible:false,
            pageTotal: 0,
            updateform: {},
            insertform: {},
            checkform:{},
            idx: -1,
            id: -1,
            fileList: [],
            imgSrc: '',
            cropImg: '',
            dialogVisible: false,
            cos:{}
        };
    },
    components: {
        VueCropper
    },
    created() {
        this.getData();
    },
    methods: {

       handleAvatarSuccess(res, file) {

            this.updateform.avatar = res.name;

        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }

            return isJPG && isLt2M;
        },


        // 获取表格数据
        getData:function () {

            this.$request.post("/api/searchUsers",this.query.user).then(res=>{

                this.tableData = res.content;
                console.log(res.content)
                    this.$request.post("/api/size",this.query.user).then(res=>{
                      this.pageTotal=res;

                    }).catch(res=>{
                        console.log(res)
                    });
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
                    index=this.tableData[index].id

                    this.$request.delete("/api/deleteUser?ids="+index+"").then(res=>{
                        console.log(res)
                        if (res=="success"){
                            this.$message.success('删除成功');
                            this.getData();
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

                str +='ids=' +this.multipleSelection[i].id + '&';
            }
            this.$request.delete("/api/deleteUser?"+str+"").then(res=>{
                console.log(res)
                if (res==="success"){
                    this.$message.success('删除成功');
                    this.getData();
                    this.multipleSelection = [];
                }

            }).catch(res=>{
                console.log(res)
            });

        },

        statusOff(){
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {

                str +='ids=' +this.multipleSelection[i].id + '&';
            }
            str+="status=禁用";
            this.$request.put("/api/updateUserStatus?"+str+"").then(res=>{
                console.log(res)
                if (res==="success"){
                    this.$message.success('禁用成功');
                    this.getData();
                    this.multipleSelection = [];
                }

            }).catch(res=>{
                console.log(res)
            });


        },
        statusOn(){
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {

                str +='ids=' +this.multipleSelection[i].id + '&';
            }
            str+="status=启用";
            console.log(str)
            this.$request.put("/api/updateUserStatus?"+str+"").then(res=>{
                console.log(res)
                if (res==="success"){
                    this.$message.success('启用成功');
                    this.getData();
                    this.multipleSelection = [];
                }

            }).catch(res=>{
                console.log(res)
            });


        },
       /* //添加用户
        insertData(){
            this.insertVisible = true;

        },*/
       /* //保存添加
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
        },*/

        checkInfo(index, row){
            this.idx = index;
            this.checkform = row;
            this.checkVisible = true;

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
            this.$request.put("/api/updateUser",this.updateform).then(res=>{
                console.log(res)
                if (res==="success"){
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);

                    this.getData();

                }

            }).catch(res=>{
                console.log(res)
            });


        },
        // 分页导航
     /*   handlePageChange(val) {
            this.$set(this.query.user.pageExample, 'pageNumber', val);
            this.getData();
        },*/
        handleCurrentChange(val){
            this.$set(this.query.user.pageExample, 'pageNumber', val);
            this.getData();
        }
    }
};
</script>


<style scoped>
    .el-form-item /deep/ .el-upload {

        width: 100px;

        height: 100px;

        line-height: 100px;

    }
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