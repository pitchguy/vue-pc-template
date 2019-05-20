<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :width="width"
    @update:visible="handleDialogCancel">
    <el-form :model="parameterForm" :rules="parameterRules" ref="parameterForm" label-width="150px" style="width: 450px">
      <el-form-item label="发布参数名称" prop="name1">
        <el-input v-model="parameterForm.name1"></el-input>
      </el-form-item>
      <el-form-item label="接入参数名称" prop="name2">
        <el-input v-model="parameterForm.name2"></el-input>
      </el-form-item>
      <el-form-item label="参数类型" prop="paramType">
        <el-select class="form-input" v-model="parameterForm.paramType" placeholder="请选择活动区域">
          <el-option
          v-for="type in paramTypeList"
          :key="type.label"
          :label="type.label"
          :value="type.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="映射方式" prop="mapType">
        <el-select class="form-input" v-model="parameterForm.mapType" placeholder="请选择活动区域">
          <el-option
            v-for="type in mapTypeList"
            :key="type.label"
            :label="type.label"
            :value="type.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可选" prop="select">
        <el-select class="form-input" v-model="parameterForm.select" placeholder="请选择活动区域">
          <el-option
            v-for="type in selectList"
            :key="type.label"
            :label="type.label"
            :value="type.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扩展类型" prop="exactType">
        <el-select class="form-input" v-model="parameterForm.exactType" placeholder="请选择活动区域">
          <el-option
            v-for="type in exactTypeList"
            :key="type.label"
            :label="type.label"
            :value="type.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传递方式" prop="transferType">
        <el-select class="form-input" v-model="parameterForm.transferType" placeholder="请选择活动区域">
          <el-option
            v-for="type in transferTypeList"
            :key="type.label"
            :label="type.label"
            :value="type.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认值：" class="form-item">
        <el-input class="form-input" v-model="parameterForm.defaultValue" placeholder="请输入默认值"></el-input>
      </el-form-item>
      <el-form-item label="示例值：" class="form-item">
        <el-input class="form-input" v-model="parameterForm.exampleValue" placeholder="请输入示例值"></el-input>
      </el-form-item>
      <el-form-item label="参数描述：" class="form-item">
        <el-input class="form-input" type="textarea" v-model="parameterForm.description" placeholder="请输入参数描述"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
      <el-button @click="handleDialogCancel">取 消</el-button>
      <el-button native-type="submit" type="primary" @click="handleConfirm">保 存</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script>
    export default {
      props:{
        parameterInfo:Object,
        title:String,
        visible:Boolean,
        width:{
          type:String,
          default:'900px'
        }
      },
      watch:{
        parameterInfo(value){
          this.parameterForm = value;
        }
      },
      data(){
        return{
          parameterForm:{},
          parameterRules:{
            name1:[{required: true, message: '请输入发布参数名称', trigger: 'blur'}],
            name2:[{required: true, message: '请输入接入参数名称', trigger: 'blur'}],
            paramType:[{required: true, message: '请选择参数类型', trigger: 'change'}],
            mapType:[{required: true, message: '请选择映射方式', trigger: 'change'}],
            select:[{required: true, message: '请选择是否可选', trigger: 'change'}],
            exactType:[{required: true, message: '请选择扩展类型', trigger: 'change'}],
            transferType:[{required: true, message: '请选择传递方式', trigger: 'change'}],
          },
          paramTypeList:[
            {
              value:1,
              label:'java.lang.String',
            },
            {
              value:2,
              label:'java.lang.Boolean',
            },
            {
              value:3,
              label:'java.lang.Double',
            },
            {
              value:4,
              label:'java.lang.Float',
            },
            {
              value:5,
              label:'java.lang.Long',
            },
            {
              value:6,
              label:'java.lang.Integer',
            },
            {
              value:7,
              label:'java.lang.Short',
            },
            {
              value:8,
              label:'java.lang.Byte',
            },
          ],
          mapTypeList:[
            {
              value:1,
              label:'平台参数',
            },
            {
              value:2,
              label:'API参数',
            },
            {
              value:3,
              label:'不可见',
            }
          ],
          selectList:[
            {
              value:1,
              label:'是',
            },
            {
              value:2,
              label:'否'
            }
          ],
          exactTypeList:[
            {
              value:1,
              label:'正常'
            },
            {
              value:2,
              label:'数组'
            },
            {
              value:3,
              label:'列表'
            },
            {
              value:4,
              label:'集合set'
            },
          ],
          transferTypeList:[
            {
              value:1,
              label:'GET'
            },
            {
              value:2,
              label:'POST'
            }
          ],
        }
      },
      methods:{
        handleDialogCancel(){
          this.$emit('update:visible');
        },
        handleConfirm(e){
          if(e){
            e.preventDefault();
          }
          this.$refs.parameterForm.validate(valid=>{
            if(valid){
              this.$emit('save',this.parameterForm);
            }
          });
        },
        reset(){
          this.$refs.parameterForm.resetFields();
        }
      }
    }
</script>

<style scoped lang="scss">
  .form-item{
    text-align: left;
    width: 367px;
  }
  .form-input{
    width: 300px;
  }
</style>
