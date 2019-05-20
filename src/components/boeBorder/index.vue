<template>
  <div class="table-boder">
     <slot></slot>
  </div>
</template>

<script>
    export default {
        name: "boe-border"
    }
</script>

<style lang="scss">
  .table-boder{
    border: 1px solid #eaeaea;
    .el-table__header{
      th{
        div{
          color:#262626;
        }
      }
    }
    .el-table td, .el-table th.is-leaf{
      border:none;
    }
    .el-table td{
      border-top: 1px solid #eaeaea;
    }
    .el-table::before{
      height:0;
    }
  }
</style>
