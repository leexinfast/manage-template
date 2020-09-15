<template>
    <div>

    </div>
</template>

<script>
    import Http from '@/api/http';
    import {GetUrlParam} from '@/utils/index'

    export default {
        name: 'login',
        created() {
            if (GetUrlParam('code')) {
                // console.log('login')
                this.openFullScreen()
            } else {
                this.$router.push('/redirect')
            }
        },
        methods: {
            openFullScreen() {
                const loading = this.$loading({
                    lock: true,
                    text: '拼命登陆中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.8)'
                });
                let str = GetUrlParam('code');
                if(str.indexOf('#') >= -1){
                    str = str.split('#')[0]
                }
                Http.post('login/login',{
                    code:str,
                    state:GetUrlParam('state'),
                    redirectUri:process.env.NODE_ENV == 'dev'?'http://localhost:9528/#/login':localStorage.getItem('redirectUri')
                }).then(res => {
                    localStorage.setItem('userInfo',JSON.stringify(res.staff))
                    localStorage.setItem('token',res.Authorization);
                    window.location.href = window.location.origin + '/#/';
                    loading.close();
                })
            }
        }
    }
</script>
