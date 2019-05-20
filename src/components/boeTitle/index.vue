<template>
 <div class="boe-title">
     <span class="split"></span><span class="txt"><slot>联系人</slot></span>
  </div>
</template>
<style lang="scss">
 .boe-title{
   padding-bottom:10px;
   border-bottom:1px solid #eaeaea;
   margin: 35px auto 25px;
   .split{
     border-left: 3px solid #3491E0;
     margin-right:10px;
     height: 15px;
     display: inline-block;
     vertical-align: bottom;
    }
    .txt{
      color:#262626;
      font-size: 16px;
    }
 }
</style>

