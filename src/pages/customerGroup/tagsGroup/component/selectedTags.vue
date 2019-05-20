<template>
    <div class="vk-selectedTags">
        <template v-if="this.datas.length > 0">
            <div class="vk-title">已选标签</div>
            <div class="vk-tags">
                <span class="vk-tagName" v-for="tag in datas" :key="tag.id">
                    <i class="el-icon-close vk-close" @click="deleteTags(tag)"></i>
                    {{tag.tagName}}
                </span>
            </div>
            <div class="vk-btnGroup">
                <span v-if="isUpdate">
                    <el-button type="primary" size="small" :loading="buttonLoading" class="vk-save" @click="updatePackage">更新客群</el-button>
                </span>
                <span v-else>
                    <el-button v-if="savePerm" :type="saveDisable?'info':'primary'" :disabled="saveDisable" size="small" :loading="buttonLoading" class="vk-save" @click="openDialog">保存客群</el-button>
                    <el-button v-if="savePerm" type="danger" class="vk-reset" @click="resetSelect">重置</el-button>
                </span>
            </div>
            <el-dialog
                :title="isUpdate?'更新客户群':'保存客户群'"
                :visible="visible"
                :width="'520px'"
                @update:visible="handleCancel">
                <div>
                    <el-form ref="form" :model="form" :rules="formRule" label-width="100px" label-position='right' @submit.native.prevent="saveCustomerGroup">
                        <el-form-item label="客群包名称:" prop="value">
                            <el-input placeholder="请输入客群包名称" v-model.trim="form.value"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-bottom:0;">
                            <div class="fr vk-btnGroups">
                                <el-button @click="handleCancel">取消</el-button>
                                <el-button type="primary" class="vk-addBtn" native-type="submit">{{isUpdate?'更新':'添加'}}</el-button>
                            </div>
                        </el-form-item>
                </el-form>
                </div>
            </el-dialog>
        </template>
        <template v-else>
            <div class="vk-noTags">
                <!-- <i class="el-icon-circle-plus-outline"></i> -->
                请选择下方标签完成标签配置
            </div>
        </template>
    </div>
</template>

<script>
import api from '@/api/';
import { isEmpty } from 'lodash';
import common from '@/constants/common';
import mixins from '@/constants/mixins';

