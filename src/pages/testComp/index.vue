<template>
    <el-container>
        <el-button type="primary" @click="plus">+1</el-button>
        <el-button type="error" @click="minus">-2</el-button>
        <div>
            <h1>结果等于：{{testVuex.result}}</h1>
            <h1>结果等于：{{getterResult}}</h1>
        </div>
    </el-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
    data: () => ({
         a: 11
    }),
    mounted(){
        
    },
    computed: {
        ...mapState(["testVuex"]),
        getterResult(){
            return this.$store.getters.testData
        }

    },
    methods:  {
        plus(){
            this.$store.dispatch('setNewData',{type: 'plus',value:1})
        },
        minus(){
            this.$store.dispatch('setNewData',{type: 'minus',value:2})
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>
