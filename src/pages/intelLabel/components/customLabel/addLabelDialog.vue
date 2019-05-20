<template>
    <!-- 新增弹框 -->
        <el-dialog 
            width="30%"
            :title="actionType=='new'?'新增自定义标签':actionType=='watch'?'查看自定义标签':'编辑自定义标签'" 
            :visible.sync="currentAddFormVisible" 
            class="vk-tr-dialog"
            @close="closeDialog"
        >
            <el-form :model="selectForm" :name="selectForm" ref="selectForm" :rules="rules" label-width="100px">
                <el-form-item label="标签名称：" prop="tagName" :label-width="formLabelWidth">
                    <el-input v-model="selectForm.tagName" :disabled="input_disable.objO"  placeholder="请输入标签名称"></el-input>
                </el-form-item>
                <el-form-item label="使用范围：" prop="useRange" :label-width="formLabelWidth">
                    <el-radio-group v-model="selectForm.useRange" @change="radioChange">
                        <el-radio :disabled="input_disable.objT" label="公有">公有</el-radio>
                        <el-radio :disabled="input_disable.objTh" label="私有">私有</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标签类别：" prop="tagType" :label-width="formLabelWidth">
                    <el-cascader
                        :disabled="input_disable.objF"
                        expand-trigger="hover"
                        :options="tagOption"
                        :props="cascaderProps"
                        v-model="selectForm.tagType"
                        placeholder="请选择标签类别"
                        @change="casChange"
                        :class="{'tag-type':actionType=='watch'?true:false}"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="业务域：" prop="objectId" :label-width="formLabelWidth">
                    <el-select v-model="selectForm.objectId" :disabled="input_disable.objFi" placeholder="请选择业务域">
                        <el-option
                            v-for="item in selectOption"
                            :key="item.id"
                            :label="item.objectName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签描述：" prop="tagDesc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="selectForm.tagDesc" :disabled="input_disable.objSi" autocomplete="off" placeholder="请输入标签描述，不超过30字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!input_disable.buttonType">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button v-if="actionType=='new'" type="primary" @click="setAction('new')">添 加</el-button>
                <el-button v-else type="primary" @click="setAction('edit')">保 存</el-button>
            </div>
        </el-dialog>
</template>
<script>
import api from '@/api/';
import mixins from '@/constants/mixins';
import { isNull } from 'lodash';

