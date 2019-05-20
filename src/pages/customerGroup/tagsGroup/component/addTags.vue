<template>
  <div class="vk-addTags">
    <div style="display:flex;margin:12px 0 20px 0;flex-direction: column;">
      <div class="vk-inputGroup">
        <div class="title">
          <p>筛选条件</p>
          <a class="fr open" href="javascript:void(0)" @click="toggleSlide">
            {{toggleSlideFlag?'收起':'展开'}}
          </a>
        </div>
        <!-- 城市选择 -->
        <el-select v-model="bindValue.cityValue" clearable filterable placeholder="请选择城市" @change="cityChange">
          <el-option v-for="item in cityOptions" :key="item.cityName" :label="item.cityName" :value="item.cityName">
          </el-option>
        </el-select>
        <!-- 项目切换   -->
        <el-tooltip :disabled="!projectDisable" content="请先选城市再选项目" placement="top" effect="dark">
          <span>
            <el-select v-model="bindValue.projectValue" :disabled="projectDisable" clearable filterable placeholder="请选择项目" @change="projectChange">
              <el-option v-for="item in projectOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </span>
        </el-tooltip>
      </div>
      <div class="vk-title" style="margin-top:20px;">
        <p>选择/搜索标签</p>
        <el-cascader ref="cuCascader" class="cus-ca" :options="options" :props="{
                        value:'id',
                        label:'tagName'
                    }" expand-trigger="hover" v-model="selectedOptions" placeholder="请选择标签" @change="handleChange">
        </el-cascader>
        <el-select v-model="selectTag" filterable placeholder="输入关键搜索标签" @change="handleSelect">
          <el-option v-for="item in results" :key="item.tagClass2Id+item.id" :label="item.tagName" :value="item">
          </el-option>
        </el-select>
      </div>

    </div>
    <el-collapse-transition>
      <div v-if="toggleSlideFlag">
          <div class="vk-title">常用标签</div>
          <div class="vk-selectGroup">
              <div v-for="commonTag in commonTags" :key="commonTag.class1Id" :levelClass="commonTag.class1Id">
                  <div class="title">
                      <span :class='commonTag.class1Name'>{{commonTag.class1Name}}</span>
                  </div>
                  <div class="selects">
                      <el-select
                          v-model="format['value'+tag.class2Id]"
                          :ref="tag.class2Id"
                          :placeholder="`请选择${tag.class2Name}`"
                          :loading="asyncLoading"
                          @change="(value) => handleSelectChange(value,tag.class2Id,tag.tagsVos)"
                          v-for="tag in commonTag.class2VOS" 
                          :key="tag.class2Id"
                          :levelClass="commonTag.class1Id"
                      >
                          <el-option
                              v-for="item in tag.tagsVos"
                              :key="item.id"
                              :label="item.tagName"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </div>
              </div>
          </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import api from '@/api/';
import { mapState } from 'vuex';
import mixins from '@/constants/mixins';
import { findIndex, has, set, isEmpty, find } from 'lodash';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

