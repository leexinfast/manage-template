<template>
    <div class="app-container">
        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="类型">
                    <el-select v-model="searchForm.type" placeholder="请选择" size="small" clearable>
                        <el-option label="系统" :value="1"></el-option>
                        <el-option label="业务" :value="2"></el-option>
                        <el-option label="支付" :value="4"></el-option>
                        <el-option label="其他第三方" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="keywords">
                    <el-input v-model="searchForm.keywords" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="value">
                    <el-input v-model="searchForm.value" placeholder="请输入" size="small" clearable></el-input>
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
                <el-table-column label="类型" width="120">
                    <template slot-scope="scope">
                        {{scope.row.type | typeFilter}}
                    </template>
                </el-table-column>
                <el-table-column prop="keywords" label="keywords" width="220"></el-table-column>
                <el-table-column prop="value" label="value" min-width="200"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="100"></el-table-column>
                <el-table-column label="操作" width="120">
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
                <el-form-item label="类型：" prop="type">
                    <el-select v-model="saveForm.type" placeholder="请选择" size="small" clearable>
                        <el-option label="系统" :value="1"></el-option>
                        <el-option label="业务" :value="2"></el-option>
                        <el-option label="支付" :value="4"></el-option>
                        <el-option label="其他第三方" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="keywords：" prop="keywords">
                    <el-input v-model="saveForm.keywords" placeholder="请输入" size="small" clearable :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="value：" prop="value">
                    <el-input v-model="saveForm.value" type="textarea" rows="10" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="saveForm.remark" placeholder="请输入" size="small" clearable></el-input>
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
        name: "system-config",
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
                isEdit:false,
                rule:{
                    keywords:[
                        { required: true, message: '请输入', trigger: 'blur' }
                    ],
                    value:[
                        { required: true, message: '请输入', trigger: 'blur' }
                    ],
                    type:[
                        { required: true, message: '请选择', trigger: 'change' }
                    ]
                }
            }
        },
        filters:{
            typeFilter(val){
                let arry = {
                    1:'系统',
                    2:'业务',
                    4:'支付',
                    5:'其他第三方'
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
                Http.get('system/config/list', this.searchForm).then(res => {
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
                        Http.post('system/config/save',this.saveForm).then(res => {
                            this.dialogVisible = false;
                            this.initList();
                            this.$message.success('提交成功');
                        }).catch(err => {
                            this.save_Loading = false;
                        })
                    }
                })
            },
            handleEdit(row){

                this.title = '新增';
                this.rule.keywords[0].required = true;
                this.isEdit = false;
                this.save_Loading = false;
                this.dialogVisible = true;
                this.saveForm = {id:null,type:'',keywords:'',value:'',remark:''};
                this.$nextTick(() => {
                    this.$refs['ruleForm'].resetFields();
                    if(row != 'add'){
                        this.title = '编辑';
                        this.isEdit = true;
                        this.rule.keywords[0].required = false;
                        let obj = {
                            id:row.id,
                            keywords:row.keywords,
                            value:row.value,
                            remark:row.remark,
                            type:row.type
                        }
                        this.saveForm = Object.assign(this.saveForm,obj);
                    }
                })

            }
        },

    }
</script>

<style scoped>

</style>
