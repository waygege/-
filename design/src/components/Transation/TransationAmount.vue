<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  交易信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">


                <el-input v-model="query.object.billNumber" placeholder="账单号" class="handle-input mr10" style="width:150px"></el-input>
                <el-input v-model="query.object.memberName" placeholder="用户" class="handle-input mr10" style="width:150px"></el-input>

                <el-date-picker
                        v-model="query.object.transationDateStart"
                        type="date"
                        placeholder="起始时间"
                />
                <span>至</span>
                <el-date-picker
                        v-model="query.object.transationDateEnd"
                        type="date"
                        placeholder="结束时间"
                />&nbsp;&nbsp;&nbsp;
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

                <el-table-column prop="id"  align="center" v-if="false"></el-table-column>
                <el-table-column prop="billNumber" label="账单号"></el-table-column>
                <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->
                <el-table-column prop="memberName" label="会员名"></el-table-column>
                <el-table-column prop="payMoney" label="交易金额"></el-table-column>
                <el-table-column prop="transationDate" label="交易日期"></el-table-column>
                <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==='未支付'">未支付</el-tag>
                    <el-tag v-if="scope.row.status==='已支付'">已支付</el-tag>

                </template>
                </el-table-column>
                <!--<el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-info"
                                @click="checkInfo(scope.$index, scope.row)"
                        >查看</el-button>

                    </template>
                </el-table-column>-->
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



       <!-- <el-dialog title="查看" :visible.sync="checkVisible" width="30%">

            <el-form ref="form" :model="checkform" label-width="70px">
                <el-row>

                    <el-col :span="8">
                        <el-form-item label="账单号">
                            <el-tag type="info">{{checkform.billNumber}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="12">
                        <el-form-item label="交易日期">
                            <el-tag type="info">{{checkform.transationDate}}</el-tag>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>

                    <el-col :span="8">
                        <el-form-item label="会员名">
                            <el-tag type="info">{{checkform.memberName}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="交易金额">
                            <el-tag type="info">{{checkform.payMoney}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-tag v-if="checkform.status==='未支付'">未支付</el-tag>
                            <el-tag v-if="checkform.status==='已支付'">已支付</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

        </el-dialog>-->

    </div>
</template>

<script>
    import { fetchData } from '../../api';
    export default {
        name: 'transationAmount-table',
        data() {
            return {
                dateRange:{},
                query: {
                    object:{
                        billNumber:"",
                        memberName:"",
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
                /*if(this.query.object.transationDateStart!=""&&this.query.object.transationDate!=""){}*/
              /*  alert(this.dateRange)
                console.log(this.dateRange)
                this.query.object.transationDateStart=this.dateRange;
                this.query.object.transationDateEnd=this.dateRange;*/
                console.log(this.query);
                this.$request.post("/api/transationAmount/findAllTransationAmount",this.query.object).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
                        this.$request.post("/api/transationAmount/size",this.query.object).then(res=>{
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

            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
