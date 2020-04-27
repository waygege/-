<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  菜品分类信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">新增</el-button>


            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"

            >
                <el-table-column prop="id"  align="center" v-if="false"></el-table-column>
                <el-table-column prop="name" label="名称" width="80"></el-table-column>


                <el-table-column label="图标" width="100">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>

                <el-table-column prop="position" label="位置" width="100"></el-table-column>

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

                <el-form-item label="分类名">
                    <el-input v-model="insertform.name"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-select v-model="insertform.icon" placeholder="请选择">
                        <el-option
                                v-for="item in icons"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <i :class="item.value"></i>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置">
                    <el-input v-model="insertform.position"></el-input>
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
                <el-form-item label="名称">
                    <el-input v-model="updateform.name"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-select v-model="updateform.icon" placeholder="请选择">
                        <el-option
                                v-for="item in icons"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <i :class="item.value"></i>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="位置">
                    <el-input v-model="updateform.position"></el-input>
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

    export default {
        name: 'category-table',
        data() {
            return {
                icons: [{
                    value: 'el-icon-food',
                    label: '食品'
                }, {
                    value: 'el-icon-more',
                    label: '一级分类'
                }, {
                    value: 'el-icon-info',
                    label: '二级分类'
                }],
                value: '',

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
                this.$request.post("/api/category/findPageCategorys",this.query.object).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
                        this.$request.post("/api/category/size",this.query.object).then(res=> {
                            this.pageTotal = res;
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
                        this.$request.delete("/api/category/deleteCategory?id="+index+"").then(res=>{
                            console.log(res)
                            if (res=="success"){
                                this.$message.success('删除成功');
                                this.getData()
                            }
                        }).catch(res=>{
                            console.log(res)
                        });
                    })
                    .catch(() => {});
            },

            //添加弹出框按钮
            insertData(){
                this.insertVisible = true;

            },
            //保存添加
            saveInsert(){
                this.$request.post("/api/category/insertCategory",this.insertform).then(res=>{
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

                this.$request.put("/api/category/updateCategory",this.updateform).then(res=>{
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

