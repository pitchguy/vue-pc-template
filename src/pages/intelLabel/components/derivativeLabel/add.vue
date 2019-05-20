<template>
    <el-dialog :title="currentType==='new'?'新建衍生标签':currentType=='watch'?'查看衍生标签':'编辑衍生标签'" :visible.sync="dialogFormVisible" @close="onDialogClose" class="dialog" >
        <el-form ref="form" :rules="rules" :model="form">
            <el-form-item label="标签名称：" prop="tagName" label-width="120px">
                <el-input :disabled="input_disable.objO" class="big-formitem" v-model="form.tagName"  placeholder="请输入标签名称"></el-input>
            </el-form-item>
            <el-form-item label="标签类别：" prop="tagType" label-width="120px">
                <el-cascader :disabled="input_disable.objT" class="big-formitem" :options="tagOption" :props="cascaderProps" v-model="form.tagType" placeholder="请选择标签类别" :class="{'tag-type':currentType=='watch'?true:false}">
                </el-cascader>
            </el-form-item>
            <el-form-item label="业务域：" prop="objectId" label-width="120px">
                <el-select :disabled="input_disable.objTh" class="big-formitem" v-model="form.objectId" placeholder="请选择业务域">
                    <el-option v-for="(item, idx) in objectIds" :key="idx" :label="item.objectName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签描述：" prop="desc" label-width="120px">
                <el-input :disabled="input_disable.objF" type="textarea" maxlength="30" :rows="2" class="big-formitem" v-model="form.desc" placeholder="请输入标签描述，不超过30字"></el-input>
            </el-form-item>
            <el-form-item v-if="isControl?true:false">
                <!-- 展开内容 -->
                <two-lv-relative ref="relativeComponent" :objectId="form.objectId" :editData="relativeObj" :currentType="currentType"></two-lv-relative>
            </el-form-item>
            <el-form-item v-if="currentType!='watch'" style="text-align: right;">
                <el-button @click="resetForm()">取消</el-button>
                <el-button type="primary" @click="submitForm()">{{currentType==="new"?"新增":"更新"}}</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>
    import Vue from 'vue'
    import TwoLvRelative from './two-lv-relative.vue'
    import api from '@/api/';
    import mixins from '@/constants/mixins';
    import { setTimeout } from 'timers';
    import { find, isEmpty, isUndefined } from 'lodash';

    export default {
        mixins: [mixins],
        name: "add-dialog",
        props: ['sortSearch','currentType'],
        components: { 'two-lv-relative': TwoLvRelative },
        data() {
            const validatePass = (rule, value, callback)=>{
                if(value){
                    if(this.rowData && this.rowData.tagName == this.form.tagName){
                        return callback();
                    }
                    let query = '?tagName=' + value + '&tagType=2'
                    
                    api.derivativeRename(null,query).then(res => {
                        if(res.success){
                            if(res.data){
                                callback(new Error('标签名称重复，请重新输入名称'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('标签名称重复，请重新输入名称'));
                        }
                        
                    })
                }else{
                  callback(new Error('请输入标签名称'));
                }
            }
            return {
                type: "new",
                isExpand: false,
                dialogFormVisible: false,
                rowData: null,
                basicData: [],//配置数据
                input_disable: {
                    objO: false,
                    objT: false,
                    objTh: false,
                    objF: false,
                    buttonType: false
                },
                form: {
                    tagName: "",
                    tagType: [],  // 临时联级查询
                    objectId: "",
                    desc: "",
                    tagJoinParam: {},
                    tagClass1Id: "string",
                    tagClass2Id: "string"
                },
                cascaderProps: {
                    value: 'tagClass',
                    children: 'children',
                    label: 'tagClassName'
                },
                tagOption: [], // 标签类别
                objectIds: [], // 客户域
                relativeObj: null, // 编辑 状态使用的关系对象
                rules: {
                    tagName: [
                        { required: true,validator: validatePass, trigger: 'blur' },
                    ],
                    tagType: [
                        { required: true, message: '请选择标签类别', trigger: 'blur' }
                    ],
                    objectId: [
                        { required: true, message: '请选择业务域', trigger: 'change' }
                    ],
                    tagDesc: [
                        { required: false }
                    ]
                },

                remoteData: {

                }
            }
        },

        watch: {
            currentType(newVal){
                if(newVal=='watch'){
                    this.input_disable = Object.assign({}, this.input_disable, {
                        objO: true,objT: true,objTh: true,objF: true,buttonType: true
                    })
                }
            },
            isControl(newVal){
                this.$store.dispatch('getBasicLabelConf',newVal);
            }
        },

        computed:{
            loading2(){
                return this.currentType=='watch'?true:false
            },
            isControl(){
                return this.form.objectId
            }
        },

        methods: {
            // 新增或编辑
            show(type, row) {
                this.rowData = row
                this.form = {
                    tagName: "",
                    tagType: [],  // 临时联级查询
                    objectId: "",
                    desc: "",
                    tagJoinParam: {},
                    tagClass1Id: "",
                    tagClass2Id: ""
                }
                this.type = type
                if (type === "new") {
                } else {
                    this.form.tagName = row.tagName
                    this.$set(this.form.tagType, 0, row.tagClass1Id)
                    this.$set(this.form.tagType, 1, row.tagClass2Id)
                    // this.form.tagType = [row.tagClass1Id,row.tagClass2Id]
                    this.form.objectId = row.objectId
                    this.form.desc = row.tagDesc
                    this.relativeObj = JSON.parse(row.arg1)
                    this.form.tagClass1Id = row.tagClass1Id
                    this.form.tagClass2Id = row.tagClass2Id
                }
                this.dialogFormVisible = true
            },
            onCollapseChange(a) {
                this.isExpand = !this.isExpand
            },

            //获取类目树
            fetchTagTypeTree() {
                api.tagTypeTree({}).then(res => {
                    if (res.success) {
                        let checkArr = res.data.filter(item => item.children != null)
                        this.tagOption = checkArr;
                    } else {
                        this.commonAlert(res);
                    }
                })
            },

            //获取业务域数据
            fetchTagObject() {
                api.tagObject({}).then(res => {
                    if (res.success) {
                        this.objectIds = res.data;
                    } else {
                        this.commonAlert(res);
                    }

                })
            },

            // 新增标签
            addDerivativeTag(params) {
                api.derivativeAdd(params).then(res => {
                    if (res.success) {
                        this.commonAlert(res);
                    } else {
                        this.commonAlert(res);
                    }
                   this.sortSearch(1)

                })
            },

            // 更新标签
            updateDerivativeTag(params, id) {
                api.updateDerivativeTag(params, id).then(res => {
                    if (res.success) {
                        this.commonAlert(res);
                    } else {
                        this.commonAlert(res);
                    }
                    this.sortSearch(1)
                })
            },

            onAddCondition() {
                let obj = {
                    "children": [],
                    "conditions": [
                        {
                            "op": "=",
                            "tagClass2Id": "",
                            "tagId": ""
                        }
                    ],
                    "op": "and"
                }

                if (this.remoteData && Object.keys(this.remoteData).length > 0) {
                    this.remoteData.conditions.push(obj)
                } else {
                    this.remoteData = obj
                }
            },

            // 平级增加(暂时只做两级)
            onAddConditionEvent(condition) {
                let obj = {
                    "children": [],
                    "conditions": [
                        {
                            "op": "=",
                            "tagClass2Id": "",
                            "tagId": ""
                        }
                    ],
                    "op": "and"
                }

                let idx = null;
                for (let i = 0; i < this.remoteData.children.length; i++) {
                    if (this.remoteData.children[i] === condition) {
                        idx = i;
                    }
                }

                let child = {
                    "children": [],
                    "op": "",
                    "conditions": []
                }
                child.conditions.push(this.remoteData.conditions.splice(idx, 1))
                child.conditions.push(obj)
                // this.remoteData.splice(idx,child)
                this.remoteData.children.push(child)

            },

            serchTreeNode(tree, sNode) {

                for (let i = 0; i < tree.conditions.length; i++) {
                    if (tree.conditions[i] === sNode) {
                        return tree
                    }
                }

                for (let i = 0; i < tree.children.length; i++) {
                    return this.serchTreeNode(tree.children[i], sNode)

                }

            },
            onDialogClose() {
                this.resetForm()
                this.relativeObj = null;
                this.$refs['relativeComponent'].initRelative()
                this.$refs['relativeComponent'].initSelfData()
            },
            resetForm() {
                this.input_disable = Object.assign({}, this.input_disable, {
                    objO: false,objT: false,objTh: false,objF: false,buttonType: false
                })
                this.$refs['form'].resetFields()
                this.dialogFormVisible = false
                this.rowData = null
            },

            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let relatives = this.$refs['relativeComponent'].getRelative()
                        let conditonGroupData = relatives.conditonGroupData
                        let relativeObj = relatives.relativeObj

                        if(conditonGroupData && conditonGroupData.length <= 0){
                            this.$notify({
                                title: '错误',
                                message: '请至少选择一个标签',
                                type:  'error'
                            })
                            return 
                        }else{
                            //  let isHasSelect = true
                            //  conditonGroupData.forEach(element => {
                            //     element.conditions.forEach(condition => {
                            //         const judge1 = isUndefined(condition.value)&&isUndefined(condition.listValue)&&isUndefined(condition.lvalue);
                            //         const judge2 = isUndefined(condition.value)&&isUndefined(condition.listValue)&&isUndefined(condition.rvalue);
                            //         if(judge1&&judge2){
                            //             isHasSelect = false
                            //         }else{
                            //             if(isUndefined(condition['value'])&&isUndefined(condition['listValue'])&&isUndefined(condition['lvalue'])&&isUndefined(condition['rvalue'])){
                            //                 this.isHasSelect = false;
                            //             }else{
                            //                 ['value','listValue','lvalue','rvalue'].map(res => {
                            //                     if(!isUndefined(condition[res])&&isEmpty(condition[res])){
                            //                         this.isHasSelect = false
                            //                     }
                            //                 })
                            //             }
                            //             // ['value','listValue','lvalue','rvalue']
                            //         }
                            //         if(!condition.columnName||!condition.op){
                            //             isHasSelect = false
                            //         }
                            //      })
                            //  });
                            //  if(!isHasSelect){
                            //       this.$notify({
                            //         title: '错误',
                            //         message: '请完善衍生标签配置条件',
                            //         type:  'error'
                            //     })
                            //     return
                            //  }
                            
                        }
                       
                        // 判断是否有衍生标签的关系选择
                        if(relativeObj)
                        this.form.tagJoinParam = relativeObj
                        this.form.tagClass1Id = this.form.tagType[0]
                        this.form.tagClass2Id = this.form.tagType[1]
                        if (this.type === 'new') {
                            this.addDerivativeTag(this.form)
                        } else {
                            this.updateDerivativeTag(this.form, this.rowData.id)
                        }

                        this.dialogFormVisible = false
                        
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }

        },

        mounted() {
            this.fetchTagTypeTree()
            this.fetchTagObject()
            this.remoteData = {}

        }
    }
</script>

<style lang="scss" scoped>
    .dialog {
      font-size: 14px;
    }
    .big-formitem {
      width: 100%;
    }
    
    .flex-item {
      display: flex;
    }

    /deep/ .el-dialog{
      min-width: 845px !important;
    }
    /deep/ .tag-type{
        .el-cascader__label{
            span{
                color:#e5dcdc !important;
            }
        }
    }
</style>
