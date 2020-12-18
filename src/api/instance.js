import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
    // baseURL: '/column',
    baseURL: ''
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    config.headers['From'] = 'Web';
    // Do something before request is sent
    if (config.method.toUpperCase() === 'GET') {
        config.url += config.url.match(/\?/) ? '&' : '?';
        config.url += '_=' + new Date().getTime();
        config.paramsSerializer = function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
    config.headers['AID'] = '2e0f4b3e554944f28c93e50fc0f7cc41';
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use((response) => {
    // Do something with response data
    if (response.data.message == 'offline') {
        window.location.href = response.data.content;
        return
    }
    if (response.data) return response.data;
    return Promise.reject(response.data);
}, (error) => {
    return Promise.reject(error);
})
export default instance;