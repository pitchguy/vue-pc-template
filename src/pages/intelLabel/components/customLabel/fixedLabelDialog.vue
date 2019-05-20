<template>
    <!-- 新增弹框 -->
        <el-dialog 
            width="50%"
            title="合并标签" 
            :visible.sync="currentFixedFormVisible" 
            class="vk-tr-dialog"
            @close="closeDialog"
        >
            <template v-if="step==1">
                <el-alert
                    title="组合多个标签，原有标签将被覆盖，请谨慎操作"
                    type="warning"
                    center
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <div class="tag-ct">
                    <span class="title">已选标签：</span>
                    <div>
                        <el-tag
                            v-for="tag in tags_data"
                            :key="tag.id"
                            closable
                            type="info"
                            @close="tagClose(tag.id,tag.name)"
                        >
                            {{tag.name}}
                        </el-tag>
                    </div>
                </div>

                <div class="cb-ct">
                        <el-input
                            class="search"
                            style="width:50%;"
                            placeholder="输入标签名搜索"
                            v-model="search_input"
                            @change="inputChange"
                            @keyup.enter.native="inputSubmit"
                        >
                        </el-input>
                        <el-checkbox-group v-model="checkedTags" @change="checkedTagsChange">
                            <el-row :gutter="24">
                                <el-col :span="4" v-for="item in still_tags" :key="item.id">
                                    <el-checkbox :label="item.id+'|'+item.name" :key="item.name">{{item.name}}</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                        <el-pagination
                            layout="sizes, prev, pager, next, jumper"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            :total="total"
                            @size-change="pnSizeChange"
                            @current-change="pnCurrentChange"
                        />
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" :disabled="tags_data.length<2" @click="step=2">下一步</el-button>
                </div>
            </template>
            <template v-else>
                <el-form 
                    :model="selectForm" 
                    :name="selectForm" 
                    ref="selectForm" 
                    :rules="rules" 
                    label-width="100px"
                    class="sp-t-form"
                >
                    <el-form-item label="已选标签：" prop="" :label-width="formLabelWidth">
                        <el-tag
                            v-for="tag in tags_data"
                            :key="tag.id"
                            type="info">
                            {{tag.name}}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="标签名称：" prop="tagName" :label-width="formLabelWidth">
                        <el-input v-model="selectForm.tagName"  placeholder="请输入标签名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标签类别：" prop="tagType" :label-width="formLabelWidth">
                        <el-cascader
                            :options="tagOption"
                            :props="cascaderProps"
                            v-model="selectForm.tagType"
                            placeholder="请选择标签类别"
                            @change="casChange"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="业务域：" prop="objectId" :label-width="formLabelWidth">
                        <el-select v-model="selectForm.objectId" placeholder="请选择业务域">
                            <el-option
                                v-for="item in selectOption"
                                :key="item.objectTable"
                                :label="item.objectName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签描述：" prop="tagDesc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="selectForm.tagDesc" autocomplete="off" placeholder="请输入标签描述，不超过30字"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="step=1">上一步</el-button>
                    <el-button type="primary" @click="setAction">组 合</el-button>
                </div>
            </template>
        </el-dialog>
</template>
<script>
import api from '@/api/';
import common from '@/constants/common';
import { findIndex, isNull } from 'lodash';

