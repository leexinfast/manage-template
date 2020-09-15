<template>
    <div class="app-container">
        <el-row class="le_main">
            <h3>基础信息</h3>
            <ul class="contentInfo">
                <li>
                    <p>业务编号：</p>
                    <p>{{loan.businessNo}}</p>
                </li>
                <li>
                    <p>状态：</p>
                    <p>{{loan.inputShow}}</p>
                </li>
                <li></li>
                <li>
                    <p>汽车经销商：</p>
                    <p>{{loanExt.dealerName}}</p>
                </li>
                <li>
                    <p>业务人员：</p>
                    <p>{{loanExt.dealerAccountName}}</p>
                </li>
            </ul>
        </el-row>
        <el-row class="le_main">
            <h3>申请人及配偶信息</h3>
            <ul class="contentInfo">
                <li>
                    <p>借款人姓名：</p>
                    <p>{{customer.name}}</p>
                </li>
                <li>
                    <p>证件类型：</p>
                    <p>{{customer.idTypeShow}}</p>
                </li>
                <li>
                    <p>证件号码：</p>
                    <p>{{customer.idcardNo}}</p>
                </li>
                <li>
                    <p>手机号码：</p>
                    <p>{{customer.mobile}}</p>
                </li>
                <li>
                    <p>婚姻状况：</p>
                    <p>{{customerDetail.marry | marryFilter}}</p>
                </li>
                <li></li>
                <li>
                    <p>配偶姓名：</p>
                    <p>{{spouse.name}}</p>
                </li>
                <li>
                    <p>证件类型：</p>
                    <p>{{spouse.idTypeShow}}</p>
                </li>
                <li>
                    <p>证件号码：</p>
                    <p>{{spouse.idcardNo}}</p>
                </li>
                <li>
                    <p>手机号码：</p>
                    <p>{{spouse.mobile}}</p>
                </li>
            </ul>
        </el-row>
        <el-row class="le_main">
            <h3>业务信息</h3>
            <ul class="contentInfo">
                <li>
                    <p>车型：</p>
                    <p>{{car.type}}</p>
                </li>
                <li>
                    <p>品牌：</p>
                    <p>{{car.brand}}</p>
                </li>
                <li>
                    <p>资方：</p>
                    <p>{{loanExt.capitalName}}</p>
                </li>
                <li>
                    <p>贷款金额(元)：</p>
                    <p>{{loanExt.financingAmount}}</p>
                </li>
                <li>
                    <p>分期费率(%)：</p>
                    <p>{{loanExt.rate}}</p>
                </li>
                <li>
                    <p>还款期数：</p>
                    <p>{{loanExt.term}}</p>
                </li>
                <li>
                    <p>尾款(元)：</p>
                    <p>{{parseFloat(loanExt.tailCapital)+parseFloat(loanExt.tailInterest)}}</p>
                </li>
                <li>
                    <p>尾款利率(%)：</p>
                    <p>{{loanExt.tailRate}}</p>
                </li>
            </ul>
        </el-row>

        <el-row class="le_main">
            <h3>操作</h3>
            <el-form :inline="true" ref="ruleForm" :rules="rule" :model="submitForm" label-width="130px" class="le_form_valid le_form_op">
                <el-row>
                    <el-form-item label="商业险保险公司：">
                        <div class="le_form_item">{{submitForm.syInsuranceCompany}}</div>
                    </el-form-item>
                    <el-form-item label="商业险保单号：">
                        <div class="le_form_item">{{submitForm.syInsuranceNo}}</div>
                    </el-form-item>
                    <el-form-item label="起始日期：">
                        <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" v-model="submitForm.syStartDate" :readonly="inputShow"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期：">
                        <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" v-model="submitForm.syEndDate" :readonly="inputShow"></el-date-picker>
                    </el-form-item>
                </el-row>
                <el-form-item label="交强险保险公司：">
                    <div class="le_form_item">{{submitForm.jqInsuranceCompany}}</div>
                </el-form-item>
                <el-form-item label="交强险保单号：">
                    <div class="le_form_item">{{submitForm.jqInsuranceNo}}</div>
                </el-form-item>
                <el-form-item label="起始日期：">
                    <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" v-model="submitForm.jqStartDate" :readonly="inputShow"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期：">
                    <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="发票日期" v-model="submitForm.jqEndDate" :readonly="inputShow"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row class="le_operation">
            <el-popover placement="top" width="160" v-model="save_confirm" v-show="inputShow">
                <p>确认保存？</p>
                <div class="le_right">
                    <el-button size="mini" type="text" @click="save_confirm = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleSave" :loading="save_loading">确定</el-button>
                </div>
                <el-button slot="reference" type="warning" size="small">保存</el-button>
            </el-popover>
            <el-popover placement="top" width="160" v-model="sub_confirm" v-show="inputShow">
                <p>确认提交？</p>
                <div class="le_right">
                    <el-button size="mini" type="text" @click="sub_confirm = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleSubmit" :loading="sub_loading">确定</el-button>
                </div>
                <el-button slot="reference" type="primary" size="small">提交</el-button>
            </el-popover>
            <el-button size="small" @click="listBack">返回</el-button>
        </el-row>
    </div>
