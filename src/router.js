import Vue from 'vue';
import Router from 'vue-router';
// 授权页
import Author from './views/author';
Vue.use(Router);
export default new Router({
    routes: [
        // 授权
        {
            path: '/author',
            name: 'author',
            component: Author,
            meta:{
                title:''
            }
        },
    ]
});