export default {
    props: {
        fixedFormVisible: {
            type: Boolean,
            default: false
        },
        selectOption: {
            type: Array,
            required: true,
        },
        tagOption: {
            type: Array,
            required: true
        },
    },
    data(){
        return{
            step: 1,
            currentFixedFormVisible: false,
            editType: 'new',
            search_input:'',
            alwaysCheckIds: [],
            checkedTags: [],
            formLabelWidth: '120px',
            total: 0,
            currentPage: 1,
            pageSize: 20,
            cascaderProps: {
                value: 'tagClass',
                children: 'children',
                label: 'tagClassName'
            },
            tags_data: [],
            still_tags:[],
            selectForm: {
                tagName: '',//标签名称
                tagType: '',//标签类型
                objectId: '',//业务域id
                tagDesc: '',//标签描述
            },
            rules: {
                tagName: [
                    { required: true, validator: this.nameValidate, trigger: 'blur' }
                ],
                tagType: [
                    { required: true, message: '请选择标签类别', trigger: 'blur' }
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
    mounted(){
        const { currentPage, pageSize,} = this;

        this.getTagList(currentPage,pageSize,'','',3);
    },
    watch: {
        fixedFormVisible(newVal){
            this.step = 1;
            this.currentFixedFormVisible = newVal;
        },
        currentFixedFormVisible(newVal){
            if(newVal){
                this.getTagList(1,20,'','',3);
            }else{
                return
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
        //获取自定义标签列表
        getTagList(pageNo,pageSize,sortType,tagName,tagType){
            api.tagCustomList({
                pageNo,
                pageSize,
                sortType,
                tagName,
                tagType
            }).then(res => {
                if(res.success){
                    this.table_loading=false;
                    this.total = res.data.total;
                    this.still_tags = res.data.data.map(res => {
                        return {
                            name: res.tagName,
                            id: res.id
                        }
                    })
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //搜索自定义标签
        tagCustomSearchAction(pageNo,pageSize,sortType,tagName,tagType){
            api.tagCustomSearch({
                pageNo,
                pageSize,
                sortType,
                tagName,
                tagType
            }).then(res => {
                if(res.success){
                    this.table_loading=false;
                    this.total = res.data.total;
                    this.still_tags = res.data.data.map(res => {
                        return {
                            name: res.tagName,
                            id: res.id
                        }
                    })
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //标签组合
        tagCustomBuildAction(objectId,tagClass1Id,tagClass2Id,tagDesc,tagName,tagType,tagIds){
            api.tagCustomBuild({
                objectId,
                tagClass1Id,
                tagClass2Id,
                tagDesc,
                tagName,
                tagType,
                tagIds
            }).then(res => {
                if(res.success){
                    this.$emit('headCallBack', 'action');
                    this.clearForm();
                }else{}
                
                this.commonAlert(res);
            })
        },
         //清空form验证状态和数据
        clearForm(){
            const { currentPage, pageSize,} = this;

            this.selectForm = Object.assign({}, this.selectForm, {
                selectForm: '',
                tagName: '',//标签名称
                tagType: '',//标签类型
                objectId: '',//业务域id
                tagDesc: '',//标签描述
            })
            this.checkedTags = [];
            this.tags_data = [];
            this.getTagList(currentPage,pageSize,'','',3);
            this.$refs.selectForm.resetFields();
            this.$refs.selectForm.clearValidate();
        },
        //取消按钮关闭弹窗
        closeDialog(){
            this.$emit('headCallBack', 'clear');
        },
        //联级选择改变
        casChange(value){
            console.log(value);
        },
        //新增或编辑方法
        setAction(type){
            if(type == 'new'){
                //新增原子标签
            }else{
                //编辑原子标签
            }
        },
        //分页器页码大小
        pnSizeChange(val){
            this.pageSize = val;
            const { currentPage, pageSize, search_input } = this;

            this.getTagList(1,val,'',search_input,3);
        },
        //分页器页码改变
        pnCurrentChange(val){
            this.currentPage = val;
            const { currentPage, pageSize, search_input } = this;

            this.getTagList(val,pageSize,'',search_input,3);
        },
        //标签描述
        descValidate(rule, value, callback){
            if(isNull(value)){
                callback()
            }else if (value.length > 30) {
                callback('描述信息不超过30字')
            }else{
                callback()
            }
        },
        //合并标签名称验证
        nameValidate(rule, value, callback){
            let reg = /^[\u4E00-\u9FA5A-Za-z0-9~!@#$%^&*()_+{}|:"<>?/～！@#¥%……&*（）——+—「」|：“《》？\x22]+$/;
            
            api.judgeTagName({
                tagName: value,
                tagType: 3,
                id: ''
            }).then(res => {
                if(res.data){
                    callback(new Error('标签名称不可重名'));
                }else{
                    if(!reg.test(value)){
                        callback(new Error('名称由中文、英文、数字或常用符号组成'));
                    }else if(value.length == 0){
                        callback(new Error('请输入标签名称'));
                    }else if(value.length > 10){
                        callback(new Error('标签中文名称不超过10字'));
                    }else{
                        callback();
                    }
                }
            })
        },
        inputChange(val){
            this.search_input = val;
        },
        inputSubmit(e){
            const { currentPage, pageSize, search_input } = this;

            this.search_input = e.target.value;
            this.tagCustomSearchAction(1,pageSize,'',e.target.value,3);
        },
        //checkbox选择联动tags
        checkedTagsChange(val){
            this.tags_data = val.map(res => {
                return {
                    id: res.split('|')[0],
                    name: res.split('|')[1]
                }
            })
        },
        //删除tags
        tagClose(id,name){
            const { checkedTags, tags_data } = this;
            const new_check_tags = checkedTags.filter(res => {
                if(res!=(id+'|'+name)){
                    return res
                }
            })
            const new_tags_data = tags_data.filter(res => {
                if(res.id!=id){
                    return res
                }
            })
            
            this.tags_data = new_tags_data;
            this.checkedTags = new_check_tags;
        },
        //标签组合按钮
        setAction(type){
            this.$refs['selectForm'].validate((valid) => {
                const { checkedTags } = this;
                const { tagName, tagType, objectId, tagDesc } = this.selectForm;
                // console.log(this.selectForm)
                if (valid) {
                    const param = {
                        objectId,
                        tagClass1Id: tagType[0],
                        tagClass2Id: tagType[1],
                        tagDesc,
                        tagName,
                        tagType:3,
                        useRange: 0
                    }
                    const ids = checkedTags.map(res => {
                        return res.split('|')[0]
                    })

                    this.tagCustomBuildAction(objectId,tagType[0],tagType[1],tagDesc,tagName,3,ids);
                }
            })
        }
    }
}
</script>
<style lang="scss">
    .vk-tr-dialog{
        .tag-ct{
            display: flex;
            padding: 18px 16px;
            .title{
                width: 150px;
                line-height: 30px;
            }
            .el-tag{
                margin: 4px 5px;
            }
        }
        .cb-ct{
            background: #FAFAFA;
            border-radius: 2px;
            padding: 20px 30px;
            .search{
                width: 300px;
            }
            .el-checkbox-group{
                margin: 21px 0;
                .el-col{
                    padding: 7px 0;
                }
            }
            .el-pagination{
                text-align: right;
            }
        }
        .sp-t-form{
            .el-tag{
                margin: 4px;
            }
        }
    }
</style>

