<template>
    <div class="app-container">

        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="资方名称">
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
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="alias" label="别名"></el-table-column>
                <el-table-column label="是否启用" width="80">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="handleAccout(scope.row.id)">账号列表</el-button>
                        <!--<el-button type="primary" size="mini" @click="handleSwitch(scope.row)">禁用</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!--编辑资方-->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
            <el-row>
                <el-form :inline="true" :model="capitalForm" class="le_form">
                    <el-col>
                        <el-form-item label="资方名称">
                            <el-input v-model="capitalForm.name" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="资方别名">
                            <el-input v-model="capitalForm.alias" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用">
                            <el-radio-group v-model="capitalForm.status">
                                <el-radio :label="0">是</el-radio>
                                <el-radio :label="5">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" :loading="capital_Loading" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>

        <!--账号列表弹窗-->
        <el-dialog title="账号列表" :visible.sync="accountVisable" width="800px" :close-on-click-modal="false">
            <el-button type="success" round size="small" icon="el-icon-circle-plus-outline" @click="addAccount">新增</el-button>
            <ul class="planClass" v-loading="accountList_Loading">
                <li v-for="item,index in accountList" :key="index">
                    <el-form :inline="true" class="le_form_valid">
                        <el-form-item label="账户名：">
                            <el-input v-model="item.accountName" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开户行：">
                            <el-input v-model="item.bankName" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="账号：">
                            <el-input v-model="item.bankAccountNo" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-radio-group v-model="item.status">
                                <el-radio :label="0">正常</el-radio>
                                <el-radio :label="5">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </li>
            </ul>
            <p class="noData" v-show="accountList.length == 0">暂无数据</p>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="accountVisable = false">取 消</el-button>
                <el-button type="primary" size="small" :loading="account_Loading" v-show="accountList.length > 0" @click="handleAccountSave">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分页 -->
        <le-pagination v-show="totalPage > 0" :total="totalPage" :page.sync="pageNo" @pagination="initList"></le-pagination>
    </div>
</template>

<script>
    import Http from '@/api/http';
    import lePagination from "@/components/Pagination";

    export default {
        name: "capital-list",
        components: {
            lePagination
        },
        data() {
            return {
                tbList: [],
                searchForm: {},
                totalPage: 0,
                pageNo: 1,
                dialogVisible: false,
                accountVisable: false,
                title: '新增资方',
                capitalForm: {
                    alias:'',
                    name:'',
                    status:0
                },
                capital_Loading: false,
                tableLoading: false,
                account_Loading: false,
                accountList_Loading:false,
                accountList: [],
                capitalId:''
            }
        },
        filters: {
            statusFilter(val) {
                let arry = {
                    0: '是',
                    5: '否',
                    10: '否'
                }
                return arry[val]
            }
        },
        mounted() {
            this.initList();
        },
        methods: {
            initList() {
                this.tableLoading = true;
                this.searchForm.pageNo = this.pageNo - 1;
                Http.get('capital/list', this.searchForm).then(res => {
                    this.tbList = res.list;
                    this.totalPage = res.count;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            //编辑资方
            handleEdit(row) {
                this.capitalForm = {
                    alias:'',
                    name:'',
                    status:0
                };
                this.title = '新增资方';
                this.capital_Loading = false;
                this.dialogVisible = true;
                if (row != 'add') {
                    this.title = '编辑资方';
                    let obj = {
                        id:row.id,
                        alias:row.alias,
                        name:row.name,
                        status:row.status
                    }
                    this.capitalForm = Object.assign(this.capitalForm,obj);
                }
            },
            //保存资方
            handleSave() {
                this.capital_Loading = true;
                Http.post('capital/save',this.capitalForm).then(res => {
                    this.$message.success('提交成功');
                    this.initList();
                    this.dialogVisible = false;
                }).catch(err => {
                    this.capital_Loading = false;
                })
            },
            //获取资方账号列表
            handleAccout(id) {
                this.capitalId = id;
                this.accountList = [];
                this.account_Loading = false;
                this.accountList_Loading = true;
                this.accountVisable = true;
                Http.get('capital/accountlist', {capitalId: id}).then(res => {
                    res.list.map(item => {
                        this.accountList.push({
                            id:item.id,
                            accountName:item.accountName,
                            bankAccountNo:item.bankAccountNo,
                            bankName:item.bankName,
                            capitalId:item.capitalId,
                            status:item.status
                        })
                    })
                    this.accountList_Loading = false;
                }).catch(err => {
                    this.accountList_Loading = false;
                })
            },
            //新增资方账号
            addAccount() {
                this.accountList.push({
                    accountName: '',
                    bankName: '',
                    bankAccountNo: '',
                    status:0,
                    capitalId:this.capitalId
                })
            },
            //保存资方账号
            handleAccountSave(){
                this.account_Loading = true;
                Http.posts('capital/saveAccount',{ capitalBankAccountList:this.accountList }).then(res => {
                    this.$message.success('提交成功');
                    this.initList();
                    this.accountVisable = false;
                }).catch(err => {
                    this.account_Loading = false;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    ul, li {
        list-style: none;
    }

    .planClass {
        margin: 0;
        padding: 0;

        li {
            border: 1px solid #409EFF;
            padding: 10px;
            margin: 10px 0;
            border-radius: 10px;
        }
    }

    .noData{
        text-align: center;
        color: #999;
    }
</style>