</template>
<script>
    import Http from '@/api/http';

    export default {
        name: "insurance-detail",
        data() {
            return {
                car:'',
                customer:'',
                customerDetail:'',
                loan:'',
                loanDetail:'',
                loanExt:'',
                spouse:'',
                statusList:[],
                submitForm:{},
                rule:{},
                save_loading:false,
                sub_loading:false,
                save_confirm:false,
                sub_confirm:false,
                qnForm:{
                    id: this.$route.query.id
                },
                fileUrl:'',
                fileName:'',
                fileList:[],
                action:'http://192.168.1.118:8080/loan/car/upload',
                inputShow:false
            }
        },
        mounted() {
            this.initDetail();
            this.qnConfig();
        },
        methods: {
            initDetail() {
                Http.get('loan/insurance/detail', {loanId:this.$route.query.id}).then(res => {
                    if(res.detail.car){
                        this.car = res.detail.car;
                        let car = res.detail.car;
                        let obj = {
                            syInsuranceCompany:car.syInsuranceCompany,
                            syInsuranceNo:car.syInsuranceNo,
                            syStartDate:car.syStartDate,
                            syEndDate:car.syEndDate,
                            jqInsuranceCompany:car.jqInsuranceCompany,
                            jqInsuranceNo:car.jqInsuranceNo,
                            jqStartDate:car.jqStartDate,
                            jqEndDate:car.jqEndDate
                        }
                        this.submitForm = obj;
                    }
                    res.detail.albums.map(item => {
                        this.fileList.push({
                            name:item.filename,
                            url:this.imageRoot + item.url,
                            response:{}
                        })
                    });
                    if(res.detail.customer){
                        this.customer = res.detail.customer;
                    }
                    if(res.detail.customerDetail){
                        this.customerDetail = res.detail.customerDetail;
                    }
                    if(res.detail.loan){
                        this.loan = res.detail.loan;
                    }
                    if(res.detail.loanDetail){
                        this.loanDetail = res.detail.loanDetail;
                    }
                    if(res.detail.loanExt){
                        this.loanExt = res.detail.loanExt;
                    }
                    if(res.detail.spouse){
                        this.spouse = res.detail.spouse;
                    }
                    this.statusList = res.statusList;
                    this.sub_show = !(res.detail.loan && res.detail.loan.statusShow == '已审核');
                    this.rev_show = (res.detail.loan && res.detail.loan.statusShow == '已审核');
                    if(res.loan && res.loan.inputShow == '已录入'){
                        this.inputShow = true;
                    }
                })
            },
            handleSave() {
                this.save_loading = true;
                this.submitForm.loanId = this.$route.query.id;
                Http.posts('loan/insurance/save',this.submitForm).then(res => {
                    this.save_confirm = false;
                    this.save_loading = false;
                    this.$message.success('保存成功');
                    this.initDetail();
                }).catch(err => {
                    this.save_loading = false;
                })
            },
            handleSubmit() {
                this.sub_loading = true;
                this.submitForm.loanId = this.$route.query.id;
                Http.posts('loan/insurance/submit',this.submitForm).then(res => {
                    this.sub_confirm = false;
                    this.sub_loading = false;
                    this.$message.success('提交成功');
                    this.initDetail();
                }).catch(err => {
                    this.sub_loading = false;
                })
            },
            qnConfig(){
                Http.get('system/config/qiniuConfig',{}).then(res => {
                    this.imageRoot = res.imageRoot;
                    // this.qnForm.token = res.uploadToken;
                })
            },

            //上传前
            beforeUpload(file){
                if (file.type.indexOf("image") == "-1") {
                    this.$message.error("上传图片格式错误");
                    return false;
                }
                if (file.size / 1024 / 1024 > 2) {
                    this.$message.error("上传图片大小不能超过2MB");
                    return false;
                }
                // let names = file.name.split('.')[1];
                // let keyName = file.uid + "/" + new Date().getTime() + '.' + names;
                // this.qnForm.key = keyName;
                // this.fileName = file.name.split('.')[0];
            },
            //上传成功
            handleSuccess(res) {
                // let img = [];
                // const imgList = this.$refs.urlRef.uploadFiles;
                // imgList.map(item => {
                //     console.log(item,'lee')
                //     img.push({
                //         url:item.response.key,
                //         filename:item.name.split('.')[0]
                //     })
                // })
                // this.submitForm.albums = img
                console.log(res)
            },
            listBack(){
                this.$router.push('/insurance/insurance-list')
            }
        }
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