export default {
    mixins: [mixins],
    data(){
        return {
            form:{
                value:'',
            },/* 表单内容 */
            formRule:{
                value: [
                    { required: true, validator: this.pkNameValidate, trigger: 'blur' },
                ],
            },/* 表单规则 */
            visible:false,
            buttonLoading: false,/* 按钮loading */
            saveDisable: false,/* 保存客群按钮disable */
        }
    },
    props:['data','isUpdate','cityPjData'],
    created(){
    },
    mounted () {
        const query = this.$router.history.current.query;
    },
    watch: {
        data(newVal){
            this.saveDisable = false;
        }
    },
    computed: {
        savePerm(){//保存客群权限
            return common.permCheck('user_group_package_save')
        },
        datas(){//props名称最好别用常用编码词汇，使用计算属性重新赋值
            return this.data
        }
    },
    methods: {
        /*保存客群*/
        saveCustomBagAction(name,list,cityName,projectName){
            api.saveCustomBag({
                name,list,
                cityName,projectName
            }).then(res => {
                this.commonAlert(res)
                if(res.success){
                    this.saveDisable = true;
                    this.handleCancel();
                }else{}
            })
        },
        /* 删除标签 */
        deleteTags(item){
            console.log('item:',item);
            //TODO 删除标签
            let index = this.datas.findIndex((o)=> o.id == item.id );

            if(index != -1){
                this.datas.splice(index,1);//当前列表数据删除
                this.$store.dispatch('deleteOldTag',[item]);//删除新增标签的选择项
            }else{
                this.$message.warning("删除失败")
            }
        },
        /* 保存客群 */
        saveCustomerGroup(){
            const { cityName, projectName } = this.cityPjData;

            this.$refs.form.validate((valid) => {
                if (valid) {
                    //TODO 保存客户群
                    console.group();
                    console.log('客群包名称:',this.form.value);
                    console.log('标签:',this.datas);
                    console.groupEnd();
                    const uploadData = this.datas.map(res => {
                        return {
                            class1Id: res.class1Id,
                            class2Id: res.refCode,
                            tagId: res.id
                        }
                    })
                    this.saveCustomBagAction(this.form.value,uploadData,cityName,projectName)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /*更新客群包操作*/
        updatePackage(){
            const { cityName, projectName } = this.cityPjData;
            const packageId = this.$router.history.current.query.packageId;
            const uploadData = this.datas.map(res => {
                return {
                    class1Id: res.class1Id,
                    class2Id: res.refCode,
                    tagId: res.id
                }
            })

            api.updateCustomBag({
                cityName,
                projectName,
                id: packageId,
                customerAnalysisParams:uploadData,
            }).then(res => {
                if(res.success){
                    console.log(res)
                }else{}
                this.commonAlert(res);
            })
        },
        /* 客群包名称 */
        openDialog(){
            this.buttonLoading = true;
            this.visible = true;
        },
        //重置标签
        resetSelect(){
            this.$store.dispatch('resetOldTag', this.datas);
            this.$store.dispatch('deleteOldTag',this.datas);//删除新增标签的选择项
            this.$store.dispatch('isTriggerReset',true);//是否触发重置
        },
        handleCancel(){
            this.form.value = '';
            this.$refs.form.resetFields();
            this.visible = false;
            this.buttonLoading = false;
        },
        pkNameValidate(rule, value, callback){
                const len = value.length;

                if(len == 0){
                    callback(new Error('请输入客群包名称'));
                }else if(len>16){
                    callback(new Error('客群包名称最多16个字符'));
                }else{
                    callback();
                }
        }
    }
}
</script>

<style lang="scss" scoped>
    .vk-selectedTags{
        width:100%;
        border:1px dashed #C5C5C5;
        padding:20px 30px;
        background-color:#F9F9F9;
        .vk-title{
            color: #333333;
            margin-bottom:5px;
            font-size: 14px;
        }
        .vk-tags{
            margin:16px 0 12px 0;
            .vk-tagName{
                background: #FFFFFF;
                border: 1px solid #DDDDDD;
                border-radius: 2px;
                font-size: 12px;
                color: rgba(0,0,0,0.85);
                padding:5px 16px;
                position: relative;
                display: inline-block;
                margin-bottom:18px;
                margin-right:12px;
                text-align: center;
                &:hover{
                    .vk-close{
                        opacity: 1;
                    }
                }
                .vk-close{
                    position: absolute;
                    opacity: 0;
                    top:1px;
                    right:2px;
                    color:#999999;
                    font-size: 6px;
                    cursor: pointer;
                }
            }
        }
        .vk-btnGroup{
            .vk-save{
                // background: #5A8CFF;
                border-radius: 4px;
                // width:80px;
                // height:30px;
            }
        }
        .vk-noTags{
            font-size: 14px;
            color: #999999;
            text-align: center;
            margin:20px 0;
            letter-spacing: 0.78px;
        }
        /* 对话框 */
        .el-dialog__header{
            background: #F7F7F7;
            padding:12px 20px;
            .el-dialog__title{
                font-size: 14px;
                color: #333333;
            }
            .el-dialog__headerbtn{
                top:14px;
                color:#666666;
                font-size: 20px;
            }
        }
        .el-dialog__body{
            padding-bottom:20px;
            .vk-btnGroups{
                button{
                    width:80px;
                    height:30px;
                    &.vk-addBtn{
                        background: #5A8CFF;
                    }
                }
            }
        }
    }
</style>
