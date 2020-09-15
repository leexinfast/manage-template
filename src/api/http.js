import axios from 'axios';
import QS from 'qs';
import {Message} from 'element-ui';
import {addObj, sortObj} from '@/utils/sign';
import {md5} from '@/utils/md5';


//获取环境域名
axios.defaults.baseURL = process.env.BASE_API;

// 请求超时时间
axios.defaults.timeout = 100000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        token && (config.headers.Authorization = token);
        return config;
    },
    error => {
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(response => {
        if (response.status == 200) {
            if (response.data.code == 0) {
                return Promise.resolve(response.data);
            } else if (response.data.code == 104) {
                // window.localStorage.clear();
                // window.location.href = window.location.origin + '/#/login';
                Message.error(response.data.message)
                return
            } else {
                Message.error(response.data.message)
                return Promise.reject(response);
            }
        } else {
            return Promise.reject(response);
        }
    }, error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401
                case 401:
                    window.localStorage.clear();
                    window.location.href = window.location.origin + '/#/login';
                    Message.error(response.data.message)
                    break;
                // 403
                case 403:
                    Message.error(403);
                    break;
                // 404请求不存在
                case 404:
                    Message.error('网络请求不存在');
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Message.error(error.response.data);
            }
            return Promise.reject(error.response);
        }
    }
);

//get
export function get(url, params) {
    return new Promise((resolve, reject) => {
        // let timestamp = Date.parse(new Date()) / 1000;
        // let newData = addObj(params, 'timestamp', timestamp);
        // let sign = md5(sortObj(newData));
        // delete params.timestamp;
        axios({
            method: 'get',
            headers: {
                fromBy: 1,
                resource:3
                // timestamp: timestamp,
                // sign: sign
            },
            url: url,
            params: params
        }).then(res => {
            if (res) {
                resolve(res.data);
            } else {
                reject()
            }
        }).catch(err => {
            reject(err)
        })
    });
}

//post
export function post(url, params) {
    return new Promise((resolve, reject) => {
        // let timestamp = (new Date()).valueOf();
        // let newData = addObj(params, 'timestamp', timestamp);
        // let sign = md5(sortObj(newData));
        // delete params.timestamp;
        axios({
            method: 'post',
            headers: {
                fromBy: 1,
                resource:3
                // timestamp: timestamp,
                // sign: sign
            },
            url: url,
            data: QS.stringify(params)
        }).then(res => {
            if (res.code == 0) {
                resolve(res.data);
            } else {
                resolve(res);
            }
        }).catch(err => {
            reject(err)
        })
    });
}

//posts
export function posts(url, params) {
    return new Promise((resolve, reject) => {
        // let timestamp = Date.parse(new Date()) / 1000;
        // let newData = addObj(params, 'timestamp', timestamp);
        // let sign = md5(sortObj(newData));
        // delete params.timestamp;
        axios({
            method: 'post',
            headers: {
                fromBy: 1,
                resource:3
                // timestamp: timestamp,
                // sign: sign,
                // 'Content-Type':'application/json; charset=UTF-8'
            },
            url: url,
            data: params
        }).then(res => {
            if (res.code == 0) {
                resolve(res.data);
            } else {
                resolve(res);
            }
        }).catch(err => {
            reject(err)
        })
    });
}

//export
export function getUrl(url, params) {
    return axios.defaults.baseURL + url + '?' + QS.stringify(params)
}

const Http = {
    post: post,
    posts:posts,
    get: get
}
export default Http;

