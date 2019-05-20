<template>
  <div class="second-step">
    <el-form
      :model="detailInfoForm"
      ref="detailInfoForm"
      :rules="detailInfoRules"
      :inline="true"
      label-width="120px"
      label-position="top">
      <el-form-item prop="publicAPI" class="form-item">
        <span slot="label"> 是否为公共API
          <el-tooltip class="item" effect="dark" content="订阅公共API不需要审批，用户订阅之后即可调用" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
        <el-select class="form-input" v-model="detailInfoForm.publicAPI" placeholder="请选择是否为公共API">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内外部API" prop="exAPI" class="form-item">
        <el-select class="form-input" v-model="detailInfoForm.exAPI" placeholder="请选择内外部API">
          <el-option label="外部" value="1"></el-option>
          <el-option label="内部" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调用费用" prop="callCost" class="form-item">
        <el-input class="form-input" v-model="detailInfoForm.callCost"  placeholder="请输入调用费用"></el-input>
        元/次
      </el-form-item>
      <el-form-item label="调用限制" prop="callLimit" class="form-item">
        <el-input class="form-input" v-model="detailInfoForm.callLimit"  placeholder="请输入调用限制次数">次/秒</el-input>
      </el-form-item>
      <el-form-item label="接入协议类型" prop="protocolType" class="form-item">
        <span slot="label"> 接入协议类型
          <el-tooltip class="item" effect="dark" content="默认消费协议为Restful和WebService，并启用SSL" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
        <el-select class="form-input" v-model="detailInfoForm.protocolType" placeholder="请选择接入协议类型">
          <el-option label="Restful" value="1"></el-option>
          <el-option label="WebService" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务接口地址" prop="APIAddress" class="form-item">
        <el-input class="form-input" v-model="detailInfoForm.APIAddress"  placeholder="请输入服务接口地址"></el-input>
      </el-form-item>
      <div v-if="detailInfoForm.protocolType==0">
        <el-form-item label="命名空间" prop="namespace" class="form-item">
          <el-input class="form-input" v-model="detailInfoForm.namespace"  placeholder="请输入命名空间"></el-input>
        </el-form-item>
        <el-form-item label="WebService服务名称" prop="serveNames" class="form-item">
          <el-input class="form-input" v-model="detailInfoForm.serveNames"  placeholder="请输入WebService服务名称"></el-input>
        </el-form-item>
        <el-form-item label="绑定名称" prop="bindName" class="form-item">
          <el-input class="form-input" v-model="detailInfoForm.bindName"  placeholder="请输入绑定名称"></el-input>
        </el-form-item>
        <el-form-item label="端口名称" prop="portName" class="form-item">
          <el-input class="form-input" v-model="detailInfoForm.portName"  placeholder="请输入端口名称"></el-input>
        </el-form-item>
        <el-form-item label="方法名称" prop="methodName" class="form-item" style="width: 615px">
          <el-input class="form-input" v-model="detailInfoForm.methodName"  placeholder="请输入方法名称"></el-input>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="方法类型" prop="methodType" class="form-item">
          <el-select class="form-input" v-model="detailInfoForm.methodType" placeholder="请选择方法类型">
            <el-option label="POST" value="1"></el-option>
            <el-option label="GET" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求格式" prop="requestType" class="form-item">
          <el-select class="form-input" v-model="detailInfoForm.requestType" placeholder="请选择请求格式">
            <el-option label="POST" value="1"></el-option>
            <el-option label="GET" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="传递方式" prop="transferType" class="form-item">
          <el-select class="form-input" v-model="detailInfoForm.transferType" placeholder="请选择传递方式">
            <el-option label="POST" value="1"></el-option>
            <el-option label="GET" value="0"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item prop="importParameter" style="width: 1000px">
        <span slot-="label"> 入参参数 &nbsp;
          <a href="javascript:void(0)" @click="importParameterVisible=!importParameterVisible">
            <i v-if="importParameterVisible" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </a>
        </span>
        <el-collapse-transition>
          <div v-show="importParameterVisible">
            <boe-table
              :border="true"
              :data="detailInfoForm.importParameter"
              :columns="importParameterColumns"/>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item prop="exportParameter" style="width: 1000px">
        <span slot="label"> 出参参数 &nbsp;
          <a href="javascript:void(0)" @click="exportParameterVisible=!exportParameterVisible">
            <i v-if="exportParameterVisible" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </a>
        </span>
        <el-collapse-transition>
          <div v-show="exportParameterVisible">
            <boe-table
              :border="true"
              :data="detailInfoForm.exportParameter"
              :columns="exportParameterColumns"/>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item prop="normalReturnCase" style="width: 1000px">
        <span slot="label"> 正常返回事例 &nbsp;
          <a href="javascript:void(0)" @click="normalReturnCaseVisible=!normalReturnCaseVisible">
            <i v-if="normalReturnCaseVisible" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </a>
        </span>
        <el-collapse-transition>
          <div v-show="normalReturnCaseVisible">
            <el-input v-model="detailInfoForm.normalReturnCase"  type="textarea" rows="10" ></el-input>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item prop="errorReference" style="width: 1000px">
        <span slot="label"> 错误参考 &nbsp;
          <a href="javascript:void(0)" @click="errorReferenceVisible=!errorReferenceVisible">
            <i v-if="errorReferenceVisible" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </a>
        </span>
        <el-collapse-transition>
          <div v-show="errorReferenceVisible">
            <el-input v-model="detailInfoForm.errorReference" type="textarea" rows="10" ></el-input>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item prop="errorCodeDescription"  style="width: 1000px">
        <span slot="label"> 错误码描述 &nbsp;
          <a href="javascript:void(0)" @click="errorCodeDescriptionVisible=!errorCodeDescriptionVisible">
            <i v-if="errorCodeDescriptionVisible" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </a>
        </span>
        <el-collapse-transition>
          <div v-show="errorCodeDescriptionVisible">
            <boe-table
              :border="true"
              :data="detailInfoForm.errorCodeDescription"
              :columns="errorColumns"/>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item>
        <el-button @click="prevStep">上一步</el-button>
        <el-button native-type="submit" @click="detailInfoSubmit" type="primary">提交</el-button>
      </el-form-item>
    </el-form>

    <parameter-dialog
      :parameterInfo="rowInfo"
      :title="title"
      :visible.sync="ParameterVisible"
      :width="width"
      @save="updateParameter"/>
    <error-dialog
      :errorInfo="rowInfo"
      :title="errorTitle"
      :visible.sync="errorVisible"
      :width="width"
      @save="updateErrorCode"/>
  </div>
