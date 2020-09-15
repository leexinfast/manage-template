<template>
    <div class="app-container">
        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="品牌名称">
                    <el-input v-model="searchForm.name" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="searchForm.status" placeholder="请选择" size="small" clearable>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="initList" icon="el-icon-search" :loading="tableLoading" size="small">搜索</el-button>
                    <el-button type="success" round @click="handleEdit('add')" icon="el-icon-circle-plus-outline" size="small">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>

        <!--列表-->
        <el-row :gutter="20">
            <el-table :data="tbList" stripe style="width: 100%" border v-loading="tableLoading">
                <el-table-column prop="name" label="品牌名称"></el-table-column>
                <el-table-column prop="letter" label="首字母"></el-table-column>
                <el-table-column label="是否启用" width="80">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 分页 -->
        <le-pagination v-show="totalPage > 0" :total="totalPage" :page.sync="pageNo" @pagination="initList"></le-pagination>

        <!--弹窗-->
        <el-dialog class="dialoger" :title="title" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false">
            <el-form label-width="150px" :model="saveForm" class="le_form_valid">
                <el-form-item label="名称：">
                    <el-input v-model="saveForm.name" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="logo：">
                    <el-upload
                        class="avatar-uploader"
                        action="https://up.qbox.me/"
                        :before-upload="beforeUploadLogo"
                        :show-file-list="false"
                        :data="qnFormLogo"
                        :on-success="handleLogoSuccess">
                        <img v-if="saveForm.logo" :src="imageRoot + saveForm.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="首字母：">
                    <el-input v-model="saveForm.letter" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio-group v-model="saveForm.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="5">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" :loading="save_Loading" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Http from '@/api/http';
    import lePagination from "@/components/Pagination";

    export default {
        name: "brand-list",
        components: {
            lePagination
        },
        data() {
            return {
                tbList: [],
                searchForm: {},
                saveForm:{},
                totalPage: 0,
                pageNo: 1,
                tableLoading:false,
                qnFormLogo:{
                    token: '',
                    key: ''
                },
                dialogVisible:false,
                title:'新增',
                save_Loading:false
            }
        },
        filters:{
            statusFilter(val){
                let arry = {
                    0:'是',
                    5:'否',
                    10:'否'
                }
                return arry[val]
            }
        },
        mounted() {
            this.getQiniuToken();
            this.initList();
        },
        methods: {
            initList() {
                this.tableLoading = true;
                this.searchForm.pageNo = this.pageNo - 1;
                Http.get('car/brand/list', this.searchForm).then(res => {
                    this.tbList = res.list;
                    this.totalPage = res.count;
                    this.imageRoot = res.imageRoot;
                    this.qnFormLogo.token = res.uploadToken;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            //上传前
            beforeUploadLogo(file){
                if (file.type.indexOf("image") == "-1") {
                    this.$message.error("上传图片格式错误");
                    return;
                }
                if (file.size / 1024 / 1024 > 2) {
                    this.$message.error("上传图片大小不能超过2MB");
                    return;
                }
                let names = file.name.split('.')[1];
                let keyName = file.uid + "/" + new Date().getTime() + '.' + names;
                this.qnFormLogo.key = keyName;
            },
            //上传成功
            handleLogoSuccess(res, file){
                this.saveForm.logo = file.response.key;
            },
            // 编辑品牌
            handleEdit(row){
                this.title = '新增';
                this.save_Loading = false;
                this.dialogVisible = true;
                this.saveForm = {logo:'',status:0,id:null};
                if(row != 'add'){
                    this.title = '编辑';
                    let obj = {
                        id:row.id,
                        name:row.name,
                        letter:row.letter,
                        logo:row.logo,
                        status:row.status
                    }
                    this.saveForm = Object.assign(this.saveForm,obj);
                }
            },
            //获取token
            getQiniuToken(){
                Http.get('system/config/qiniuConfig').then(res => {
                    this.imageRoot = res.imageRoot;
                    this.qnFormLogo.token = res.uploadToken;
                })
            },
            //保存
            handleSave(){
                console.log(this.qnFormLogo.token,'token')
                return
                this.save_Loading = true;
                Http.post('car/brand/save',this.saveForm).then(res => {
                    this.dialogVisible = false;
                    this.initList();
                    this.$message.success('提交成功');
                }).catch(err => {
                    this.save_Loading = false;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        border-radius: 6px;
        &:hover{
            border-color: #409EFF;
            color: #409EFF;
        }
    }
    .avatar {
        width: 178px;
        display: block;
        /*border: 1px dashed #d9d9d9;*/
        border-radius: 6px;
        margin-top: 10px;
    }

</style>