export default {
  mixins: [mixins],
  data() {
    return {
      selectTag: '',
      tagsArr: [],//已选择的标签集合
      asyncLoading: false,/*select远程获取数据时的loading*/
      selectedOptions: [''],/* 级联的v-model类目 */
      searchData: '',/* 搜索关键字 */
      seletctTag: '',/* 常用标签下拉框的v-model */
      commonOptions: [],/* 常用标签的下拉框 */
      results: [],/* 下拉框标签 */
      toggleSlideFlag: true,/* 收起或展开的状态 true为展开，false为收起 */
      format: {},
      bindValue: {
        cityValue: '',/* 当前城市信息 */
        projectValue: '',/* 对应城市项目 */
      },
      cityOptions: [],/* 城市数组 */
      projectOptions: [],/* 对应城市项目数组 */
    }
  },
  props: ['commonTags', 'options', 'exist'],
  created() {
  },
  mounted() {
    this.querySearchAsync();
    this.getCityProjectAct();
  },
  watch: {
        projectDisable(newVal){
        },
        exist(newVal){
            if(isEmpty(newVal)){return}else{
                newVal.map(res => {
                    this.format[`value${res.refCode}`] = parseInt(res.id);
                })
            }
        },
        deleteTagObj(newVal){
            newVal.map(res => {
                // this.$set(this.format,['value'+res.refCode],'')
                this.format['value'+res.refCode] = '';
            })
            
            // this.format['value'+newVal.refCode] = '';
        },
        commonTags(newVal){
            newVal.map(res => {
                res.class2VOS.map((res,index) => {
                    this.$set(this.format,`value${res.class2Id}`,'');
                })
            })
        },
        bindValue: {
            handler(newValue, oldValue) {
                this.$emit('cityPjBind',{newValue})
    　　　   },
    　　　　 deep: true
        },
        immediate:true,//关键
        deep:true
    },
    computed: {
        deleteTagObj(){
            return this.$store.state.home.deleteTagObj
        },
        /* 选择项目禁用 */
        projectDisable(){
            return isEmpty(this.bindValue.cityValue)?true:false
        }
    },
  methods: {
    /* 搜索选中 */
    handleSelect(item) {
      this.selectTag = '';
      let index = this.tagsArr.findIndex(res => res.refCode == item.tagClass2Id);

      this.format[`value${item.tagClass2Id}`] = parseInt(item.id);
      if (index == -1) { } else { this.tagsArr.splice(index, 1); }
      this.searchData = '';
      this.tagsArr.push({
        refCode: item.tagClass2Id,
        id: item.id,
        tagName: item.tagName,
        class1Id: item.tagClass1Id
      });
      this.$emit('categoryData', {
        refCode: item.tagClass2Id,
        id: item.id,
        tagName: item.tagName,
        class1Id: item.tagClass1Id
      })
    },
    /* 城市选择修改 */
    cityChange(val) {
      const { cityOptions } = this;

      this.bindValue.projectValue = '';
      if (isEmpty(val)) {
        //清空
        this.projectOptions = [];
      } else {
        this.bindValue.cityValue = val;
        this.$set(this, 'projectOptions', _.find(cityOptions, { cityName: val }).projectNames)
      }
    },
    /* 城市对应修改 */
    projectChange(val) {
      console.log(val)
    },
    /* 获取标签数据 */
    querySearchAsync() {
      api.getUsedCateSearch({
        tagName: ''
      }).then(res => {
        if (res.success) {
          this.results = res.data;
        } else {
          this.commonAlert(res);
        }
      })
    },
    /* 获取 */
    getCityProjectAct() {
      api.getCityProject({}).then(res => {
        if (res.success) {
          this.cityOptions = res.data;
        } else {
          this.commonAlert(res);
        }
      })
    },
    /* 下拉框值改变的函数 */
    handleSelectChange(value, id, tags) {
      let tagName = '';
      let index = this.tagsArr.findIndex(res => res.refCode == id);

      this.format[`value${id}`] = value;
      tags.filter(res => { if (res.id == value) { tagName = res.tagName } })
      if (index == -1) { } else { this.tagsArr.splice(index, 1); }
      this.tagsArr.push({
        refCode: id,
        id: value,
        tagName,
        class1Id: this.$refs[id][0].$attrs.levelClass
      });
      this.$emit('categoryData', {
        refCode: id,
        id: value,
        tagName,
        class1Id: this.$refs[id][0].$attrs.levelClass
      })
    },
    /* 收起和展开 */
    toggleSlide() {
      this.toggleSlideFlag = !this.toggleSlideFlag
    },
    /* 获取叶子结点 */
    getLeafNode(node) {
      const findNodeLoop = (arr, id) => {
        let index = arr.findIndex(o => o.tagId == id);
        if (index != -1) {
          return arr[index];
        } else {
          return {};
        }
      }
      let options = { children: this.options };
      node.forEach((item, index) => {
        options = findNodeLoop(options.children, item);
      })
      return options;
    },
    /* 级联的change函数，处理数据返回父组件统一格式 */
    handleChange(value) {
      if (has(this.format, 'value' + value[1])) {
        //存在常用标签中则修改
        this.format[`value${value[1]}`] = parseInt(value[2]);
      } else { }

      this.selectedOptions = [''];
      let index = this.tagsArr.findIndex(res => res.refCode == value[1]);

      if (index == -1) { } else { this.tagsArr.splice(index, 1); }

      this.tagsArr.push({
        refCode: value[1],
        id: value[2],
        tagName: this.$refs.cuCascader.currentLabels[2],
        class1Id: value[0]
      });
      this.$emit('categoryData', {
        refCode: value[1],
        id: value[2],
        tagName: this.$refs.cuCascader.currentLabels[2],
        class1Id: value[0]
      })
    },
  }
}
</script>

<style lang="sass">
    .el-cascader-menus{
        /deep/ .el-cascader-menu{
            height: 270px!important;
        }
    }
</style>


<style lang="scss" scoped>
.vk-addTags {
  margin-top: 20px;
  border: 1px solid #dddddd;
  border-radius: 2px;
  width: 100%;
  padding: 20px 30px;
  .vk-inputGroup {
    font-size: 14px;
    color: #333333;
    width: 100%;
    .el-cascader {
      width: 354px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .open {
        color: #409eff;
      }
    }
  }
  .vk-title {
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    width: 70%;
    .open {
      color: #6292ff;
    }
    p {
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;
    }
  }

  .vk-selectGroup {
    margin-top: 20px;
    & > div {
      .title {
        font-size: 14px;
        color: #666666;
        text-align: left;
        display: inline-block;
        width: 12%;
        vertical-align: top;
        line-height: 32px;
      }
      .selects {
        display: inline-block;
        width: 87%;
        .el-select {
          width: 210px;
          margin-right: 16px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
