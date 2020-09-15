module.exports = {
    vueTemplate: componentName => {
        return `<template>
                  <div class="app-container">
                        <!--筛选-->
                        <el-row class="item-btm">
                            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                                <el-form-item label="名称">
                                    <el-input v-model="searchForm.name" placeholder="请输入" size="small" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="是否显示">
                                    <el-select v-model="searchForm.status" placeholder="请选择" size="small" clearable>
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" round @click="initList" icon="el-icon-search" size="small" :loading="tableLoading">搜索</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <!--列表-->
                        <el-row>
                            <el-table :data="tbList" style="width: 100%" border v-loading="tableLoading">
                                <el-table-column prop="name" label="名称" width="180"></el-table-column>
                                <el-table-column label="操作" width="200">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini">编辑</el-button>
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
                    name: "${componentName}",
                    components: {
                        lePagination
                    },
                    data () {
                        return {
                            searchForm: {},
                            tbList: [],
                            pageNo:1,
                            totalPage:0,
                            tableLoading:false
                        }
                    },
                    mounted () {
                         
                    },
                    methods: {
                          initList() {
                                this.tableLoading = true;
                                this.searchForm.pageNo = this.pageNo - 1;
                                Http.get('dealer/list',this.searchForm).then(res => {
                                    this.tbList = res.list;
                                    this.totalPage = res.count;
                                    this.tableLoading = false;
                                }).catch(err => {
                                    this.tableLoading = false;
                                })
                            },
                    }
                }
                </script>
                <style lang="scss" scoped>
                
                </style>`
    }
}
