<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  报名信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">


                <el-input v-model="query.object.activityName" placeholder="名称" class="handle-input mr10" style="width:150px"></el-input>
                <el-date-picker
                        v-model="query.st"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
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
                <el-table-column prop="user.user.nickName" label="报名昵称"></el-table-column>

                <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->
                <el-table-column prop="user.phone" label="手机号"></el-table-column>

                <el-table-column prop="activity.activityName" label="活动名"></el-table-column>
                <el-table-column prop="activity.activityStart" label="结束时间"></el-table-column>
                <el-table-column prop="activity.activityEnd" label="结束时间"></el-table-column>

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
                <!--分页插件-->
                <el-pagination

                        @current-change="handleCurrentChange"
                        :current-page.sync="query.object.pageExample.pageNumber"
                        :page-size="query.object.pageExample.pageSize"
                        layout="total, prev, pager, next"
                        :total="pageTotal">
                </el-pagination>

            </div>
        </div>

        <el-dialog title="添加" :visible.sync="insertVisible" width="30%">
            <el-form ref="form" :model="insertform" label-width="70px">
                <el-form-item label="用户昵称">
                    <el-input v-model="insertform.user.nickName"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="insertform.user.phone"></el-input>
                </el-form-item>
                <el-form-item label="活动名">
                    <el-input v-model="insertform.activity.activityName"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="查看" :visible.sync="checkVisible" width="30%">

            <el-form ref="form" :model="checkform" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户昵称">
                            <el-tag type="info">{{checkform.user.nickName}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号">
                            <el-tag type="info">{{checkform.user.nickName}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="活动标题">
                            <el-tag type="info">{{checkform.activity.activityName}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="活动说明">
                            <el-tag type="info">{{checkform.activity.activityExplain}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="8">
                        <el-form-item label="开始时间">
                            <el-tag type="info">{{checkform.activityStart}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="结束时间">
                            <el-tag type="info">{{checkform.activityEnd}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">

                            <el-tag v-if="checkform.activity.status==='未开始'">上架</el-tag>
                            <el-tag v-if="checkform.activity.status==='进行中'">进行中</el-tag>
                            <el-tag v-if="checkform.activity.status==='已过期'" type="danger">已过期</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>

        </el-dialog>

    </div>
</template>

<script>
    import { fetchData } from '../../api';
    export default {
        name: 'activity-table',
        data() {
            return {

                query: {
                    object:{
                        activityName:'',
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
                checkVisible:false,
                pageTotal: 0,
                updateform: {},
                insertform: {},
                checkform:{},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {

            // 获取表格数据
            getData:function () {
                console.log(this.query);
                this.$request.post("/api/activity/findActivitys",this.query.object).then(res=>{
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



            // 分页导航
            /*   handlePageChange(val) {
                   this.$set(this.query.user.pageExample, 'pageNumber', val);
                   this.getData();
               },*/
            handleCurrentChange(val){
                this.$set(this.query.object.pageExample, 'pageNumber', val);
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
