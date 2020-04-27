<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>  banner信息表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-success" class="handle-del mr10" @click="statusOn">上架</el-button>
                <el-button type="danger" icon="el-icon-error" class="handle-del mr10" @click="statusOff">下架</el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="insertData">新增</el-button>
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>


                <el-input v-model="query.banner.bannerTitle" placeholder="标题" class="handle-input mr10" style="padding-right:30px;width:150px"></el-input>


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
                <el-table-column prop="bannerTitle" label="广告标题"></el-table-column>
                <el-table-column label="广告图" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.bannerPicture"
                                :preview-src-list="[scope.row.bannerPicture]"
                        ></el-image>
                    </template>
                </el-table-column>
                <!--  <el-table-column prop="currentPassword" label="密码"></el-table-column>-->
                <el-table-column prop="position" label="序号"></el-table-column>

                <el-table-column prop="startTime" label="开始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==='上架'">上架</el-tag>
                    <el-tag v-if="scope.row.status==='展示中'">展示中</el-tag>
                    <el-tag v-if="scope.row.status==='未上架'" type="danger">未上架</el-tag>
                    <el-tag v-if="scope.row.status==='已过期'" type="danger">已过期</el-tag>
                    <el-tag v-if="scope.row.status==='已下架'" type="danger">已下架</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="jumpLink" label="跳转链接" width="55"></el-table-column>

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
                        :current-page.sync="query.banner.pageExample.pageNumber"
                        :page-size="query.banner.pageExample.pageSize"
                        layout="total, prev, pager, next"
                        :total="pageTotal">
                </el-pagination>

            </div>
        </div>

        <el-dialog title="添加" :visible.sync="insertVisible" width="30%">
            <el-form ref="form" :model="insertform" label-width="70px">

                <el-form-item label="广告标题">
                    <el-input v-model="insertform.bannerTitle"></el-input>
                </el-form-item>
                <el-form-item label="广告图片地址">
                    <!--<el-input v-model="insertform.bannerPicture"></el-input>-->
                    <el-upload
                            class="avatar-uploader"
                            style="width:100px; height:100px"
                            action="api/picture/up"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" enctype="multipart/form-data"  >
                        <img v-if="insertform.bannerPicture" :src="insertform.bannerPicture" class="avatar" enctype="multipart/form-data" width="100px" height="100px">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px; height:100px"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告跳转链接">
                    <el-input v-model="insertform.jumpLink"></el-input>
                </el-form-item>
                <el-form-item label="广告分类">
                    <el-input v-model="insertform.bannerCategory"></el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-input v-model="insertform.position"></el-input>
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
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="insertform.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:SS"
                            align="right"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="insertform.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:SS"
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
                        <el-form-item label="广告图">
                            <el-image
                                    class="table-td-thumb"
                                    :src="checkform.bannerPicture"
                                    :preview-src-list="[checkform.bannerPicture]"
                            ></el-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="广告标题">
                            <el-tag type="info">{{checkform.bannerTitle}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="广告分类">
                            <el-tag type="info">{{checkform.bannerCategory}}</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="跳转链接">
                            <el-tag type="info">{{checkform.umpLink}}</el-tag>
                        </el-form-item>
                    </el-col>
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

                            <el-tag v-if="checkform.status==='上架'">上架</el-tag>
                            <el-tag v-if="checkform.status==='展示中'">展示中</el-tag>
                            <el-tag v-if="checkform.status==='未上架'" type="danger">未上架</el-tag>
                            <el-tag v-if="checkform.status==='已过期'" type="danger">已过期</el-tag>
                            <el-tag v-if="checkform.status==='已下架'" type="danger">已下架</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="位置">
                    <el-tag type="info">{{checkform.position}}</el-tag>
                </el-form-item>

            </el-form>

        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="updateform" label-width="70px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="updateform.id"></el-input>
                </el-form-item>
                <el-form-item label="广告标题">
                    <el-input v-model="updateform.bannerTitle"></el-input>
                </el-form-item>
                <el-form-item label="广告图片地址">
                   <!-- <el-input v-model="updateform.bannerPicture"></el-input>-->
                    <el-upload
                            class="avatar-uploader"
                            style="width:100px; height:100px"
                            action="api/picture/up"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" enctype="multipart/form-data"  >
                        <img v-if="updateform.bannerPicture" :src="updateform.bannerPicture" class="avatar" enctype="multipart/form-data" width="100px" height="100px">
                        <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px; height:100px"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告跳转链接">
                    <el-input v-model="updateform.jumpLink"></el-input>
                </el-form-item>
                <el-form-item label="广告分类">
                    <el-input v-model="updateform.bannerCategory"></el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-input v-model="updateform.position"></el-input>
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
    import { fetchData } from '../../../api/index';
    export default {
        name: 'banner-table',
        data() {
            return {

                query: {
                    banner:{
                        bannerTitle:'',
                        pageExample: {
                            pageNumber: 1,
                            pageSize: 4
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
            handleAvatarSuccess(res, file) {
                console.log(res.name)
                this.insertform.bannerPicture=res.name
                this.updateform.bannerPicture = res.name;

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
                this.$request.post("/api/banner/findBanner",this.query.banner).then(res=>{
                    console.log(res)
                    this.tableData = res.content;
                this.$request.post("/api/banner/size",this.query.banner).then(res=>{
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

                        this.$request.delete("/api/banner/deleteBanner?ids="+index+"").then(res=>{
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

                    str +='ids=' +this.multipleSelection[i].id + '&';
                }
                this.$request.delete("/api/banner/deleteBanner?"+str+"").then(res=>{
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
              //禁用
            statusOff(){
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {

                    str +='ids=' +this.multipleSelection[i].id + '&';
                }
                str+="status=下架";
                this.$request.put("/api/banner/upOrDownBanner?"+str+"").then(res=>{

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
                str+="status=上架";
                console.log(str)
                this.$request.put("/api/banner/upOrDownBanner?"+str+"").then(res=>{

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
                 this.$request.post("/api/banner/insertBanner",this.insertform).then(res=>{
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

                this.$request.put("/api/banner/updateBanner",this.updateform).then(res=>{
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
                this.$set(this.query.banner.pageExample, 'pageNumber', val);
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