</template>

<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import BoeTable from '@/components/boeTb';
  import ParameterDialog from './parameterDialog';
  import ErrorDialog from './errorCodeDialog';
    export default {
      components:{
        'el-collapse-transition':CollapseTransition,
        'boe-table':BoeTable,
        'parameter-dialog':ParameterDialog,
        'error-dialog':ErrorDialog,
      },
      watch:{
        detailInfoForm:{
          importParameter(value){
            console.log(value);
          }
        }
      },
        data(){
          return {
            detailInfoForm:{
              publicAPI:'',
              exAPI:'',
              callCost:'',
              callLimit:'',
              protocolType:'',
              APIAddress:'',
              //Restful协议参数
              methodType:'',
              requestType:'',
              transferType:'',
              //WebService协议参数
              namespace:'',
              serveNames:'',
              bindName:'',
              portName:'',
              methodName:'',
              //入参参数
              importParameter:[
                {
                  name1:'arg0',
                  name2:'arg0',
                  paramType:'java.lang.String',
                  mapType:'API参数',
                  select:'是',
                  exactType:'正常',
                  transferType:'GET',
                  defaultValue:'',
                  exampleValue:'',
                  description:'',
                },
              ],

              //出参参数
              exportParameter:[
                {
                  name1:'arg0',
                  name2:'arg0',
                  paramType:'java.lang.String',
                  mapType:'API参数',
                  select:'是',
                  exactType:'正常',
                  transferType:'GET',
                  defaultValue:'',
                  exampleValue:'',
                  description:'',
                }
              ],
              normalReturnCase:'',
              errorReference:'',
              errorCodeDescription:[
                {
                  code:'',
                  description:'',
                  suggestion:'',
                },
              ]
            },
            detailInfoRules:{
              publicAPI:[{required: true, message: '请选择是否为公共API', trigger: 'change'}],
              exAPI:[{required: true, message: '请选择内外部API', trigger: 'change'}],
              // callCost:[{required: true, message: '请输入调用费用', trigger: 'change'}],
              callLimit:[{required: true, message: '请输入调用限制次数', trigger: 'change'}],
              protocolType:[{required: true, message: '请选择接入协议类型', trigger: 'change'}],
              APIAddress:[{required: true, message: '请输入服务接口地址', trigger: 'change'}],
              methodType:[{required: true, message: '请选择方法类型', trigger: 'change'}],
              requestType:[{required: true, message: '请选择请求格式', trigger: 'change'}],
              transferType:[{required: true, message: '请选择传递方式', trigger: 'change'}],
              namespace:[{required: true, message: '请输入命名空间', trigger: 'change'}],
              serveNames:[{required: true, message: '请输入WebService服务名称', trigger: 'change'}],
              bindName:[{required: true, message: '请输入绑定名称', trigger: 'change'}],
              portName:[{required: true, message: '请输入端口名称', trigger: 'change'}],
              methodName:[{required: true, message: '请输入方法名称', trigger: 'change'}],

              //importParameter:[{required: true, message: '请输入入参参数', trigger: 'change'}],
              //exportParameter:[{required: true, message: '请输入入参参数', trigger: 'change'}],
              normalReturnCase:[{required: true, message: '请输入正常返回事例', trigger: 'change'}],
              errorReference:[{required: true, message: '请输入错误参考', trigger: 'change'}],

            },
            importParameterColumns:[
              {
                key:'name1',
                prop:'name1',
                label:'发布入参数名'
              },
              {
                key:'name2',
                prop:'name2',
                label:'接入入参数名'
              },
              {
                key:'paramType',
                prop:'paramType',
                label:'参数类型'
              },
              {
                key:'mapType',
                prop:'mapType',
                label:'映射方式'
              },
              {
                key:'select',
                prop:'select',
                label:'可选'
              },
              {
                key:'exactType',
                prop:'exactType',
                label:'扩展类型'
              },
              {
                key:'transferType',
                prop:'transferType',
                label:'传递方式'
              },
              {
                key:'defaultValue',
                prop:'defaultValue',
                label:'默认值'
              },
              {
                key:'exampleValue',
                prop:'exampleValue',
                label:'示例值'
              },
              {
                key:'description',
                prop:'description',
                label:'参数描述'
              },
              {
                key:'actions',
                prop:'actions',
                label:'操作',
                width:160,
                actions:[
                  {
                    label:'编辑',
                    handler:(row,index)=>{
                      this.rowInfo = row;
                      this.editIndex = index;
                      this.flag=1;
                      this.ParameterVisible = true;
                    }
                  },
                  {
                    label:'删除',
                    handler:(row,index)=>{
                      this.deleteTheRow(index,row,1);
                    }
                  },
                  {
                    label:'添加',
                    handler:(row,index)=>{
                      this.addARow(index,row,1);
                    }
                  }
                ]
              },
            ],
            exportParameterColumns:[
              {
                key:'name1',
                prop:'name1',
                label:'发布入参数名'
              },
              {
                key:'name2',
                prop:'name2',
                label:'接入入参数名'
              },
              {
                key:'paramType',
                prop:'paramType',
                label:'参数类型'
              },
              {
                key:'mapType',
                prop:'mapType',
                label:'映射方式'
              },
              {
                key:'select',
                prop:'select',
                label:'可选'
              },
              {
                key:'exactType',
                prop:'exactType',
                label:'扩展类型'
              },
              {
                key:'transferType',
                prop:'transferType',
                label:'传递方式'
              },
              {
                key:'defaultValue',
                prop:'defaultValue',
                label:'默认值'
              },
              {
                key:'exampleValue',
                prop:'exampleValue',
                label:'示例值'
              },
              {
                key:'description',
                prop:'description',
                label:'参数描述'
              },
              {
                key:'actions',
                prop:'actions',
                label:'操作',
                width:160,
                actions:[
                  {
                    label:'编辑',
                    handler:(row,index)=>{
                      this.rowInfo = row;
                      this.editIndex = index;
                      this.flag=2;
                      this.ParameterVisible = true;
                    }
                  },
                  {
                    label:'删除',
                    handler:(row,index)=>{
                      this.deleteTheRow(index,row,2);
                    }
                  },
                  {
                    label:'添加',
                    handler:(row,index)=>{
                      this.addARow(index,row,2);
                    }
                  }
                ]
              },
            ],
            errorColumns:[
              {
                key:'index',
                prop:'index',
                label:'#',
                width:'50px',
                formatter:(row,column,cellValue,index)=>index+1
              },
              {
                key:'code',
                prop:'code',
                label:'错误代码',
              },
              {
                key:'description',
                prop:'description',
                label:'错误说明',
              },
              {
                key:'suggestion',
                prop:'suggestion',
                label:'处置建议',
              },
              {
                key:'actions',
                prop:'actions',
                label:'操作',
                actions:[
                  {
                    label:'编辑',
                    handler:(row,index)=>{
                      this.rowInfo = row;
                      this.editIndex = index;
                      this.flag=3;
                      this.errorVisible = true;
                    }
                  },
                  {
                    label:'删除',
                    handler:(row,index)=>{
                      this.deleteTheRow(index,row,3);
                    }
                  },
                  {
                    label:'添加',
                    handler:(row,index)=>{
                      this.addARow(index,row,3);
                    }
                  }
                ]
              },
            ],
            errorTitle:'错误代码',
            title:'参数信息',
            editIndex:-1,
            rowInfo:{},
            width:'560px',
            flag:-1,
            errorVisible:false,
            ParameterVisible:false,
            importParameterVisible:true,
            exportParameterVisible:true,
            normalReturnCaseVisible:true,
            errorReferenceVisible:true,
            errorCodeDescriptionVisible:true,
          }
        },

      methods:{
        //下一步、提交
        detailInfoSubmit(e){
          e.preventDefault();
          this.$emit('detailInfoSubmit',this.detailInfoForm);
        },
        //上一步
        prevStep(){
          this.$emit('prevStep');
        },
        //添加一行
        addARow(index, row ,flag){
          const temp={
            name1:'arg0',
            name2:'arg0',
            paramType:'java.lang.String',
            mapType:'API参数',
            select:'是',
            exactType:'正常',
            transferType:'GET',
            defaultValue:'',
            exampleValue:'',
            description:'',
          };
          this.detailInfoForm[flag===1?'importParameter':flag===2?'exportParameter':'errorCodeDescription'].splice(index+1,0,flag===3?{
            code:'',
            description:'',
            suggestion:'',
          }:temp);
        },
        //删除一行
        deleteTheRow(index, row , flag){
          this.detailInfoForm[flag===1?'importParameter':flag===2?'exportParameter':'errorCodeDescription'].splice(index,1);
        },
        //关闭窗口
        closeDialog(){
          this.ParameterVisible = false;
          this.errorVisible = false;
          this.editIndex = -1;
          this.rowInfo = {}
        },
        //保存修改
        updateParameter(value){
          this.detailInfoForm.importParameter[this.editIndex] = value;
          this.closeDialog();
        },
        updateErrorCode(value){
          this.detailInfoForm.errorCodeDescription[this.editIndex] = value;
          this.closeDialog();
        }
      }
    }
</script>

<style scoped>
  .second-step{
    width: 1100px;;
    margin: 30px auto;
  }
  .form-item{
    text-align: left;
    width: 300px;
  }
  .form-input{
    width: 200px;
  }
</style>
