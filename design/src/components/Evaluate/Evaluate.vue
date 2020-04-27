<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  评价信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="statusOn">启用</el-button>
                <el-button type="danger" icon="el-icon-error" class="handle-del mr10" @click="statusOff">禁用</el-button>

                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>


                <el-input v-model="query.evaluate.userName" placeholder="评价人" class="handle-input mr10" style="width:150px"></el-input>
                <el-date-picker
                        v-model="query.evaluate.commentStartTime"
                        type="datetime"
                        placeholder="起始时间"
                />
                <span>至</span>
                <el-date-picker
                        v-model="query.evaluate.commentEndTime"
                        type="datetime"
                        placeholder="结束时间"
                />

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
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="stars" label="评价的星数"></el-table-column>
                <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->

                  <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='启用'">启用</el-tag>
                        <el-tag v-if="scope.row.status==='禁用'" style="color: #f02d2d">禁用</el-tag>

                    </template>
                </el-table-column>
                <!--<el-table-column prop="registerTime" label="注册时间"></el-table-column>-->
                <el-table-column prop="user.nickName" label="评价人" width="100"></el-table-column>
                <el-table-column prop="commentTime" label="评价时间" ></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">


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

                        @current-change="handleCurrentChange"
                        :current-page.sync="query.evaluate.pageExample.pageNumber"
                        :page-size="query.evaluate.pageExample.pageSize"
                        layout="total, prev, pager, next"
                        :total="pageTotal">
                </el-pagination>

            </div>
        </div>

        <el-dialog title="查看" :visible.sync="checkVisible" width="30%">

            <el-form ref="form" :model="checkform" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="评价问题">
                            <el-tag type="info">{{checkform.content}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="评价星数">
                            <el-tag type="info">{{checkform.stars}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="8">
                        <el-form-item label="昵称">
                            <el-tag type="info">{{checkform.nickName}}</el-tag>
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
                        <el-form-item label="评价时间">
                            <el-tag type="info">{{checkform.commentTime}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">

                            <el-tag v-if="checkform.status==='启用'">启用</el-tag>
                            <el-tag v-if="checkform.status==='禁用'" style="color: #f02d2d">禁用</el-tag>


                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>

        </el-dialog>

    </div>
</template>

<script>

    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'evaluate-table',
        data() {
            return {

                query: {
                    evaluate:{
                         userName:"",
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




            // 获取表格数据
            getData:function () {
                console.log(this.query);
                this.$request.post("/api/evaluate/findEvaluates",this.query.evaluate).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
                this.$request.post("/api/evaluate/size",this.query.evaluate).then(res=>{
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

                        this.$request.delete("/api/evaluate/deleteEvaluatesByIds?ids="+index+"").then(res=>{
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
                this.$request.delete("/api/deleteevaluate?"+str+"").then(res=>{
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
                this.$request.put("/api/updateevaluateStatus?"+str+"").then(res=>{
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
                this.$request.put("/api/updateevaluateStatus?"+str+"").then(res=>{
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

                this.$request.put("/api/updateevaluate",this.updateform).then(res=>{
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
                   this.$set(this.query.evaluate.pageExample, 'pageNumber', val);
                   this.getData();
               },*/
            handleCurrentChange(val){
                this.$set(this.query.evaluate.pageExample, 'pageNumber', val);
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
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>