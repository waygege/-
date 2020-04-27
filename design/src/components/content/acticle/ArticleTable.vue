<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  协议信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">新增</el-button>

                <el-input v-model="query.object.agreement" placeholder="协议" class="handle-input mr10" style="width:150px"></el-input>


                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"

            >
                      <el-table-column prop="id"  align="center" v-if="false"></el-table-column>
                <el-table-column prop="agreement" label="协议" width="80"></el-table-column>


                <el-table-column prop="aboutUs" label="内容" width="100"></el-table-column>

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

                <el-form-item label="协议">
                    <el-input v-model="insertform.agreement"></el-input>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="查看" :visible.sync="checkVisible" width="30%">

            <el-form ref="form" :model="checkform" label-width="70px">

                <el-form-item label="协议">
                    <el-tag type="info">{{checkform.agreement}}</el-tag>
                </el-form-item>
                <el-form-item label="协议内容">
                    <el-input
                            type="textarea"
                            disabled
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="checkform.aboutUs">
                    </el-input>
                </el-form-item>
            </el-form>

        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="updateform.id"></el-input>
                </el-form-item>
                <el-form-item label="协议">
                    <el-input v-model="updateform.agreement"></el-input>
                </el-form-item>
                <el-form-item label="协议内容">

                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="updateform.aboutUs">
                    </el-input>
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
        name: 'article-table',
        data() {
            return {

                query: {
                    object:{

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
                content:'',
                html:'',
            };
        },
        created() {
            this.getData();
        },
        methods: {


            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },

            //图片上传
            uploadHeadImg: function () {
                this.$el.querySelector('.hiddenInput').click()
            },
            // 获取表格数据
            getData:function () {
                console.log(this.query);
                this.$request.post("/api/article/findAllArticles",this.query.object).then(res=>{
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
                        index=this.tableData[index].id;
                        this.$request.delete("/api/article/deleteArticle?id="+index+"").then(res=>{
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

            //添加弹出框按钮
            insertData(){
                this.$router.push('markdown');

            },
            //保存添加
            saveInsert(){
                this.$request.post("/api/article/insertArticle",this.insertform).then(res=>{
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
                this.$request.put("/api/article/updateArticle",this.updateform).then(res=>{
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
               //页码变化
            handleCurrentChange(val){
                this.$set(this.query.object.pageExample, 'pageNumber', val);
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

