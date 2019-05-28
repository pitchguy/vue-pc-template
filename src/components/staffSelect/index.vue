<template>
  <div class="boe-component-staff-select">
    <div class="m-left-container">
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchKey" placeholder="搜索用户" size="mini"></el-input>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button size="mini" type="primary" @click="addUser">添加</el-button>
        </el-col>
      </el-row>
      <div style="margin-top:10px;overflow: auto" v-loading="loading"  element-loading-background="rgba(255, 255, 255, 0.6)" element-loading-text="加载中...">
        <el-tree
          v-show="isSearch"
          ref="selectTree"
          :style="{height:height}"
          :data="searchList"
          :props="selectTreeProps"
          node-key="id"
          show-checkbox>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{data.userName}}({{data.userCode}})</span>

            <span v-if="data.orgPath.length<25" class="text-right">{{data.orgPath}}</span>
            <el-tooltip v-else effect="light" :content="data.orgPath" placement="top-end">
              <span>{{data.orgPath.substring(0,25)}}...</span>
            </el-tooltip>
          </span>
        </el-tree>

        <el-tree
          v-show="!isSearch"
          :style="{height:height}"
          ref="orgTree"
          :props="treeProps"
          :load="loadOrganizationData"
          node-key="nodeId"
          show-checkbox
          lazy>
        </el-tree>
      </div>
    </div>
    <div class="m-right-container">
      <div class="m-action-wrapper">
        <div class="m-left">
          <el-checkbox  v-model="isAllChecked">全选</el-checkbox>
        </div>
        <div class="m-right">
          <a class="color-error" v-if="isAllChecked" href="javascript:void(0);" @click="handleMultipleDelete">删除</a>
        </div>
      </div>
      <ul class="m-staff-list">
        <li class="m-staff" v-for="user in userList" :key="user.nodeId">
          <div class="m-left"><el-checkbox v-model="user.checked" @change="handleUserChange">{{user.nodeName}}（{{user.userCode}}）</el-checkbox></div>
          <div class="m-right"><a class="color-error" href="javascript:void(0);" @click="handleSingleDelete(user.nodeId)">删除</a></div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import API from '@/api';

export default {
  data(){
    return {
      treeProps:{
        children: 'nodeId',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      selectTreeProps:{
        label:'userName',
      },
      userList:[],
      deleteList:[],
      isAllChecked:false,
      searchKey:'',
      searchList:[],
      loading:true,
    }
  },
  props:{
    limit:{
      type:Number,
      default:200
    },
    height:{
      type:String,
      default:'320px'
    },
    selectUserList:{
      type:Array,
      default:[]
    },
    width:{
      type:String,
      default:'700px'
    }
  },
  computed:{
    isSearch(){
      return this.searchKey!=='';
    }
  },
  watch:{
    deleteList(){
      if(this.deleteList.length>0&&this.deleteList.length===this.userList.length){
        this.isAllChecked=true;
      }else{
        this.isAllChecked=false;
      }
    },
    isAllChecked(){
      this.userList.forEach(user=>{user.checked=this.isAllChecked});
      this.deleteList=this.userList.filter(user=>user.checked);
    },
    searchKey(){
      if(this.searchKey!==''){
        this.loading = true;
        this.selectUser();
      }else{
        this.searchList = [];
      }
    }
  },
  methods:{
    //获取组织树数据
    loadOrganizationData(node, resolve){
      if(node.level===0){
        this.fetchOrganizationData(node.level,node,resolve);
      }else{
        this.fetchOrganizationData(node.data.nodeId,node,resolve);
      }
    },
    //拉取数据
    fetchOrganizationData(orgcode,parseNode,resolve){
      this.loading = true;
      API.fetchOrganizationWithPeopleList({
          orgcode
        }).then(response=>{
        this.loading = false;
          const {success,data} = response;
          if(success){
            data.forEach(item=>{
              if(item.type===1){
                item.disabled=true;
              }else{
                item.leaf=true;
              }
            });
            resolve(data);
          }else{
            resolve([]);
          }
          this.$refs.orgTree.setCheckedNodes(this.userList);
        });
    },
    //搜索
    selectUser(){
      API.selectUserByName({
        name:this.searchKey
      }).then(response=>{
        const {success,data} = response;
        this.loading = false;
        if(success){
          this.searchList = data;
        }else{
          this.$message.error(message);
        }
        this.$refs.selectTree.setCheckedKeys(this.userList.map(user=>{return user.nodeId}));
      }).catch(()=>{});
    },
    //添加人员
    addUser(){
      this.$refs[this.isSearch?'selectTree':'orgTree'].getCheckedNodes().forEach((select)=>{
        const theUser=this.userList.find(user=>{
          return user.userCode === select.userCode;
          // return user.nodeId===select.nodeId;
        });
        if(!theUser&&!select.type){
          if(this.isSearch){
            this.userList.push({
              nodeId:select.id,
              nodeName:select.userName,
              userCode:select.userCode
            });
          }else{
            this.userList.push(select);
          }
        }
      });
      this.triggerChange();
    },
    //删除单个人员
    handleSingleDelete(nodeId){
      this.userList=this.userList.filter(user=>user.nodeId!==nodeId);
      this.$refs.orgTree.setCheckedNodes(this.userList);
      this.triggerChange();
    },
    //批量删除人员
    handleMultipleDelete(){
      this.deleteList.forEach((user)=>{
        this.handleSingleDelete(user.nodeId);
      });
      this.deleteList=[];
    },
    //人员勾选
    handleUserChange(){
      this.deleteList=this.userList.filter(user=>user.checked);
    },
    //触发change事件
    triggerChange(){
      this.$emit("change",this.userList.map(user=>{
        return {
          userId:user.nodeId,
          userName:user.nodeName,
          userCode:user.userCode
        }
      }));
    },

    //映射到userList
    mapToUserList(selectUserList){
      this.userList=selectUserList.map(user=>{
        return {
          nodeId:user.userId,
          nodeName:user.userName,
          userCode:user.userCode
        }
      });
    }
  },
  mounted(){
    this.mapToUserList(this.selectUserList);
    this.$refs.orgTree.setCheckedNodes(this.userList);
  }
}
</script>
<style lang="scss" scoped>
.boe-component-staff-select{
  display: flex;
  .m-left-container{
    flex: 1;
    border-right: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding-right: 10px;
    .m-organization-tree{
      overflow: auto;
    }
  }
  .m-right-container{
    flex: 0 0 260px;
    padding-left:10px;
    box-sizing: border-box;
    .m-action-wrapper{
      display: flex;
      .m-left{
        flex: 1;
      }
    }
    .m-staff-list{
      .m-staff{
        display: flex;
        line-height: 26px;
        .m-left{
          flex:1;
        }
        // .m-right{

        // }
      }
    }
  }
}
</style>
