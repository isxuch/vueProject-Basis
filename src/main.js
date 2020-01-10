import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Api, { OAuth } from '@/api';
// ES6 转 ES5
import '@babel/polyfill';
import { Toast } from 'vant';

Vue.use(Toast);
Vue.prototype.$Api = Api;
Vue.prototype.$OAuth = OAuth;


router.beforeEach((to, from, next) => {
    if (to.meta.title) document.title = to.meta.title;
    // 跳转的不是授权页面  注入微信权限
    if (to.path != "/author") {
        // OAuth.wxConfig();
    }
    next();
});

new Vue({
    router,
    store,
    render: h => h(App),
    data(){
        return {
            //全局Loading控制
            isLoading:true
        }
    }
}).$mount('#app');
