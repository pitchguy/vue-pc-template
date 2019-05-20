<template>
  <span class="boe-btn"  @click="handleClick"><slot>按钮</slot></span>
</template>
<script>
export default {
  name: 'boe-btn',
   methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      }
  }
}
</script>

<style>
 .boe-btn{
  color: #3491E0;
  cursor: pointer;
 }
</style>

