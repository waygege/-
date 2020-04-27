<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  优惠券信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="statusOn">上架</el-button>
                <el-button type="danger" icon="el-icon-error" class="handle-del mr10" @click="statusOff">下架</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">新增</el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>-->


                <el-input v-model="query.object.couponsName" placeholder="名称" class="handle-input mr10" style="padding-right:30px;width:150px"></el-input>


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
                <el-table-column prop="couponsName" label="优惠卷名"></el-table-column>

                <el-table-column prop="startTime" label="开始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='未上架'">未上架</el-tag>
                        <el-tag v-if="scope.row.status==='已下架'"  type="danger">已下架</el-tag>
                         <el-tag v-if="scope.row.status==='已上架'">已上架</el-tag>
                        <el-tag v-if="scope.row.status==='已过期'"  type="danger">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="integration" label="所需积分"></el-table-column>
                <el-table-column prop="size" label="面值"></el-table-column>
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

                <el-form-item label="优惠券">
                    <el-input v-model="insertform.couponsName"></el-input>
                </el-form-item>


                <el-form-item label="优惠券描述">
                    <el-input  type="textarea"
                               :rows="2"
                               placeholder="请输入内容" v-model="insertform.couponDescription"></el-input>
                </el-form-item>


                <!--  <el-form-item label="状态">
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>上架</el-dropdown-item>
                      <el-dropdown-item>展示中</el-dropdown-item>
                      <el-dropdown-item>已下架</el-dropdown-item>
                      <el-dropdown-item>已过期</el-dropdown-item>
                      <el-dropdown-item>未上架</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-form-item>-->
                <el-form-item label="状态">
                <el-select v-model="insertform.status" placeholder="请选择" >
                    <el-option
                            v-for="item in statuses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="使用规则">
                    <el-input  type="textarea"
                               :rows="2"
                               placeholder="请输入内容" v-model="insertform.rules"></el-input>
                </el-form-item>
                <el-form-item label="所需积分">
                    <el-input placeholder="积分" v-model="insertform.integration"></el-input>
                </el-form-item>
                <el-form-item label="面值">
                    <el-input placeholder="面值" v-model="insertform.size"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="insertform.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="insertform.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                    >
                    </el-date-picker>
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
                        <el-form-item label="优惠卷名">
                            <el-tag type="info">{{checkform.couponsName}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="优惠券描述">
                            <el-tag type="info">{{checkform.couponDescription}}</el-tag>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>

                    <el-col :span="8">
                        <el-form-item label="开始时间">
                            <el-tag type="info">{{checkform.startTime}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="结束时间">
                            <el-tag type="info">{{checkform.endTime}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">


                            <el-tag v-if="checkform.status==='未上架'">未上架</el-tag>
                            <el-tag v-if="checkform.status==='已下架'" type="danger">已下架</el-tag>
                            <el-tag v-if="checkform.status==='已上架'">已上架</el-tag>
                            <el-tag v-if="checkform.status==='已过期'" type="danger">已过期</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="所需积分">
                    <el-tag type="info">{{checkform.integration}}</el-tag>
                </el-form-item>
                <el-form-item label="面值">
                    <el-tag type="info">{{checkform.size}}</el-tag>
                </el-form-item>
                <el-col :span="12">
                    <el-form-item label="使用规则">
                        <el-tag type="info">{{checkform.rules}}</el-tag>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="updateform.id"></el-input>
                </el-form-item>
                <el-form-item label="优惠卷名">
                    <el-input v-model="updateform.couponsName"></el-input>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="updateform.couponDescription"></el-input>
                </el-form-item>

                <el-form-item label="所需积分">
                    <el-input v-model="updateform.integration"></el-input>
                </el-form-item>
                <el-form-item label="面值">
                    <el-input v-model="updateform.size"></el-input>
                </el-form-item>
                <el-form-item label="使用规则">
                    <el-input v-model="updateform.rules"></el-input>
                </el-form-item>
                <!--
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>上架</el-dropdown-item>
                      <el-dropdown-item>展示中</el-dropdown-item>
                      <el-dropdown-item>已下架</el-dropdown-item>
                      <el-dropdown-item>已过期</el-dropdown-item>
                      <el-dropdown-item>未上架</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-form-item>-->
                <el-form-item label="状态">
                <el-select v-model="updateform.status" placeholder="请选择" >
                    <el-option
                            v-for="item in statuses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="updateform.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:SS"
                            align="right"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="updateform.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:SS"
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
    import { fetchData } from '../../api';
    export default {
        name: 'coupons-table',
        data() {
            return {

                query: {
                    object:{
                        couponsName:'',
                        pageExample: {
                            pageNumber: 1,
                            pageSize: 10
                        },
                    }
                },
               statuses: [{
                    value: '未上架',
                    label: '未上架'
                }, {
                    value: '已下架',
                    label: '已下架 ',
                },{
                   value: '已上架',
                   label: '已上架'
               }, {
                   value: '已过期',
                   label: '已过期 ',
               }
               ],
            value: '',
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
                this.$request.post("/api/coupons/findCoupons",this.query.object).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
            this.$request.post("/api/coupons/size",this.query.object).then(res=>{
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
                        this.$request.delete("/api/coupons/deleteCoupons?ids="+index+"").then(res=>{
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

            //禁用
            statusOff(){
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {

                    str +='ids=' +this.multipleSelection[i].id + '&';
                }
                str+="status=已下架";
                this.$request.put("/api/coupons/upOrDownCoupons?"+str+"").then(res=>{
                    console.log(res)
                    if (res==="success"){
                        this.$message.success('下架成功');
                        this.getData();
                        this.multipleSelection = [];
                    }

                }).catch(res=>{
                    console.log(res)
                });


            },
            //启用
            statusOn(){
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {

                    str +='ids=' +this.multipleSelection[i].id + '&';
                }
                str+="status=已上架";
                console.log(str)
                this.$request.put("/api/coupons/upOrDownCoupons?"+str+"").then(res=>{
                    console.log(res)
                    if (res==="success"){
                        this.$message.success('上架成功');
                        this.getData();
                        this.multipleSelection = [];
                    }

                }).catch(res=>{
                    console.log(res)
                });


            },
            //添加弹出框按钮
            insertData(){
                this.insertVisible = true;

            },
            //保存添加
            saveInsert(){
                this.$request.post("/api/coupons/insertCoupons",this.insertform).then(res=>{
                    console.log(res)
                    if (res=="success"){
                        this.tableData.push(this.insertform)
                        this.getData();
                        this.$message.success('添加成功');
                    }
                }).catch(res=>{
                    console.log(res)
                });

                this.insertVisible=false;
            },
            //查看
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
                alert(this.updateform.startTime);
                this.$request.put("/api/coupons/updateCoupons",this.updateform).then(res=>{
                    console.log(res)
                    if (res==="success"){
                        this.$message.success('更新成功');
                        this.getData();
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                        this.$set(this.tableData, this.idx, this.updateform);
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
