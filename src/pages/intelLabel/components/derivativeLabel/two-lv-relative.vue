<template>
  <div 
    v-loading="watchLoading"
    element-loading-text=""
    element-loading-spinner="el-icon-loadin"
    element-loading-background="rgba(0, 0, 0, 0)"
    class="relative-component">
    <el-collapse class="collapse" @change="onCollapseChange" v-model="activeName">
      <el-collapse-item class="title" name="onitem">
        <template slot="title" style="display:none;">
          <div class="collapse-title">
            <div>
              <i v-if="!isExpand" class="el-icon-plus"></i>
              <i v-if="isExpand" class="el-icon-minus"></i>
              选择标签
            </div>
            <div v-if="currentType!='watch'" @click.stop="plusItem" style="color: #5A8CFF;">
              <i class="el-icon-circle-plus-outline"></i>
              添加
            </div>
          </div>
        </template>

        <conditions-component 
            style="margin-left: 50px;margin-top:15px;" 
            :remoteData="remoteData" 
            :conditonGroupData="conditonGroupData" 
            :onChangeAndOr="onChangeAndOr" 
            :atomTagList="atomTagList" 
        ></conditions-component>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>


  import Vue from 'vue'
  import api from '@/api/';
  import mixins from '@/constants/mixins';
  import ConditionsComponent from './conditions.vue'
  export default {
    mixins: [mixins],
    name: 'HelloWorld',
    components: { 'conditions-component': ConditionsComponent },
    data() {
      return {
        activeName: "",
        isExpand: false,
        atomTagList: null,
        remoteData: null,
        conditonGroupData: []
      }
    },
    props: ['editData','objectId','currentType'],
    computed: {
      watchLoading(){
        return this.currentType=='watch'?true:false
      }
      
    },
    watch: {
      editData: function (newVal, oldVal) {
        // 初始化
        this.initRelative(newVal)
        if(this.conditonGroupData.length > 0){
          this.isExpand = true
          this.activeName = 'onitem'
        }else{
          this.isExpand = false
           this.activeName = ''
        }

      }
    },
    methods: {
      onCollapseChange(a) {
        this.isExpand = !this.isExpand
      },
      plusItem() {
        this.conditonGroupData.push({
          "conditions": [
            {
              "op": "",
              "columnName": "",
            }
          ],
          "op": "and"
        })
        this.isExpand = true
        this.activeName = "onitem"
      },

      onChangeAndOr(value) {
        this.remoteData.op = value
      },

      // 获取类目标签列表
      fetchAtomTagCategory() {
        const { objectId } = this;
        
        api.derivativeColumn({objectId}).then(res => {
            if(res.success){
              this.atomTagList = res.data;
            }else{
              this.commonAlert(res);
            }
        })
        // api.atomTagCategory({}).then(res => {
        //   if (res.success) {
        //     this.atomTagList = res.data
        //     // 直接获取所有类目表的可选元素(弃用)
        //     if (this.atomTagList && this.atomTagList.length > 0) {
        //       this.atomTagList.forEach((item) => {
        //         api.getTagByCategory({
        //           class1Id: item.tagClass1,
        //           class2Id: item.tagClass2
        //         }).then(res => {
        //           if (res.success) {
        //             res.data.forEach((item) => {
        //               item.id = parseInt(item.id)
        //             })
        //             this.$set(this.atomTagMapItem, item.tagClass2, res.data)
        //           }
        //         })
        //       })
        //     }
        //   } else {
        //     this.commonAlert(res);
        //   }
        // })
      },

      getRelative() {
        let relativeObject = {}
        relativeObject.op = this.remoteData.op // 顶级节点直接用绑定的
        relativeObject.conditions = []
        relativeObject.children = []

        if(this.conditonGroupData.length > 1){
          this.conditonGroupData.forEach((group) => {
            // groupItem 都是数组，如果1个就是对象
            if (group.conditions && group.conditions.length > 1) {
              relativeObject.children.push(group)
            } else if (group.conditions && group.conditions.length === 1) {
              group.conditions.forEach((groupItem) => {
                relativeObject.conditions.push(groupItem)
              })
            }

          })
        }else{
            // 特殊处理，只有一个或者空节点就升级
          this.conditonGroupData.forEach((group) => {
            // groupItem 都是数组，如果1个就是对象
            if (group.conditions && group.conditions.length >= 1) {
              group.conditions.forEach((condition)=>{
                relativeObject.conditions.push(condition)
              })
            }

          })
        }
        
        return {relativeObj:relativeObject,conditonGroupData: this.conditonGroupData}
      },

      initRelative(editData) {
        this.conditonGroupData = []
        if (editData) {
          this.remoteData = editData
        } else {
          this.remoteData = { op: "and" }
        }


        this.conditonGroupData = []
        if (this.remoteData && this.remoteData.conditions) {
          this.remoteData.conditions.forEach((condition) => {
            this.conditonGroupData.push({ conditions: [condition] }) // 全部都以数组来看待
          })
          // this.conditonGroupData.push([this.remoteData]) // 全部都以数组来看
        }

        if (this.remoteData.children) {
          this.remoteData.children.forEach((childNode) => {
            this.conditonGroupData.push(childNode)
          })
        }
      },

      initSelfData(){
          this.isExpand = false
          this.activeName = ''
      }
    },

    mounted() {
      this.initRelative(this.editData)
      this.fetchAtomTagCategory()
      if(this.conditonGroupData.length > 0){
          this.isExpand = true
          this.activeName = 'onitem'
        }else{
          this.isExpand = false
           this.activeName = ''
        }
    }
  } 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .collapse-title {
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  /deep/ .el-collapse-item__arrow {
    display: none;
  }
  .relative-component {
    border: 1px solid #d2c1c1;
    border-radius: 4px;
  }
 /deep/ .el-collapse-item__wrap{
    max-height: 200px;
    overflow-y: auto !important;
    -webkit-scrollbar: unset;
  }
</style>
