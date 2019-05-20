<template>
    <div class="vk-atom-add-ct">
        <div class="top-floor">
            <img 
                :src="backIcon" 
                alt="返回icon" 
                @click="() => this.$router.go(-1)"
                style="position:relative;width:17px;height:17px;top:3px;cursor:pointer;"
             />
            <span>{{page_title}}</span>
        </div>
        <div class="middle-floor">
            <div>
                <el-select 
                    v-model="custom_data" 
                    placeholder="请选择客户域"
                    @change="selectChange"
                >
                    <el-option
                        v-for="(item,index) in custom_data_option"
                        :key="item.objectTable+index"
                        :label="item.objectName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input
                    class="search"
                    row-key="key"
                    clearable
                    placeholder="输列名搜索"
                    v-model="search_input"
                    @change="inputChange"
                    @keyup.enter.native="inputSubmit"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
            </div>
            <div class="fl-t-c">
                <el-tabs 
                    v-model="activeName" 
                    type="card" 
                    :style="{'width': isNormal||isDetail?'60%':'100%'}"
                    @tab-click="tabClick" 
                >
                    <el-tab-pane>
                        <span slot="label">未绑定({{unbind_total}})</span>
                        <unbind-table 
                            ref="unbindTable"
                            @unBindTotalReturn="unBindTotalReturn"
                            @bindReturn="bindReturn" 
                            :custom_data="custom_data" 
                        />
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">绑定({{bind_total}})</span>
                        <bind-table 
                            ref="bindTable"
                            @bindTotalReturn="bindTotalReturn" 
                            @bindReturn="bindReturn" 
                            :custom_data="custom_data" 
                        />
                    </el-tab-pane>
                </el-tabs>
                <!-- 新增右侧列表 -->
                <div v-show="isNormal" class="add-ct" :style="normalStyle.style2">
                    <p class="title">填写标签信息</p>
                    <el-form :model="selectForm" ref="selectForm" :rules="rules" label-width="100px">
                        <el-form-item label="来源表：" prop="tagSurface" :label-width="formLabelWidth">
                            <span>{{selectForm.sourceTable}}</span>
                        </el-form-item> 
                        <el-form-item label="来源字段：" prop="tagName" :label-width="formLabelWidth">
                            <span>{{selectForm.sourceTableColumn}}</span>
                        </el-form-item> 
                        <el-form-item label="标签名称：" prop="name" :label-width="formLabelWidth">
                            <el-input v-model="selectForm.name" placeholder="请输入标签名称"></el-input>
                        </el-form-item> 
                        <el-form-item label="标签code：" prop="code" :label-width="formLabelWidth">
                            <el-input v-model="selectForm.code" placeholder="请输入标签code"></el-input>
                        </el-form-item> 
                        <el-form-item label="标签类别：" prop="type" :label-width="formLabelWidth">
                            <el-cascader
                                expand-trigger="hover"
                                :options="tagOption"
                                :props="cascaderProps"
                                v-model="selectForm.type"
                                placeholder="请选择标签类别"
                                @change="tagTypeChange"
                            />
                        </el-form-item> 
                        <el-form-item label="请输入标签描述" prop="desc" :label-width="formLabelWidth">
                            <el-input type="textarea" v-model="selectForm.desc" autocomplete="off" placeholder="请输入标签描述，不超过30字"></el-input>
                        </el-form-item>
                        <el-form-item v-if="ifDict" label="字典值：" prop="dictValue" :label-width="formLabelWidth">
                            <el-select v-model="selectForm.dictValue" placeholder="请选择">
                                <el-option
                                    v-for="(item,index) in dictValues"
                                    :key="index"
                                    :label="item.dictName"
                                    :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计算："  prop="calc">
                            <el-switch
                                :disabled="ifCalcu"
                                v-model="selectForm.calc"
                                @change="calcuSwitch"
                            >
                            </el-switch>
                            <el-tooltip placement="right">
                                <div slot="content">可以通过开启/关闭计算来控制是否给<br/>客户打上原子标签哦</div>
                                <i style="font-size: 18px;position: relative;left: 10px;top: 3px;" class="el-icon-question" />
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                    <div 
                        slot="footer"
                        class="add-ct-footer"
                    >
                        <el-button @click="clearDiv">取 消</el-button>
                        <el-button class="common-button" :loading="saveButtonLoad" type="primary" @click="saveButton">保 存</el-button>
                    </div>
                </div>
                <!-- 查看右侧列表 -->
                <div 
                    v-show="isDetail" 
                    class="add-ct" 
                    :style="normalStyle.style2" 
                    v-loading="detail_loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 1)"
                >
                    <p class="title">标签详情</p>
                    <el-form :model="detailForm" ref="detailForm" label-width="100px">
                        <el-form-item label="标签名称：" :label-width="formLabelWidth">
                            <span>{{detailForm.tagName}}</span>
                        </el-form-item>
                        <el-form-item label="标签Code：" :label-width="formLabelWidth">
                            <span>{{detailForm.tagCode}}</span>
                        </el-form-item> 
                        <el-form-item label="标签类别：" :label-width="formLabelWidth">
                            <span>{{`${detailForm.tagClass1Name}-${detailForm.tagClass2Name}`}}</span>
                        </el-form-item> 
                        <el-form-item label="标签描述：" :label-width="formLabelWidth">
                            <span>{{detailForm.tagDesc}}</span>
                        </el-form-item> 
                        <el-form-item label="字典值：" :label-width="formLabelWidth">
                            <span>{{detailForm.dictName}}</span>
                        </el-form-item> 
                        <el-form-item label="来源表：" :label-width="formLabelWidth">
                            <span>{{detailForm.sourceTable}}</span>
                        </el-form-item> 
                        <el-form-item label="来源字段：" :label-width="formLabelWidth">
                            <span>{{detailForm.sourceTableColumn}}</span>
                        </el-form-item> 
                        <el-form-item label="计算：" :label-width="formLabelWidth">
                            <el-switch v-model="detailForm.calc">
                            </el-switch>
                        </el-form-item> 
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/';
import mixins from '@/constants/mixins';
import { includes } from 'lodash';
import backIcon from '@public/assets/imgs/back.png';
import BindTable from './components/bindTable';
import UnbindTable from './components/unBindTable';

