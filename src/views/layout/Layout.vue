<template>
    <div :class="classObj" class="app-wrapper">
        <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/> -->
        <div class="topBar">
            <div class="logoLeft">优品出行支付宝生活号客户端后台</div>
            <div class="rightInfo">
                <el-tooltip content="刷新" effect="dark" placement="bottom">
                    <i class="el-icon-refresh" style="font-size: 23px;cursor: pointer;" @click="reFresh"></i>
                </el-tooltip>

                <el-tooltip content="全屏显示" effect="dark" placement="bottom">
                    <screenfull class="screenfull right-menu-item"/>
                </el-tooltip>

                <img src="../../assets/default.png">

                <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <span class="userName">{{userName}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
                    <el-dropdown-menu slot="dropdown">
                        <router-link to="/">
                            <el-dropdown-item>
                                首页
                            </el-dropdown-item>
                        </router-link>
                        <el-dropdown-item>
                            <span style="display:block;" @click="editPassWord">修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <span style="display:block;" @click="logout">退出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>

        <sidebar class="sidebar-container"/>

        <div class="main-container">
            <div class="sticky">
                <navbar></navbar>
                <tags-view></tags-view>
            </div>
            <app-main/>
        </div>

        <el-dialog title="修改密码" :visible.sync="dialogTableVisible">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="旧密码" prop="oldPass">
                    <el-input v-model="form.oldPass" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input v-model="form.newPass" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="passClass">
                        *密码设置长度6-20字符
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {Navbar, Sidebar, AppMain, TagsView} from './components'
    import Screenfull from '@/components/Screenfull'
    import ResizeMixin from './mixin/ResizeHandler'
    import {reset, check} from '@/api/login'

    export default {
        name: 'Layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            TagsView,
            Screenfull
        },
        data() {
            return {
                userName: '',
                dialogTableVisible: false,
                form: {
                    oldPass: '',
                    newPass: ''
                },
                rules: {
                    oldPass: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ]
                },
                loading: false,
                passMessage: '',
                isTrueOne: false,
                isTrueTwo: false,
                isTrueThree: false,
                elp: ''
            }
        },
        mixins: [ResizeMixin],
        created() {
            this.userName = JSON.parse(localStorage.getItem('userInfo')).username;
            if (localStorage.getItem('pwd_simple')) {
                this.dialogTableVisible = true
            }
        },
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            }
        },
        // watch:{
        //   'form.newPass':{
        //     handler(newName,) {
        //       // console.log(newName.length)
        //       if(newName.length > 5){
        //         setTimeout(() => {
        //           this.checkPassWord(newName)
        //         },1000)
        //       }
        //     },
        //     deep: true,
        //     immediate: true
        //   }
        // },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('closeSideBar', {withoutAnimation: false})
            },
            //刷新
            reFresh() {
                window.location.reload();
            },
            //登出
            logout() {
                window.localStorage.clear();
                window.location.reload();
            },
            //密码弹层
            editPassWord() {
                this.dialogTableVisible = true;
                this.form.oldPass = '';
                this.form.newPass = '';
            },
            //确认修改
            onSubmit() {
                this.loading = true
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        reset(this.form).then(res => {
                            this.$message({
                                type: 'success',
                                message: '密码修改成功'
                            })
                            this.dialogTableVisible = false;
                            localStorage.removeItem('pwd_simple');
                            this.loading = false;
                        }).catch(err => {
                            this.loading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        this.loading = false;
                        return false;
                    }
                });
            },
            changeValue(p) {
                console.log(p)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~@/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

        &.mobile.openSidebar {
            position: fixed;
            top: 0;
        }
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }

    .sticky {
        // position: sticky;
        // position: -webkit-sticky;
        // top: 0;
        // z-index: 999;
        // background: #fff;
    }

    .topBar {
        color: #fff;
        background: #3c8dbc;
        height: 60px;
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 999;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
    }

    .userName {
        font-size: 16px;
        color: #fff;
        font-weight: bold
    }

    .logoLeft {
        font-size: 24px;
    }

    .rightInfo {
        display: flex;
        align-items: center;
    }

    .rightInfo img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    .el-dropdown {
        cursor: pointer;
        color: #fff;
    }

    .right-menu-item {
        display: inline-block;
        margin: 0 10px;
    }

    .screenfull {
        display: flex;
        align-items: center;
    }

    .passClass {
        font-size: 12px;
        display: inline-block;
        margin-right: 10px;
        color: #f56c6c
    }
</style>
