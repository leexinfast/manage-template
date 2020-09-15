<template>
    <div class="app-container">
        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="推荐类型">
                    <el-select v-model="searchForm.recommendType" placeholder="请选择" size="small" clearable>
                        <el-option label="星级推荐" :value="1"></el-option>
                        <el-option label="普通推荐" :value="2"></el-option>
                    </el-select>
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
                <el-table-column prop="name" label="经销商名称"></el-table-column>
                <el-table-column label="推荐类型">
                    <template slot-scope="scope">
                        {{scope.row.recommendType | recommendTypeFilter}}
                    </template>
                </el-table-column>
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
            <el-form ref="ruleForm" :rules="rule" label-width="150px" :model="saveForm" class="le_form_valid">
                <el-form-item label="经销商选择：" prop="dealerId">
                    <el-select v-model="saveForm.dealerId" placeholder="请选择" size="small" clearable>
                        <el-option v-for="item,index in capitalList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="推荐类型：" prop="recommendType">
                    <el-select v-model="saveForm.recommendType" placeholder="请选择" size="small" clearable>
                        <el-option label="星级推荐" :value="1"></el-option>
                        <el-option label="普通推荐" :value="2"></el-option>
                    </el-select>
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
        name: "recommend-list",
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
                save_Loading:false,
                searchCity:[],
                dialogVisible:false,
                title:'新增',
                capitalList:[],
                rule:{
                    dealerId:[
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
                    recommendType:[
                        { required: true, message: '请选择', trigger: 'change' }
                    ]
                }
            }
        },
        filters:{
            recommendTypeFilter(val){
                let arry = {
                    1:'星级推荐',
                    2:'普通推荐'
                }
                return arry[val]
            }
        },
        mounted(){
            this.initList()
        },
        methods: {
            initList() {
                this.tableLoading = true;
                this.searchForm.pageNo = this.pageNo - 1;
                Http.get('recommend/list', this.searchForm).then(res => {
                    this.tbList = res.list;
                    this.totalPage = res.count;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            //保存
            handleSave(){
                this.$refs['ruleForm'].validate((valid) => {
                    if(valid){
                        this.save_Loading = true;
                        Http.post('recommend/save',this.saveForm).then(res => {
                            this.dialogVisible = false;
                            this.initList();
                            this.$message.success('提交成功');
                        }).catch(err => {
                            this.save_Loading = false;
                        })
                    }
                })
            },
            //获取经销商列表
            getCapitalList(){
                Http.get('capital/allList',{}).then(res => {
                    this.capitalList = res.list;
                })
            },
            handleEdit(row){
                this.getCapitalList();
                this.title = '新增';
                this.save_Loading = false;
                this.dialogVisible = true;
                this.saveForm = {status:0,id:null};
                if(row != 'add'){
                    this.title = '编辑';
                    let obj = {
                        id:row.id,
                        name:row.name,
                        ename:row.ename,
                        letter:row.letter,
                        listOrder:row.listOrder,
                        status:row.status
                    }
                    this.saveForm = Object.assign(this.saveForm,obj);
                }
            },
        },

    }
</script>

<style scoped>

</style>
