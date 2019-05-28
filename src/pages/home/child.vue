<template>  
    <div>
        <div>这是home child页面</div>
        <el-button type="primary" @click="jumpRoute">跳转home</el-button>
    </div>
</template>
<script>
export default {
    name: "Home",
    components: {},
    data(){
        return {
            name: 'free frozen',
            url: ''
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm => {
            vm.url = from;
        });
    },
    mounted(){
        
    },
    methods: {
        jumpRoute(){
            this.$router.push('/home')
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
