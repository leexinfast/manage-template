<template>
    <div class="app-container">
        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <!--<el-form-item label="">-->
                <!--<el-input v-model="searchForm.name" placeholder="请输入" size="small" clearable></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="是否启用">
                    <el-select v-model="searchForm.status" placeholder="请选择" size="small" clearable>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="initList" icon="el-icon-search" :loading="tableLoading" size="small">搜索</el-button>
                    <router-link to="/banner/banner-detail"><el-button type="success" round icon="el-icon-circle-plus-outline" size="small">新增</el-button></router-link>
                </el-form-item>
            </el-form>
        </el-row>

        <!--列表-->
        <el-row :gutter="20">
            <el-table :data="tbList" stripe style="width: 100%" border v-loading="tableLoading">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.logoUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="适配">
                    <template slot-scope="scope">
                        {{scope.row.fromBy | fromByFilter}}
                    </template>
                </el-table-column>
                <el-table-column prop="beginTime" label="开始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <el-table-column label="是否启用" width="80">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <router-link :to="'/banner/banner-detail?id='+scope.row.id"><el-button type="primary" size="mini">编辑</el-button></router-link>
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
        name: "banner-list",
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
            }
        },
        mounted(){
            this.initList()
        },
        filters:{
            fromByFilter(val){
                let arr = {
                    1:'ios',
                    2:'android',
                    3:'pc'
                }
                return arr[val]
            }
        },
        methods: {
            initList() {
                this.tableLoading = true;
                this.searchForm.pageNo = this.pageNo - 1;
                Http.get('banner/list', this.searchForm).then(res => {
                    this.tbList = res.list;
                    this.totalPage = res.count;
                    this.imageRoot = res.imageRoot;
                    this.qnFormLogo.token = res.uploadToken;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
        },
    }
</script>

<style scoped>
    img{
        width: 35px;
    }
</style>
