<template>
  <div>
    <div :class="color" class="div-point"></div>
  </div>
</template>

<script>
    export default {
      props:{
        color:{
          type:String,
          default:'blue'
        }
      },
        name: "boe-point"
    }
</script>

<style lang="scss">
  .div-point{
    height: 10px;
    width: 10px;
    border-radius:50%;
    margin-right: 10px;
    display: inline-block;
  }
  .blue{
    background-color:#409EFF
  }
  .red{
    background-color:#F5222D
  }
  .grey{
    background-color:#8c8c8c
  }
  .green{
    background-color:#52C41A
  }
</style>
