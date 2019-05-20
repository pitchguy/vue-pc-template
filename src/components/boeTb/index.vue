<template>
    <boe-border>
    <el-table
      :data="data"
      :border='false'
      size="small"
      @selection-change="handleSelectionChange">
      <el-table-column :resizable="resizable"  v-if="selection" type="selection"/>
      <el-table-column
        :resizable="resizable"
        v-for="column in columns"
        :key="column.key"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :type="column.type"
        :fixed="column.fixed"
        :render-header="headerRender">
        <template slot-scope="scope">
          <div v-if="column.prop==='actions'" class="text-button">
            <span
              v-for="(action,index) in typeof column.actions==='function'?column.actions(scope.row,scope.$index):column.actions"
              :key="action.key">
            <boe-line v-if="index>0"></boe-line>
            <span @click="action.handler(scope.row,scope.$index)"
                  class="boe-btn">{{typeof action.label==='function'? action.label(scope.row,scope.$index):action.label}}
            </span>
          </span>
          </div>
          <div v-if="column.type==='index'">{{scope.$index+1}}</div>
          <div v-else-if="column.type==='switch'">
            <el-switch
              v-model="scope.row[column.prop]"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="column.handler(scope.row,scope.$index)">
            </el-switch>
          </div>
          <el-dropdown v-else-if="Array.isArray(scope.row[column.prop])&&scope.row[column.prop].length>0">
              <span class="el-dropdown-link">
                {{column.formatter?column.formatter(scope.row,scope.column,scope.row[column.prop],scope.$index)[0]:scope.row[column.prop][0]}}<i class="el-icon-arrow-down el-icon--right color-primary"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(dropdown,index) in column.formatter?column.formatter(scope.row,scope.column,scope.row[column.prop],scope.$index):(scope.row[column.prop])" :key="index">{{dropdown}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-else-if="Array.isArray(scope.row[column.prop])&&scope.row[column.prop].length===0">-</span>
          <span v-else-if="typeof column.formatter==='function'" v-html="column.formatter(scope.row,scope.column,scope.row[column.prop],scope.$index)?column.formatter(scope.row,scope.column,scope.row[column.prop],scope.$index):'-'"></span>
          <span v-else v-html="scope.row[column.prop]===0?scope.row[column.prop]:(scope.row[column.prop]?scope.row[column.prop]:'')"></span>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
    </boe-border>
</template>
<script>
import WithFilterColumn from './components/WithFilterColumn';
import WithSortColumn from './components/WithSortColumn';
import BoeLine from "../boeLine/index";
export default {
  components: {BoeLine},
  data(){
    return {
      sortColumn:{},
      sortType:''
    }
  },
  props:{
    resizable:{
      type:Boolean,
      default:false
    },
    stripe:{
      type:Boolean,
      default:true
    },
    selection:{
      type:Boolean,
      default:false
    },
    border:{
      type:Boolean,
      default:false
    },
    data:{
      type:Array,
      required:true,
      default:()=>[]
    },
    columns:{
      type:Array,
      required:true,
      default:()=>[]
    },
    size:{
      type:String,
      default:'small'
    }

  },
  methods:{
    //多选
    handleSelectionChange(selection){
      this.$emit('selection-change',selection);
    },
    //排序
    handleSortChange({column, prop, order}){
      this.$emit('sort-change',column, prop, order);
    },
    //头部渲染
    headerRender(createElement,{$index,column}){
      let finalIndex=$index;
      if(this.selection)  finalIndex--;
      const {filterable,sortable,prop,label,filterType,checkList,selectList,filterChange}=this.columns[finalIndex];
      if(filterable){
        return createElement(WithFilterColumn,{
          props:{
            label:label,
            filterType:filterType,
            checkList:typeof checkList === 'function'?checkList():checkList,
            selectList:typeof selectList === 'function'?selectList():selectList
          },
          on:{
            filter:(value)=>{
              filterChange(value);
            }
          }
        });
      }else if(sortable){
        return createElement(WithSortColumn,{
          props:{
            label:label,
            sortColumn:this.sortColumn,
            sortType:this.sortType
          },
          on:{
            sort:(order)=>{
              this.$emit('sort-change',column, prop, order);
              this.sortColumn=column;
              this.sortType=order;
            }
          }
        });
      }else{
        return label;
      }
    }
  }
}
</script>
<style lang="scss">
  .el-dropdown{
    font-size: 12px;
  }
  .el-table thead th {
    background: #f5f7fa;
  }
  .text-button{
    button{
      padding: 0;
      font-size: 14px;
    }
  }
</style>
