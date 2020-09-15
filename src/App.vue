<template>
    <div id="app">
        <router-view></router-view>
        <el-tooltip placement="top" content="返回顶部">
            <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade"/>
        </el-tooltip>
    </div>
</template>

<script>
    import BackToTop from '@/components/BackToTop'

    export default {
        name: 'App',
        components: {BackToTop},
        data() {
            return {
                myBackToTopStyle: {
                    right: '50px',
                    bottom: '50px',
                    width: '40px',
                    height: '40px',
                    'border-radius': '4px',
                    'line-height': '45px',
                    background: '#e7eaf1'
                }
            }
        }
    }
</script>
<style scoped>
    #app {
        background: rgb(246, 246, 246);
    }
</style>

