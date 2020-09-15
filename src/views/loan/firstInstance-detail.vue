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
                    <p>{{loan.statusShow}}</p>
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
                    <p>{{(parseFloat(loanExt.tailCapital)+parseFloat(loanExt.tailInterest)).toFixed(2)}}</p>
                </li>
                <li>
                    <p>尾款利率(%)：</p>
                    <p>{{loanExt.tailRate}}</p>
                </li>
            </ul>
        </el-row>

        <el-row class="le_main">
            <h3>操作</h3>
            <el-form ref="ruleForm" :rules="rule" :model="submitForm" label-width="95px" class="le_form_valid le_form_op">
                <el-form-item label="审核结果：" prop="status">
                    <el-select v-model="submitForm.status" placeholder="请选择" size="small" clearable>
                        <el-option v-for="item,index in statusList" :key="index" :label="item.message" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核意见：">
                    <el-input v-model="submitForm.remark" placeholder="请输入" type="textarea" :rows="5" size="small" clearable></el-input>
                </el-form-item>
            </el-form>
        </el-row>

        <el-row>
            <el-popover placement="top" width="160" v-model="sub_confirm">
                <p>确认提交？</p>
                <div class="le_right">
                    <el-button size="mini" type="text" @click="sub_confirm = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleSubmit" :loading="sub_loading">确定</el-button>
                </div>
                <el-button slot="reference" v-show="sub_show" type="primary" size="small">提交</el-button>
            </el-popover>

            <el-popover placement="top" width="160" v-model="rev_confirm">
                <p>确认撤回？</p>
                <div class="le_right">
                    <el-button size="mini" type="text" @click="rev_confirm = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleRevoke">确定</el-button>
                </div>
                <el-button slot="reference" v-show="rev_show" type="warning" size="small" :loading="rev_loading">审核撤回</el-button>
            </el-popover>

            <el-popover placement="top" width="160" v-model="rep_confirm">
                <p>确认退回？</p>
                <div class="le_right">
                    <el-button size="mini" type="text" @click="rep_confirm = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleRepulse">确定</el-button>
                </div>
                <el-button slot="reference" type="info" size="small" :loading="rep_loading">退回</el-button>
            </el-popover>

            <router-link to="/loan/firstInstance-list"><el-button size="small">返回</el-button></router-link>
        </el-row>
    </div>
</template>
<script>
    import Http from '@/api/http';

    export default {
        name: "firstInstance-detail",
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
                rule:{
                    status:[
                        { required: true, message: '请选择', trigger: 'change' }
                    ]
                },
                sub_loading: false,
                rev_loading:false,
                rep_loading:false,
                sub_confirm:false,
                rev_confirm:false,
                rep_confirm:false,
                sub_show:false,
                rev_show:false
            }
        },
        mounted() {
            this.initDetail();
        },
        methods: {
            initDetail() {
                Http.get('firstInstance/detail', {id:this.$route.query.id}).then(res => {
                    if(res.detail.car){
                        this.car = res.detail.car;
                    }
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
                    this.statusList = res.statusList;
                    this.sub_show = !(res.detail.loan && res.detail.loan.statusShow == '已审核');
                    this.rev_show = (res.detail.loan && res.detail.loan.statusShow == '已审核');
                })
            },
            handleSubmit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if(valid){
                        this.sub_loading = true;
                        this.submitForm.id = this.$route.query.id;
                        Http.post('submit',this.submitForm).then(res => {
                            this.sub_confirm = false;
                            this.$message.success('提交成功');
                            setTimeout(() => {
                                this.$router.push('/loan/firstInstance-list');
                            },1000);
                        }).catch(err => {
                            this.sub_confirm = false;
                            this.sub_loading = false;
                        })
                    }
                })
            },
            handleRevoke(){
                this.rev_loading = true;
                Http.post('revoke',{id:this.$route.query.id}).then(res => {
                    this.$message.success('撤回成功');
                    this.initDetail();
                    this.rev_loading = false;
                }).catch(err =>　{
                    this.rev_loading = false;
                })
            },
            handleRepulse(){
                this.rep_loading = true;
                Http.post('repulse',{id:this.$route.query.id}).then(res => {
                    this.$message.success('退回成功');
                    this.initDetail();
                    this.rep_loading = false;
                }).catch(err =>　{
                    this.rep_loading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