export default {
    mixins: [mixins],
    components: {
        "bind-table": BindTable,
        "unbind-table": UnbindTable
    },
    data(){
        return{
            backIcon,
            ifDict: true,
            ifCalcu: false,
            formLabelWidth: '140px',
            page_title: '新增原子标签',
            detail_loading: false,//右侧详细列表loading
            activeName: '',//切换绑定未绑定
            custom_data: '',//客户域选择值
            custom_data_option: [],//客户域option
            search_input: '',//客户域列搜索
            saveButtonLoad: false,//保存按钮loading
            actionType: '',//绑定&查看的标签状态
            bind_data: [],//绑定表数据
            bind_total: '',//绑定表总数
            unbind_data: [],//未绑定数据
            unbind_total: '',//未绑定表总数
            dictValues: [],//字典值数组
            tagOption: [],//类目树
            cascaderProps: {//类目树class集
                value: 'tagClass',
                children: 'children',
                label: 'tagClassName'
            },
            normalStyle: {//没激活情况下的class集合
                style1: {
                    width: '60%',
                },
                style2: {
                    width: '35%'
                }
            },
            selectForm: {
                sourceTable: '',//来源表
                sourceTableColumn: '',//来源字段
                columnName: '',//列
                tagSurface: '',
                tagName: '',
                name: '',
                code: '',
                type: [],
                desc: '',
                dictValue: '',
                calc: false
            },//标签信息
            detailForm: {
                calc: false,
                colunmName: "",
                dictName: "",
                dictValue: "",
                sourceTable: "",
                sourceTableColumn: "",
                tagClass1Id: "",
                tagClass1Name: "",
                tagClass2Id: "",
                tagClass2Name: "",
                tagCode: "",
                tagDesc: "",
                tagName: "",
                type: 1
            },
            rules: {
                name: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' }
                ],
                // code: [
                //     { required: true, validator: this.codeValidate, trigger: 'blur' }
                // ],
                type: [
                    { required: true, message: '请选择标签类别', trigger: 'change'}
                ],
                desc: [
                    { required: false, min: 0, max: 30, message: '描述长度在 0 到 30 个文字', trigger: 'blur' },
                ]
            }
        }
    },
    mounted(){
        this.getTagObject();//获取客户域
        this.getTagTypeTree();//获取类目树
    },
    computed: {
        isNormal(){
            return this.actionType=='new'?true:false
        },
        isDetail(){
            return this.actionType=='watch'?true:false
        }
    },
    methods: {
        clearFrom(){
            this.$refs.selectForm.clearValidate();
            this.$refs.selectForm.resetFields();
        },
        /* 获取客户域 */
        getTagObject(){
            api.tagObject({}).then(res => {
                if(res.success){
                    this.custom_data = res.data[0].id;
                    this.custom_data_option = res.data;
                }else{
                    this.commonAlert(res);
                }

            })
        },
        //获取类目树
        getTagTypeTree(){
            api.tagTypeTree({}).then(res => {
                if(res.success){
                    let checkArr = res.data.filter(item => item.children!=null)
                    this.tagOption = checkArr;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        /* 新增原子标签(未绑定) */
        atomTagAddNewAction(calc,columnName,dictValue,objectId,tagClass1Id,tagClass2Id,tagCode,tagDesc,tagName){
            api.atomTagAddNew({
                calc,columnName,dictValue,
                objectId,tagClass1Id,tagClass2Id,
                tagCode,tagDesc,tagName
            }).then(res => {
                const { custom_data } = this;

                if(res.success){
                    this.actionType = '';
                    this.clearFrom();
                    this.$refs.unbindTable.getAtomTagListUnBind(custom_data);
                }else{}
                
                this.commonAlert(res)
            })
        },
        /* 获取原子标签详情(已经绑定) */
        getAtomTagWatch(id){
           this.detail_loading = true;
            api.atomTagWatch({},id).then(res => {
                if(res.success){
                    this.detailForm = Object.assign({}, this.detailForm, res.data)
                    this.detail_loading = false;
                }else{
                    this.commonAlert(res);
                }
            })
        },
        /* 客户域选择 */
        selectChange(val){
            this.custom_data = val;
        },
        /* 列搜索改变值 */
        inputChange(val){
            this.search_input = val;
        },
        /* 列搜索 */
        inputSubmit(e){
            const { search_input, activeName, bind_data, unbind_data, custom_data } = this;

            if(activeName==0){
                //未绑定
                if(search_input==''){
                    this.$refs.unbindTable.getAtomTagListUnBind(custom_data);
                }else{
                    const filterResult = unbind_data.filter(res => {
                        if(_.includes(res.columnName,search_input.toLocaleUpperCase())){
                            return res
                        }
                    })
                    this.$refs.unbindTable.bind_table = filterResult;
                }
                
            }else{
                //已绑定
                const filterResult = bind_data.filter(res => {
                    if(_.includes(res.columnName,search_input.toLocaleUpperCase())){
                        return res
                    }
                })
                this.$refs.bindTable.bind_table = filterResult;
            }
            // const { casValue, search_input, currentPage, pageSize } = this;
            
            // this.currentPage = 1;
            // this.tagByCategory(casValue[0],casValue[1],1,pageSize,2,search_input,1);
        },
        /* 表格切换 */
        tabClick(val){
            const { custom_data } = this;
            if(val.index=='0'){
                this.$refs.unbindTable.getAtomTagListUnBind(custom_data)
            }else if(val.index=='1'){
                this.$refs.bindTable.getAtomTagListBind(custom_data);
            }

        },
        /* 标签类别更改 */
        tagTypeChange(){

        },
        /* 是否计算改变 */
        calcuSwitch(val){
            this.selectForm.calc = val;
        },
        /* 标签名称验证 */
        nameValidate(rule, value, callback){
            const { actionType } = this;
            let reg = /^[\u4E00-\u9FA5A-Za-z0-9~!@#$%^&*()_+{}|:"<>?/～！@#¥%……&*（）——+—「」|：“《》？\x22]+$/;

            api.judgeTagName({
                tagName: value,
                tagType: 1,
                id: actionType=='new'?'':''
            }).then(res => {
                if(res.data){
                    callback(new Error('标签名称不可重名'));
                }else{
                    if(!reg.test(value)){
                        callback('名称由中文、英文、数字或常用符号组成');
                    }else if(value.length > 10){
                        callback(new Error('标签名称不超过10位'));
                    }else if(value.length == 0){
                        callback(new Error('请输入标签名称'));
                    }else{
                        callback();
                    }
                }
            })
        },
        /* code验证 */
        codeValidate(rule, value, callback){
            let reg = /^[a-z_]+$/;

            if(!reg.test(value)){
                callback(new Error('标签code可由小写英文或下划线组成'));
            }else if(value.length > 16){
                callback(new Error('标签code不超过16位'));
            }else if(value.length == 0){
                callback(new Error('请输入标签code'));
            }else{
                callback();
            }
        },
        /* 取消信息框 */
        clearDiv(){
            this.actionType = '';
        },
        /* 保存按钮 */
        saveButton(){
            this.$refs.selectForm.validate((valid) => {
                if(valid){
                    const { custom_data } = this;//客户域ID
                    const { sourceTable,sourceTableColumn,columnName,tagSurface,tagName,name,code,type,dictValue,calc,desc } = this.selectForm;

                    console.log(this.selectForm)
                    this.atomTagAddNewAction(calc,columnName,dictValue,custom_data,type[0],type[1],code,desc,name);
                }else{
                    this.$message.info('验证异常')
                    return false;
                }
            })
        },
        /* 绑定列表操作回调 */
        bindReturn(val){
            this.clearFrom();
            this.actionType = val.action;
            this.ifCalcu = val.source.type==1?false:true;
            this.ifDict = val.source.type==1?true:false;
            this.selectForm.calc = val.source.type==1?true:false;

            if(val.action=='new'){
                console.log(val.source)
                this.dictValues = val.source.dictValues;
                this.selectForm.columnName = val.source.columnName;
                this.selectForm.sourceTable = val.source.sourceTable;
                this.selectForm.sourceTableColumn = val.source.sourceTableColumn;
            }else if(val.action=='watch'){
                this.getAtomTagWatch(val.source.tagId)
            }
            
        },
        /*绑定表total */
        bindTotalReturn(val){
            this.bind_data = val;
            this.bind_total = val.length;
        },
        /*未绑定表total */
        unBindTotalReturn(val){
            this.unbind_data = val;
            this.unbind_total = val.length
        },
    }
}
</script>
<style lang="scss" scoped>
    .vk-atom-add-ct{
        height: 100%;
        padding: 20px;
        .top-floor{
            padding-bottom: 20px;
        }
        .middle-floor{
            background-color: #FFF;
            padding: 20px 30px;
            .el-select,.search{
                width: 220px;
            }
            .search,.el-button{
                margin-left: 20px;
            }
            .fl-t-c{
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                .el-tabs{
                    border: 1px solid #DDDDDD;
                }
                .add-ct{
                    margin-left: 20px;
                    border: 1px solid #DDDDDD;
                    .title{
                        font-size: 14px;
                        color: #333333;
                        padding: 11px;
                        background: #F7F7F7;
                    }
                    .el-input,.el-select,.el-textarea{
                        width: 80%;
                    }
                    .add-ct-footer{
                        float: right;
                        padding: 50px 30px 20px 0;
                        .el-button{
                            width: 80px;
                            height: 30px;
                        }
                    }
                }
            }
        }
    }
</style>