export default {
    mixins: [mixins],
    props: [
        'actionType',
        'editData',
        'addFormVisible',
        'selectOption',
        'tagOption',
        'headCallBack'
    ],
    watch: {
        editData: function(newValue,oldValue){
            const { id, tagName, orgName, objectId, tagDesc, tagClass1Id, tagClass2Id } = newValue;
            
            if(this.actionType=='watch'){
                this.input_disable = Object.assign({}, this.input_disable, {
                    objO: true,objT: true,objTh: true,objF: true,objFi: true,objSi: true,buttonType: true
                })
            }
            this.changeId = id;
            this.selectForm = Object.assign({}, this.selectForm, {
                tagName: tagName,//标签名称
                useRange: orgName,//使用范围
                tagType: [tagClass1Id,tagClass2Id],//标签类型
                objectId: objectId,//业务域id
                tagDesc: tagDesc,//标签描述
            })
        },
        addFormVisible(newVal){
            this.currentAddFormVisible = newVal;
        }
    },
    data(){
        return{
            changeId: '',
            currentAddFormVisible: false,
            formLabelWidth: '120px',
            input_disable: {
                objO: false,
                objT: false,
                objTh: false,
                objF: false,
                objFi: false,
                objSi: false,
                buttonType: false
            },
            cascaderProps: {
                value: 'tagClass',
                children: 'children',
                label: 'tagClassName'
            },
            selectForm: {
                tagName: '',//标签名称
                useRange: '公有',//使用范围
                tagType: [],//标签类型
                objectId: '',//业务域id
                tagDesc: '',//标签描述
            },
            rules: {
                tagName: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' }
                ],
                tagType: [
                    { required: true, message: '请选择标签类别', trigger: 'change' }
                ],
                useRange: [
                    { required: true, message: '请选择使用范围', trigger: 'change' }
                ],
                objectId: [
                    { required: true, message: '请选择业务域', trigger: 'change' }
                ],
                tagDesc: [
                    { required: false, validator: this.descValidate }
                ]
            }
        }
    },
    methods:{
        //通用提醒
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
         //清空form验证状态和数据
        clearForm(){
            this.input_disable = Object.assign({}, this.input_disable, {
                objO: false,objT: false,objTh: false,objF: false,objFi: false,objSi: false,buttonType: false
            })
            this.selectForm = Object.assign({}, this.selectForm, {
                tagName: '',//标签名称
                useRange: '公有',//使用范围
                tagType: [],//标签类型
                objectId: '',//业务域id
                tagDesc: '',//标签描述
            })
            this.$refs.selectForm.clearValidate();
            this.$refs.selectForm.resetFields();
        },
        //新增自定义标签
        addTagAction(objectId,tagClass1Id,tagClass2Id,tagDesc,tagName,tagType,useRange){
            api.tagCustomAdd({
                objectId,
                tagClass1Id,
                tagClass2Id,
                tagDesc,
                tagName,
                tagType,
                useRange
            }).then(res => {
                if(res.success){
                    this.$emit('headCallBack', 'action');
                    this.clearForm();
                }else{}
                this.commonAlert(res);
            })
        },
        //更新标签
        tagUpdate(objectId,tagClass1Id,tagClass2Id,tagDesc,tagName,tagType,useRange){
            api.tagCustomUpdate({
                objectId,
                tagClass1Id,
                tagClass2Id,
                tagDesc,
                tagName,
                tagType,
                useRange
            },this.changeId).then(res => {
                if(res.success){
                    this.$emit('headCallBack', 'action');
                    this.clearForm();
                }else{}
                this.commonAlert(res);
            })
        },
        //radio类目选择切换
        radioChange(val){
            this.$set(this.selectForm,'useRange',val)
        },
        //取消按钮关闭弹窗
        closeDialog(){
            this.$emit('headCallBack', 'clear');
            this.clearForm()
        },
        //联级选择改变
        casChange(value){
            console.log(value)
        },
        //标签名称验证
        nameValidate(rule, value, callback){
            let reg = /^[\u4E00-\u9FA5A-Za-z0-9~!@#$%^&*()_+{}|:"<>?/～！@#¥%……&*（）——+—「」|：“《》？\x22]+$/;
            
            api.judgeTagName({
                tagName: value,
                tagType: 3,
                id:this.actionType=='new'?'':this.editData.id
            }).then(res => {
                if(res.data){
                    callback(new Error('标签名称不可重名'));
                }else{
                    if(!reg.test(value)){
                        callback(new Error('名称由中文、英文、数字或常用符号组成'));
                    }else if(value.length == 0){
                        callback(new Error('请输入标签名称'));
                    }else if(value.length > 10){
                        callback(new Error('标签名称不超过10位'));
                    }else{
                        callback();
                    }
                }
            })
        },
        //标签描述
        descValidate(rule, value, callback){
            if(isNull(value)){
                callback()
            }else if (value.length > 30) {
                callback('描述信息不超过30字')
            } else {
                callback()
            }
        },
        //新增或编辑方法
        setAction(type){
            this.$refs['selectForm'].validate((valid) => {
                const { changeId } = this;
                const { tagName, tagType, objectId, tagDesc, orgName, useRange } = this.selectForm;
                const usage = useRange=='公有'?0:1;
                
                if (valid) {
                    if(type == 'new'){
                        //新增自定义标签
                        this.addTagAction(objectId,tagType[0],tagType[1],tagDesc,tagName,3,usage);
                    }else{
                        //编辑自定义标签
                        this.tagUpdate(objectId,tagType[0],tagType[1],tagDesc,tagName,3,usage);
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .tag-type{
        .el-cascader__label{
            span{
                color:#e5dcdc !important;
            }
        }
    }
</style>
