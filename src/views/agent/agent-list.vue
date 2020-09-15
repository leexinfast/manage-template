<template>
    <div class="app-container">

        <!--筛选-->
        <el-row class="item-btm">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline le_form">
                <el-form-item label="经销商名称">
                    <el-input v-model="searchForm.name" placeholder="请输入" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-select v-model="searchForm.status" placeholder="请选择" size="small" clearable>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader  v-model="searchCity" :options="options" size="small" @change="handleChange($event,1)" clearable></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" round @click="initList" icon="el-icon-search" size="small" :loading="tableLoading">搜索</el-button>
                    <el-button type="success" round @click="handleAgentDialog('add')" icon="el-icon-circle-plus-outline" size="small">新增
                    </el-button>
                </el-form-item>
            </el-form>
        </el-row>

        <!--列表-->
        <el-row :gutter="20">
            <el-table :data="tbList" stripe style="width: 100%" border v-loading="tableLoading">
                <el-table-column prop="name" label="经销商名称" width="180"></el-table-column>
                <el-table-column prop="province" label="省"></el-table-column>
                <el-table-column prop="city" label="市"></el-table-column>
                <el-table-column prop="area" label="区"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
                <el-table-column label="是否展示" width="80">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleAgentDialog(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini" @click="handlePlan(scope.row.id)">方案</el-button>
                        <el-button type="primary" size="mini" @click="handleCarModel(scope.row.id)">车型</el-button>
                        <!--<el-button type="primary" size="mini" @click="handleSwitch(scope.row)">禁用</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 分页 -->
        <le-pagination v-show="totalPage > 0" :total="totalPage" :page.sync="pageNo" @pagination="initList"></le-pagination>

        <!--经销商-->
        <el-dialog :title="agentTitle" :visible.sync="agentVisible" width="800px" :close-on-click-modal="false">
            <el-row>
                <el-form :inline="true" :model="agentForm" class="le_form_valid">
                    <el-col>
                        <el-form-item label="门店名称">
                            <el-input class="le_input" v-model="agentForm.name" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item label="省市区">
                            <el-cascader class="le_input" v-model="agentCity" :options="options" size="small" @change="handleChange($event,2)" clearable></el-cascader>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <el-input class="le_input" v-model="agentForm.address" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="坐标">
                            <div class="show_item">{{agentForm.coordinate}}</div>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <el-input v-model="agentForm.contactName" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <el-input v-model="agentForm.phone" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开户行">
                            <el-input v-model="agentForm.bankName" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="账户名">
                            <el-input v-model="agentForm.accountName" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input class="le_input" v-model="agentForm.bankAccountNo" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item label="是否展示">
                            <el-radio-group v-model="agentForm.status">
                                <el-radio :label="0">是</el-radio>
                                <el-radio :label="5">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col>
                        <el-form-item label="门店图片">
                            <el-upload
                                    class="avatar-uploader"
                                    action="https://up.qbox.me/"
                                    :before-upload="beforeUpload"
                                    :show-file-list="false"
                                    :data="qnForm"
                                    :on-success="handleUploadSuccess">
                                <img v-if="agentForm.logo" :src="imageRoot + agentForm.logo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="agentVisible = false">取 消</el-button>
                <el-button type="primary" size="small" :loading="agentLoading" @click="handleAgentSave">确 定</el-button>
            </div>
        </el-dialog>

        <!--方案-->
        <el-dialog title="方案管理" :visible.sync="planVisible" width="800px" :close-on-click-modal="false">
            <el-button type="success" round size="small" icon="el-icon-circle-plus-outline" @click="addPlan">新增</el-button>
            <ul class="planClass" v-loading="capitalPlanList_loading">
                <li v-for="item,index in capitalPlanList" :key="index">
                    <el-form :inline="true" class="le_form_valid">
                        <el-form-item label="资方：">
                            <el-select v-model="item.capitalId" placeholder="请选择" size="small" clearable @change="capitalChange($event,item)">
                                <el-option v-for="cap,indexs in capitalList" :key="indexs" :label="cap.name" :value="cap.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="期数：">
                            <el-input v-model="item.terms" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="分期费率：">
                            <el-input v-model="item.rates" size="small" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="是否有尾款：">
                            <el-radio-group v-model="item.isTail" @change="tailChange($event,item)">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="尾款费率：" v-show="item.isTail == 1">
                            <el-input v-model="item.tailRate" size="small" clearable></el-input>
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
            <p class="noData" v-show="capitalPlanList.length == 0">暂无数据</p>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="planVisible = false">取消</el-button>
                <el-button type="primary" size="small" :loading="planLoading" v-show="capitalPlanList.length > 0" @click="handlePlanSave">确定</el-button>
            </div>
        </el-dialog>

        <!--车型列表-->
        <el-dialog title="车型管理" :visible.sync="carVisible" width="800px" :close-on-click-modal="false">
            <el-button type="success" round size="small" icon="el-icon-circle-plus-outline" @click="handleCarDialog('add')">新增</el-button>
            <el-row class="item-top">
                <el-table :data="carList" stripe style="width: 100%" border v-loading="carTableLoading">
                    <el-table-column prop="title" label="车型名称" width="180"></el-table-column>
                    <el-table-column prop="name" label="品牌"></el-table-column>
                    <el-table-column label="贷款上限">
                        <template slot-scope="scope">
                            {{scope.row.maxFinancingAmount | priceToPlace}}
                        </template>
                    </el-table-column>
                    <el-table-column label="履约保证金">
                        <template slot-scope="scope">
                            {{scope.row.bondAmount | priceToPlace}}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否展示" width="80">
                        <template slot-scope="scope">
                            {{scope.row.status | statusFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleCarDialog(scope.row)">编辑</el-button>
                            <!--<el-button type="primary" size="mini" @click="handleSwitch(scope.row)">禁用</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <!--<el-button size="small" @click="carVisible = false">取消</el-button>-->
            </div>
        </el-dialog>

        <!--车型编辑-->
        <el-dialog :title="car_title" :visible.sync="carModelVisible" width="800px" :close-on-click-modal="false">
            <el-form :inline="true" :form="carModelForm" class="le_form_valid">
                <el-form-item label="车型名称：">
                    <el-input v-model="carModelForm.title" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="品牌选择：">
                    <el-select v-model="carModelForm.brandId" placeholder="请选择" size="small">
                        <el-option v-for="brand,index in brandList" :key="index" :label="brand.name" :value="brand.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="logo">
                    <el-upload
                            class="avatar-uploader"
                            action="https://up.qbox.me/"
                            :before-upload="beforeUploadLogo"
                            :show-file-list="false"
                            :data="qnFormLogo"
                            :on-success="handleLogoSuccess">
                        <img v-if="carModelForm.logo" :src="imageRoot + carModelForm.logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <!--<el-form-item label="指导价：">-->
                    <!--<el-input v-model="carModelForm.guidancePrice" size="small" clearable></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="贷款上限：">
                    <el-input v-model="carModelForm.maxFinancingAmount" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="履约保证金：">
                    <el-input v-model="carModelForm.bondAmount" size="small" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-radio-group v-model="carModelForm.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="5">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="carModelVisible = false">取消</el-button>
                <el-button type="primary" size="small" :loading="carModelLoading" @click="handleCarModelSave">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import citys from '@/utils/citys.json';
    import Http from '@/api/http';
    import lePagination from "@/components/Pagination";

    export default {
        name: "agent-list",
        components: {
            lePagination
        },
        data() {
            return {
                searchForm: {},//列表筛选条件
                options: citys,//省市区数据源
                searchCity:[],
                agentCity:[],
                tbList: [],
                agentVisible: false,
                planVisible:false,
                agentForm: {},
                // planForm:{
                //     capitalId:'',
                //     status:0,
                //     terms:'',
                //     rates:'',
                //     tailRate:''
                // },
                qnForm: {
                    token: '',
                    key: ''
                },
                qnFormLogo:{
                    token: '',
                    key: ''
                },
                imageRoot:'',
                agentTitle:'新增经销商',
                pageNo:1,
                totalPage:0,
                agentLoading:false,
                planLoading:false,
                tableLoading:false,
                capitalPlanList_loading:false,
                capitalList:[],
                isTail:0,//是否有尾款
                capitalPlanList:[
                    // {
                    //     dealerId:'',
                    //     capitalId:'',
                    //     terms:'',
                    //     rates:'',
                    //     isTail:0,
                    //     tailRate:'',
                    //     status:0
                    // }
                ],//方案列表
                dealerId:'',
                carVisible:false,
                carList:[],
                carTableLoading:false,
                carModelVisible:false,
                car_title:'新增车型',
                brandList:[],
                carModelForm:{},
                carModelLoading:false
            }
        },
        mounted() {
            this.getQiniuToken();
            this.initList();
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
            //获取token
            getQiniuToken(){
                Http.get('system/config/qiniuConfig').then(res => {
                    this.qnForm.token = res.uploadToken;
                    this.imageRoot = res.imageRoot;
                    this.qnFormLogo.token = res.uploadToken;
                })
            },
            //资方列表
            initCapitalList(){
                Http.get('capital/allList',{}).then(res => {
                    this.capitalList = res.list;
                })
            },
            //省市区赋值
            handleChange(city,t){
                if(t == 1){
                    this.searchForm.province = city[0];
                    this.searchForm.city = city[1];
                    this.searchForm.area = city[2];
                }else{
                    this.agentForm.province = city[0];
                    this.agentForm.city = city[1];
                    this.agentForm.area = city[2];
                }
            },
            //编辑经销商
            handleAgentDialog(row) {
                this.agentTitle = '新增经销商';
                this.agentVisible = true;
                this.agentLoading = false;
                this.agentForm = { logo: '',status:0 };
                this.agentCity = [];
                if(row != 'add'){
                    this.agentTitle = '编辑经销商';
                    this.agentForm = Object.assign(this.agentForm,row);
                    let arr = [];
                    arr[0] = row.province;
                    arr[1] = row.city;
                    arr[2] = row.area;
                    this.agentCity = arr;
                }
            },
            //经销商保存
            handleAgentSave() {
                this.agentLoading = true;
                Http.post('dealer/save',this.agentForm).then(res => {
                    this.$message.success('提交成功');
                    this.initList();
                    this.agentVisible = false;
                }).catch(err => {
                    this.agentLoading = false;
                })
            },
            //门店图片上传前
            beforeUpload(file){
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
                this.qnForm.key = keyName;
            },
            //门店图片上传成功
            handleUploadSuccess(res, file){
                this.agentForm.logo = file.response.key;
            },
            //车型logo上传前
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
            //车型logo上传成功
            handleLogoSuccess(res, file){
                this.carModelForm.logo = file.response.key;
            },
            //编辑方案
            handlePlan(id){
                this.dealerId = id;
                this.planLoading = false;
                this.capitalPlanList = [];
                this.capitalPlanList_loading = true;
                this.planVisible = true;
                this.initCapitalList();
                Http.get('dealer/planList',{dealerId:id}).then(res => {
                    res.list.map(item => {
                        this.capitalPlanList.push({
                            capitalId:item.capitalId,
                            dealerId:item.dealerId,
                            id:item.id,
                            rates:item.rates,
                            status:item.status,
                            tailRate:item.tailRate,
                            terms:item.terms,
                            isTail:item.tailRate == 0?0:1
                        })
                    })
                    this.capitalPlanList_loading = false;
                }).catch(err => {
                    this.capitalPlanList_loading = false;
                })
            },
            //选择资方获取默认方案
            capitalChange(id,item){
                let index = this.capitalPlanList.indexOf(item);
                let obj = this.capitalPlanList[index];
                let array = {};
                this.$set(obj,'terms','');
                this.$set(obj,'rates','');
                this.$set(obj,'tailRate',0);
                this.$set(obj,'status',0);
                Http.get('capital/plan',{ capitalId:id }).then(res => {
                    if(res && res.capitalPlan){
                        array = {
                            terms:res.capitalPlan.terms,
                            rates:res.capitalPlan.rates,
                            tailRate:res.capitalPlan.tailRate,
                            status:res.capitalPlan.status,
                            dealerId:this.dealerId
                        }
                        obj = Object.assign(obj,array);
                        //有无尾款显示
                        if(res.capitalPlan.tailRate == 0){
                            this.$set(obj,'isTail',0);
                        }else{
                            this.$set(obj,'isTail',1);
                        }
                    }
                })
            },
            //尾款选择清空费率
            tailChange(p,item){
                if(p == 0){
                    let index = this.capitalPlanList.indexOf(item);
                    let obj = this.capitalPlanList[index];
                    this.$set(obj,'tailRate',0);
                    // this.capitalPlanList[index].tailRate = '';
                }
            },
            //保存方案
            handlePlanSave(){
                this.planLoading = true;
                Http.posts('dealer/editPlan',{ dealerCapitalPlanList:this.capitalPlanList }).then(res => {
                    this.$message.success('提交成功');
                    this.planVisible = false;
                    this.initList();
                }).catch(err => {
                    this.planVisible = false;
                })
            },
            //新增方案
            addPlan(){
                this.capitalPlanList.push({
                    capitalId:'',
                    terms:'',
                    rates:'',
                    isTail:0,
                    tailRate:'',
                    status:0
                })
            },
            //车型列表
            getCarList(){
                Http.get('dealer/carList',{dealerId:this.dealerId}).then(res => {
                    this.carList = res.list;
                    this.carTableLoading = false;
                }).catch(err => {
                    this.carTableLoading = false;
                })
            },
            //弹出车型管理
            handleCarModel(id){
                this.carVisible = true;
                this.carTableLoading = true;
                this.dealerId = id;
                this.getCarList();
            },
            //获取车量品牌
            getCarBrandList(){
                Http.get('car/brand/allList',{}).then(res => {
                    this.brandList = res.list;
                })
            },
            //编辑车型
            handleCarDialog(row){
                this.getCarBrandList();
                this.carModelVisible = true;
                this.car_title = '新增车型';
                this.carModelForm = { status:0,logo:'' };
                if(row != 'add'){
                    this.car_title = '编辑车型';
                    let obj = {
                        bondAmount:parseInt(row.bondAmount)/100,
                        brandId:row.brandId,
                        dealerId:row.dealerId,
                        id:row.id,
                        logo:row.logo,
                        maxFinancingAmount:parseInt(row.maxFinancingAmount)/100,
                        status:row.status,
                        title:row.title
                    }
                    this.carModelForm = obj;
                }
            },
            //保存车型
            handleCarModelSave(){
                let params = {};
                params = this.carModelForm;
                params.dealerId = this.dealerId;
                params.bondAmount = this.carModelForm.bondAmount*100;
                params.maxFinancingAmount = this.carModelForm.maxFinancingAmount*100;
                Http.post('dealer/editCar',params).then(res => {
                    this.$message.success('保存成功');
                    this.carModelVisible = false;
                    this.getCarList();
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    ul,li{
        list-style: none;
    }
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
    .show_item{
        width: 280px;
        padding: 0 15px;
        line-height: 32px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        margin-top: 5px;
    }
    .planClass{
        margin: 0;
        padding: 0;
        li{
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
