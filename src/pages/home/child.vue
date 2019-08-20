<template>
  <div>
    <div>这是home child页面</div>
    <div>
      <i class="el-icon-circle-plus-outline" @click="add" />
      <i class="el-icon-remove-outline" />
      <el-button @click="getData">取之</el-button>
    </div>
    <div v-for="(child,index) in elements" :key="index">
      <el-input v-model="wholeData[child.name1]" placeholder="请输入内容1"></el-input>
      <el-input v-model="wholeData[child.name2]" placeholder="请输入内容2"></el-input>
      <el-input v-model="wholeData[child.name3]" placeholder="请输入内容3"></el-input>
      <el-input v-model="wholeData[child.name4]" placeholder="请输入内容4"></el-input>
      <i class="el-icon-circle-plus-outline" @click="add" />
      <i class="el-icon-remove-outline" @click=remove(child.childNum) />
    </div>
  </div>
</template>
<script>
import { compact } from 'lodash';
export default {
  name: "Home",
  components: {},
  data() {
    return {
      elements: [],
      currentChildNum: 0,
      wholeData: {},
      name: "free frozen",
      url: ""
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.url = from;
    });
  },
  mounted() {},
  methods: {
    add(){
      let currentChildNum = this.currentChildNum + 1;

      this.currentChildNum = currentChildNum;
      this.elements.push({
        childNum: currentChildNum,
        name1: `input1-value-${currentChildNum}`,
        name2: `input2-value-${currentChildNum}`,
        name3: `input3-value-${currentChildNum}`,
        name4: `input4-value-${currentChildNum}`,
      })
    },
    remove(num){
      const oldData = JSON.parse(JSON.stringify(this.wholeData));
      const targetArr = [`input1-value-${num}`,`input2-value-${num}`,`input3-value-${num}`,`input4-value-${num}`];
      const newElements = compact(this.elements.map(res => {return res.childNum == num?'':res}));

      targetArr.map(res => delete oldData[res])
      this.$nextTick(() => {
        this.$set(this,'wholeData', oldData)
        this.$set(this, 'elements', newElements)
      })
    },
    getData(){
      let childNumArr = this.elements.map(res => res.childNum).map(res => {
        return {
          [`input1-value-${res}`]: '',
          [`input2-value-${res}`]: '',
          [`input3-value-${res}`]: '',
          [`input4-value-${res}`]: ''
        }
      })

      childNumArr.map(res => {
        Object.keys(res).map(result => {
          res[result] = this.wholeData[result]
        })
      })
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
