<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  菜品信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="statusOn">上架</el-button>
                <el-button type="danger" icon="el-icon-error" class="handle-del mr10" @click="statusOff">下架</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">新增</el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>-->


                <el-input v-model="query.object.title" placeholder="名称" class="handle-input mr10" style="padding-right:30px;width:150px"></el-input>
                <el-select v-model="query.object.type" placeholder="菜品类型" style="padding-right:30px;width:150px">
                    <el-option
                            v-for="item in typees"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                    </el-option>
                </el-select>
                <el-select v-model="query.object.status" placeholder="状态" >
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
                <el-table-column prop="title" label="菜品名"></el-table-column>
                <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->
                <el-table-column prop="image" label="照片">

                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.image"
                                :preview-src-list="[scope.row.image]"
                        ></el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="startDateTime" label="开始时间"></el-table-column>
                <el-table-column prop="endDateTime" label="结束时间"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='未上架'">未上架</el-tag>
                        <el-tag v-if="scope.row.status==='已下架'"  type="danger">已下架</el-tag>
                        <el-tag v-if="scope.row.status==='已上架'">已上架</el-tag>
                        <el-tag v-if="scope.row.status==='过期'"  type="danger">过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="salePrice" label="出售价格"></el-table-column>
                <el-table-column label="菜品类型" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type==='1'">普通</el-tag>
                        <el-tag v-if="scope.row.type==='2'"  type="danger">火爆</el-tag>
                    </template>
                </el-table-column>
               <!-- <el-table-column prop="categoryId" label="所属分类"></el-table-column>-->

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

                <el-form-item label="菜品名">
                    <el-input v-model="insertform.title"></el-input>
                </el-form-item>
                <el-form-item label="照片">
                <el-upload
                        class="avatar-uploader"
                        style="width:100px; height:100px"
                        action="api/picture/up"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload" enctype="multipart/form-data"  >
                    <img v-if="insertform.image" :src="insertform.image" class="avatar" enctype="multipart/form-data" width="100px" height="100px">
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px; height:100px"></i>
                </el-upload>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input  type="textarea"
                               :rows="2"
                               placeholder="请输入内容" v-model="insertform.description"></el-input>
                </el-form-item>
                <el-form-item label="使用规则">
                    <el-input  type="textarea"
                               :rows="2"
                               placeholder="请输入内容" v-model="insertform.usageRule"></el-input>
                </el-form-item>




                <el-form-item label="出售价格">
                    <el-input v-model="insertform.salePrice"></el-input>
                </el-form-item>
                <el-form-item label="菜品类型">
                    <!--<el-input v-model="insertform.type"></el-input>-->
                    <el-select v-model="insertform.type" placeholder="请选择" >
                        <el-option
                                v-for="item in typees"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-model="insertform.categoryId"></el-input>
                </el-form-item>
                <el-form-item label="顺序">
                    <el-input v-model="insertform.sort"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="insertform.startDateTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="insertform.endDateTime"
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
                        <el-form-item label="菜品名">
                            <el-tag type="info">{{checkform.title}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-image
                            class="table-td-thumb"
                            :src="checkform.image"
                            :preview-src-list="[checkform.image]"
                    ></el-image>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="描述">
                            <el-tag type="info">{{checkform.description}}</el-tag>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>

                    <el-col :span="8">
                        <el-form-item label="开始时间">
                            <el-tag type="info">{{checkform.startDateTime}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="结束时间">
                            <el-tag type="info">{{checkform.endDateTime}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">


                            <el-tag v-if="checkform.status==='未开始'">未开始</el-tag>
                            <el-tag v-if="checkform.status==='已开始'">已开始</el-tag>
                            <el-tag v-if="checkform.status==='已下架'" type="danger">已下架</el-tag>
                            <el-tag v-if="checkform.status==='已上架'">已上架</el-tag>
                            <el-tag v-if="checkform.status==='过期'" type="danger">过期</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                    <el-form-item label="出售价格">
                    <el-tag type="info">{{checkform.salePrice}}</el-tag>
                </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="原始价格">
                            <el-tag type="info">{{checkform.originalPrice}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="分类">
                            <el-tag type="info">{{checkform.categoryId}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="顺序">
                        <el-tag type="info">{{checkform.sort}}</el-tag>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="类型">
                            <el-tag type="info">{{checkform.type}}</el-tag>
                        </el-form-item>
                    </el-col>
                <!--<el-col :span="12">
                    <el-form-item label="使用规则">
                        <el-tag type="info">{{checkform.usageRule}}</el-tag>
                    </el-form-item>
                </el-col>-->
                </el-row>
            </el-form>

        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="菜品名">
                    <el-input v-model="updateform.title"></el-input>
                </el-form-item>
                <el-form-item label="照片">
                    <el-upload
                            class="avatar-uploader"
                            style="width:100px; height:100px"
                            action="api/picture/up"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" enctype="multipart/form-data"  >
                        <img v-if="updateform.image" :src="updateform.image" class="avatar" enctype="multipart/form-data" width="100px" height="100px">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px; height:100px"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input  type="textarea"
                               :rows="2"
                               placeholder="请输入内容" v-model="updateform.description"></el-input>
                </el-form-item>


                <el-form-item label="出售价格">
                    <el-input v-model="updateform.salePrice"></el-input>
                </el-form-item>
                <el-form-item label="原始价格">
                    <el-input v-model="updateform.originalPrice"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="updateform.type" placeholder="请选择" >
                        <el-option
                                v-for="item in typees"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">


                        <el-select v-model="updateform.categoryId" placeholder="请选择" >
                            <el-option
                                    v-for="item in categorys"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>

                <el-form-item label="顺序">
                    <el-input v-model="updateform.sort"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="updateform.startDateTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="updateform.endDateTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
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
        name: 'dish-table',
        data() {
            return {

                query: {
                    object:{
                        title:'',
                        type:'',
                        status:'',
                        pageExample: {
                            pageNumber: 1,
                            pageSize: 10
                        },
                    }
                },
                typees: [{
                    value: '',
                    label: ''
                }, {
                    value: '1',
                    label: '普通'
                }, {
                    value: '2',
                    label: '火爆',
                }],
                statuses:[{
                        value: '',
                        label: ''
                    },{
                    value: '已上架',
                    label: '已上架'
                }, {
                    value: '已下架',
                    label: '已下架',
                },{
                    value: '过期',
                    label: '过期'
                }, {
                    value: '未开始',
                    label: '未开始',
                }
                ],
                value: '',
                categorys:[],
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
            getCategorys:function() {
                this.$request.post("/api/category/findAllCategorys").then(res=>{
                        console.log(res)
                    this.categorys = res;
                        this.$request.post("/api/category/size").then(res=>{
                           this.pageTotal=res
                        }).catch(res=>{
                            console.log(res)
                        });
                }).catch(res=>{
                    console.log(res)
                });
            },

            handleAvatarSuccess(res, file) {
                this.insertform.image=res.name;
                this.updateform.image = res.name;

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
                console.log(this.query);
                this.$request.post("/api/dish/searchDishs",this.query.object).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
                 this.$request.post("/api/dish/size",this.query.object).then(res=>{
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
                        this.$request.delete("/api/dish/deleteDishs?ids="+index+"").then(res=>{
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
                this.$request.put("/api/dish/updateDishsStatus?"+str+"").then(res=>{
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
                this.$request.put("/api/dish/updateDishsStatus?"+str+"").then(res=>{
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
                this.getCategorys();
                this.insertVisible = true;

            },
            //保存添加
            saveInsert(){

                this.$request.post("/api/dish/insertDish",this.insertform).then(res=>{
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
                this.getCategorys();
                this.idx = index;
                this.updateform = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {

                this.$request.put("/api/dish/updateDish",this.updateform).then(res=>{
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
