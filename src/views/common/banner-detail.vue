<template>
    <div class="app-container">
        <el-row>
            <el-form :inline="true" :model="saveForm" class="le_form_valid">
                <el-col>
                    <el-form-item label="标题">
                        <el-input class="le_input" v-model="saveForm.title" size="small" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="图片">
                        <el-upload
                            class="avatar-uploader"
                            action="https://up.qbox.me/"
                            :before-upload="beforeUpload"
                            :show-file-list="false"
                            :data="qnForm"
                            :on-success="handleUploadSuccess">
                            <img v-if="saveForm.logo" :src="imageRoot + saveForm.logo" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="位置">
                        <el-select v-model="saveForm.position" placeholder="请选择" size="small" clearable>
                            <el-option label="app首页" value="app_index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="适配">
                        <el-select v-model="saveForm.fromBy" placeholder="请选择" size="small" clearable>
                            <el-option label="IOS" :value="1"></el-option>
                            <el-option label="ANDROID" :value="2"></el-option>
                            <el-option label="PC" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="跳转类型">
                        <el-select v-model="saveForm.redirectType" placeholder="请选择" size="small" @change="redirectFn">
                            <el-option label="URL" :value="1"></el-option>
                            <el-option label="app内页" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="uriLabel">
                        <el-input class="le_input" v-model="saveForm.url" size="small" clearable v-if="saveForm.redirectType == 1"></el-input>
                        <el-select v-model="saveForm.url" placeholder="请选择" size="small" clearable v-else>
                            <el-option v-for="item,index in redirectTypeList" :label="item.name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="省">
                        <el-select v-model="saveForm.provinceId" placeholder="请选择" size="small" clearable @change="provinceChange" @clear="proClear">
                            <el-option v-for="item,index in provinceList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="市">
                        <el-select v-model="saveForm.cityId" placeholder="请选择" size="small" clearable @change="cityChange" :disabled="isCity" @clear="cityClear">
                            <el-option v-for="item,index in cityList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区">
                        <el-select v-model="saveForm.areaId" placeholder="请选择" size="small" clearable :disabled="isArea">
                            <el-option v-for="item,index in areaList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="开始时间">
                        <el-date-picker size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" v-model="saveForm.beginTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" v-model="saveForm.endTime"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="是否展示">
                        <el-radio-group v-model="saveForm.status">
                            <el-radio :label="0">是</el-radio>
                            <el-radio :label="5">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="2" placeholder="请输入" v-model="saveForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="handleSave">提交</el-button>
                        <router-link to="/banner/banner-list"><el-button size="small">返回</el-button></router-link>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import Http from '@/api/http';

    export default {
        name: "banner-detail",
        data() {
            return {
                saveForm:{
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    redirectType:1,
                    status:0
                },
                uriLabel:'链接地址',
                redirectTypeList:[],
                isCity:true,
                isArea:true,
                provinceList:[],
                cityList:[],
                areaList:[],
                qnForm: {
                    token: '',
                    key: ''
                },
                id:'',
                imageRoot:''
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            this.getQiniuToken();
            if(this.id){
                this.initDetail();
            }
            this.getProvince();
        },
        methods: {
            //获取token
            getQiniuToken(){
                Http.get('system/config/qiniuConfig').then(res => {
                    this.qnForm.token = res.uploadToken;
                    this.imageRoot = res.imageRoot;
                })
            },
            initDetail(){
                Http.post('banner/detail',{id:this.id}).then(res => {
                    this.saveForm = res.detail;
                    if(res.detail.cityId){
                        this.getCity(res.detail.provinceId);
                        this.isCity = false;
                    }
                    if(res.detail.areaId){
                        this.getArea(res.detail.cityId);
                        this.isArea = false;
                    }

                })
            },
            redirectFn(p){
                this.saveForm.url = '';
            },
            getProvince(){
                Http.get('area/depthList',{depth:1}).then(res => {
                    this.provinceList = res.list;
                })
            },
            provinceChange(p){
                this.saveForm.cityId = '';
                this.saveForm.areaId = '';
                this.isCity = false;
                if(p)
                    this.getCity(p);
            },
            cityChange(p){
                this.saveForm.areaId = '';
                this.isArea = false;
                if(p)
                    this.getArea(p)
            },
            getCity(p){
                Http.get('area/depthList',{depth:2,parentId:p}).then(res => {
                    this.cityList = res.list;
                })
            },
            getArea(p){
                Http.get('area/depthList',{depth:3,parentId:p}).then(res => {
                    this.areaList = res.list;
                })
            },
            proClear(){
                this.cityList = [];
                this.areaList = [];
            },
            cityClear(){
                this.areaList = [];
            },
            //上传前
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
            //上传成功
            handleUploadSuccess(res, file){
                this.agentForm.logo = file.response.key;
            },
            //提交
            handleSave(){
                Http.post('banner/save',this.saveForm).then(res => {
                    this.$message.success('提交成功');
                    this.$router.push('/banner/banner-list');
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
