<template>
    <el-container>
        <el-header class="vk-header">
            <Topbar />
        </el-header>
         <el-main style="padding:0px">
               <router-view></router-view>
         </el-main>
    </el-container>
</template>

<script>
import Topbar from './components/TopBar';

export default {
    components: {Topbar},
    data(){
        return{ 
            msg: 'new data'
        }
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
    .vk-header{
        padding: 0px;
    }
</style>
