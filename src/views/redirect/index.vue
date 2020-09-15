<script>
    import Http from '@/api/http';

    export default {
        created() {
            Http.get('login/app').then(res => {
                let redirect_uri = '';
                if(process.env.NODE_ENV == 'dev'){
                    redirect_uri = 'http://localhost:9528/#/login';
                }else{
                    redirect_uri = res.redirectUrl;
                }
                localStorage.setItem('redirectUri',redirect_uri);
                let url = `${res.url}?client_id=${res.clientId}&response_type=${res.responseType}&redirect_uri=${encodeURIComponent(redirect_uri)}`
                window.location.href= url;
            })
        }
    }
</script>
