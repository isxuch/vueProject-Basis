<template>
    <div id="app">
        <div class="page">
            <keep-alive>
                <router-view v-if="$route.meta.keep"></router-view>
            </keep-alive>
            <!--不缓存的视图-->
            <transition name="fade" mode="out-in">
                <router-view v-if="!$route.meta.keep" :key="$route.path + $route.query.t"></router-view>
            </transition>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'App',
    }
</script>

<style lang="scss">
    
</style>

