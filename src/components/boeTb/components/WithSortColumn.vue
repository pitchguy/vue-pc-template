<template>
  <span>
    {{label}}
    <span class="caret-wrapper" @click="handleSortChange">
      <i class="sort-caret ascending" :class="{active:sortType==='asc'&&label===sortColumn.label}" ></i>
      <i class="sort-caret descending" :class="{active:sortType==='desc'&&label===sortColumn.label}" ></i>
    </span>
    <!--<span class="caret-wrapper">-->
      <!--<i class="sort-caret ascending" :class="{active:sortType==='asc'&&label===sortColumn.label}" @click="handleSortChange('asc')"></i>-->
      <!--<i class="sort-caret descending" :class="{active:sortType==='desc'&&label===sortColumn.label}" @click="handleSortChange('desc')"></i>-->
    <!--</span>-->
  </span>
</template>
<script>
export default {
  props:{
    label:String,
    sortColumn:Object,
    sortType:String,
  },
  data(){
    return{
      order:'',
    }
  },
  methods:{
    handleSortChange(order){
      if(this.order===''){
        this.order = 'asc';
      }else if(this.order ==='asc'){
        this.order = 'desc';
      }else{
        this.order = '';
      }
      this.$emit('sort' , this.order);
      // if( this.currentOrderby!==order){
      //   this.$emit('sort',order);
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ascending{
    &.active{
      border-bottom-color: #409eff
    }
  }
  .descending{
    &.active{
      border-top-color: #409eff
    }
  }
</style>
