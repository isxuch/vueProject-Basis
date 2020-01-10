import axios from 'axios';
import qs from 'qs'
// 项目名称
const PROJUCTNAME = "MMS_CHRIS";
// 接口成功状态标识
const API_SUCCESS = "SUCCESS";
const API_FAIL = { 'FAIL': true, 'EXCEPTION': true };
// 接口前缀名
const API_NAME = '/api-flow';
// 方法请求
const doAxios = (method = 'GET', url, option = {}) => {
    url = API_NAME + url;
    if (typeof option.params === 'string' || typeof option.params === 'number') {
        url += option.params;
        delete option.params;
    }
    if (method == 'GET') {
        return axios.get(url, option).then(res => res.data).catch(res => res.data);
    }
    else {
        return axios.post(url, qs.stringify(option.data), option).then(res => res.data).catch(res => res.data);
    }

};

// 请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

// 响应拦截（配置请求回来的信息）
axios.interceptors.response.use(
    response => {
        if (response.data.code != API_SUCCESS) {
            if (API_FAIL[response.data.code]) {
                console.error('接口错误: ', response.data.msg);
                //异常信息
            }
            else if (response.data.code == 'TOKEN_ERROR' || response.data.code == 'NO_LOGIN') {
                // //失效
                localStorage.removeItem(`MMS_CHRIS-token`);
                !localStorage.PROJUCTNAME && (localStorage.PROJUCTNAME = location.href);
                location.replace('#/author');
                return false;
            }
        }
        return response;
    }
);

// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use(config => {
    config.headers['OAuth-Token'] = localStorage[`${PROJUCTNAME}-token`];
    return config
}, function (error) {
    return Promise.reject(error)
});

const Api = {
    user: {
        getInfo: option => doAxios('GET', '/user/wx/getInfo', option),    // 获取用户信息
        getShareConfig: option => doAxios('POST', '/wx/share', option),    // 微信分享
        login: option => doAxios('POST', '/user/login', option),    // o->token
        oAuth: option => doAxios('POST', '/user/auth', option),//code->token
        processUrl: option => doAxios('GET', '/user/authUrl', option),    // 授权链接
        getLoginer: option => doAxios('GET', '/user/getLoginer', option),    // 获取登陆者信息
        getUser: option => doAxios('GET', '/user/getUser', option),    // 获取用户信息
    }
};



// 授权
class OAUTH {
    constructor() {
        this.PROJUCTNAME = PROJUCTNAME;
    }
    // 获取授权地址
    auth(callback) {
        const code = this.getUrlParam("code");
        const url = window.location.href;
        this.removeAuth();
        if (code) {
            this.getSessionId(callback);
        } else {
            Api.user.processUrl({
                params: {
                    url,
                    type: 2
                }
            }).then((res) => {
                if (res.code == API_SUCCESS) {
                    window.location.replace(res.data)
                } else {
                    wx.closewindow();
                }
            })
        }
    }
    // 获取session id
    getSessionId(callback) {
        const code = this.getUrlParam("code");
        //获取SessionID
        if (code) {
            Api.user.oAuth({
                data: {
                    code,
                    type: 2
                }
            }).then((res) => {
                if (res.code == 'SUCCESS') {
                    localStorage.setItem(`${PROJUCTNAME}-sessionId`, res.data);
                    this.getToken(callback);
                }
            })
        } else {
            this.auth(callback);
        }
    }
    // 清空token和sessionId
    removeAuth() {
        localStorage.removeItem(`${PROJUCTNAME}-sessionId`);
        localStorage.removeItem(`${PROJUCTNAME}-token`);
    }
    // 获取token
    getToken(callback) {

        var _this = this;
        var token = localStorage.getItem(`${PROJUCTNAME}-token`);
        var sessionId = localStorage.getItem(`${PROJUCTNAME}-sessionId`);

        if (!sessionId) {
            _this.getSessionId(callback);
        } else {
            if (token) {
                return token;
            } else {
                //有sessionID  直接获取token
                Api.user.login({
                    data: {
                        sessionId: sessionId
                    }
                }).then((res) => {
                    if (res && res.data) {
                        token = res.data;
                        localStorage[`${PROJUCTNAME}-token`] = token;
                        _this.getLoginer(callback);
                        // callback();
                    }
                    else {
                        localStorage.removeItem(`${PROJUCTNAME}-sessionId`);
                        _this.getSessionId(callback);
                    }
                });
            }
        }
        return token;
    }

    // 获取登陆者code
    getLoginer(callback) {
        Api.user.getLoginer().then((res) => {
            let str = JSON.stringify(res.data)
            localStorage.setItem('userCode',str)
            callback();
        });
    }
    // 获取参数
    getUrlParam(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null)
            return unescape(r[2]);
        return null; // 返回参数值
    }
    wxConfig() {
        let wxConfigParams = Api.act.share({
            params: {
                url: window.location.href.split('#')[0]
            }
        });
        wxConfigParams.then((res) => {
            res.data && wx.config({
                debug: false,
                appId: res.data.appid,
                timestamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideMenuItems'
                ]
            });
        });
    }
    wxConfig(cb) {
        let wxConfigParams = Api.user.getShareConfig({
            params: {
                url: location.href.split('#')[0]
            }
        });
        wxConfigParams.then((res) => {
            if (res && res.data) {
                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideMenuItems',
                        'chooseWXPay'
                    ]
                });
                wx.ready(function () {
                    let share = {
                        img: location.origin + '/h5/christmas/' + require('../../static/share.jpg'),
                        title: '请你送我一个圣诞树装饰',
                        desc: '我正在装饰圣诞树，需要你的帮忙~',
                        link: window.location.protocol + '//' + window.location.host + '/h5/christmas/index.html#/guide',
                        messageSuccess: () => { },
                        timeline: () => { },
                        callback: () => { }
                    };
                    cb && (share = Object.assign(share, cb));
                    wx.onMenuShareAppMessage({
                        title: share.title,
                        desc: share.desc,
                        link: share.link,
                        imgUrl: share.img,
                        success: function () {
                            share.messageSuccess();
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: share.title,
                        link: share.link,
                        imgUrl: share.img,
                        success: function () {
                            share.timeline();
                        }
                    });
                    share.callback && share.callback();
                });
            }
        });
    }

}

export const OAuth = new OAUTH();

// 导出的API请求
export default Api;
