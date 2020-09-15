module.exports = {
    vueTemplate: componentName => {
        return `<template>
                  <div class="app-container">
                        <el-row class="le_main">
                            <h3>基础信息</h3>
                            <ul class="contentInfo">
                                <li>
                                    <p>名称：</p>
                                    <p>{{basicInfo.name}}</p>
                                </li>
                            </ul>
                        </el-row>
                        
                        <el-row>
                            <el-button type="primary" size="small" @click="handleSubmit" :loading="sub_loading">提交</el-button>
                            <el-button size="small">返回</el-button>
                        </el-row>
                  </div>
                </template>
                <script>
                import Http from '@/api/http';
                export default {
                    name: "${componentName}",
                    data () {
                        return {
                            basicInfo:'',
                            sub_loading:false
                        }
                    },
                    mounted () {
                         
                    },
                    methods: {
                        initDetail(){
                            Http.get('',{}).then(res => {
                                
                            })  
                        },
                        handleSubmit(){
                            
                        }
                    }
                }
                </script>
                <style lang="scss" scoped>
                
                </style>`
        }
}
