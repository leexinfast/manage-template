<template>
    <div class="app-container">
        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择" size="small" clearable>
                        <el-option v-for="item,index in statusList" :key="index" :label="item.message" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户姓名">
                    <el-input v-model="searchForm.customerName" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="经销商">
                    <el-select v-model="searchForm.dealerId" placeholder="请选择" size="small" clearable>
                        <el-option v-for="item,index in dealerList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务人员">
                    <el-input v-model="searchForm.dealerAccountName" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="资方">
                    <el-select v-model="searchForm.capitalId" placeholder="请选择" size="small" clearable>
                        <el-option v-for="item,index in capitalList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="initList" icon="el-icon-search" size="small"
                               :loading="tableLoading">搜索
                    </el-button>
                </el-form-item>
            </el-form>
        </el-row>

        <!--列表-->
        <el-row>
            <el-table :data="tbList" border v-loading="tableLoading">
                <el-table-column prop="inputShow" label="状态"></el-table-column>
                <el-table-column prop="businessNo" label="业务编号"></el-table-column>
                <el-table-column label="借款人/配偶" width="120">
                    <template slot-scope="scope">
                        {{scope.row.customerName}}/{{scope.row.spouseName}}
                    </template>
                </el-table-column>
                <el-table-column prop="carType" label="车辆型号"></el-table-column>
                <el-table-column prop="financingAmount" label="分期金额"></el-table-column>
                <el-table-column prop="monthRepay" label="月还款额"></el-table-column>
                <el-table-column prop="term" label="期数"></el-table-column>
                <el-table-column prop="tailAmount" label="尾款"></el-table-column>
                <el-table-column prop="capitalName" label="资方"></el-table-column>
                <el-table-column prop="dealerName" label="汽车经销商"></el-table-column>
                <el-table-column prop="dealerAccountName" label="业务人员"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <router-link :to="'/insurance/insurance-detail?id='+scope.row.id"><el-button type="primary" size="mini">详情</el-button></router-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 分页 -->
        <le-pagination v-show="totalPage > 0" :total="totalPage" :page.sync="pageNo" @pagination="initList"></le-pagination>
    </div>
</template>
<script>
    import Http from '@/api/http';
    import lePagination from "@/components/Pagination";

    export default {
        name: "insurance",
        components: {
            lePagination
        },
        data() {
            return {
                searchForm: {},
                tbList: [],
                pageNo: 1,
                totalPage: 0,
                tableLoading: false,
                statusList:[],
                dealerList:[],
                capitalList:[]
            }
        },
        mounted() {
            this.initList();
            this.getDealerList();
            this.getCapitalList();
        },
        methods: {
            initList() {
                this.tableLoading = true;
                this.searchForm.pageNo = this.pageNo - 1;
                Http.get('loan/insurance/list', this.searchForm).then(res => {
                    this.tbList = res.list;
                    this.statusList = res.statusList;
                    this.totalPage = res.count;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            //获取经销商
            getDealerList() {
                Http.get('dealer/list', {}).then(res => {
                    this.dealerList = res.list;
                })
            },
            //获取资方
            getCapitalList() {
                Http.get('capital/allList', {}).then(res => {
                    this.capitalList = res.list;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
