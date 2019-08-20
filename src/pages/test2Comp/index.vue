
<template>
    <div>
        <h2></h2>
        <h4></h4>
    </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    data: () => ({
         a: 11
    }),
    mounted(){
        
    },
    // computed:{
    //     ...mapState([testData]),

    // },
    methods:  {
        
    }
}
</script>
<style lang="scss" scoped>
    .layout.flexbox{
      margin-top: 110px;
    }
    .layout.flexbox .left-center-right{
      display: flex;
    }
    .layout.flexbox .left{
      width: 300px;
      background: red;
    }
    .layout.flexbox .center{
      flex:1;
      background: yellow;
    }
    .layout.flexbox .right{
      width: 300px;
      background: blue;
    }
</style>
