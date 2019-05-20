<template>
    <el-container>
        <el-header class="vk-add-header">
            <p v-if="showType">新增角色</p>
            <p v-else>编辑角色</p>
        </el-header>
        <el-main class="vk-add-main">
            <el-form :model="tempForm" :name="tempForm" status-icon :rules="rules" ref="tempForm" :label-width="formLabelWidth" class="demo-ruleForm">
                <el-form-item label="角色隶属：" prop="orgCode" :label-width="formLabelWidth">
                    <el-cascader v-model="tempForm.orgCode" placeholder="选择角色隶属" :options="userTree" :props="defaultSearchProps" filterable change-on-select></el-cascader>
                </el-form-item>
                <el-form-item label="角色名称：" prop="name" :label-width="formLabelWidth">
                    <el-input type="text" v-model="tempForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="tempForm.desc" autocomplete="off" placeholder="请输入角色描述，不超过30字"></el-input>
                </el-form-item>
                <el-form-item label="选择角色模板：" prop="userTemp" :label-width="formLabelWidth">
                    <el-select v-model="tempForm.userTemp" value-key="id" placeholder="请选择" @change="selectChange">
                        <el-option v-for="item in selectData" :key="item.id" :label="item.roleConfigName" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能权限分配：" prop="functions" :label-width="formLabelWidth">
                    <el-tree :data="jurTree" :props="treeProps" :default-checked-keys="tempForm.functions" node-key="permId" ref="jurTree" show-checkbox highlight-current v-model="tempForm.functions" @check-change="treeCheckChange">
                    </el-tree>
                </el-form-item>
                <el-form-item label="数据权限分配：" props='juri' :label-width="formLabelWidth">
                    <!-- <el-tree
                        v-model="tempForm.juri"
                        style="width:200%;"
                        :data="userTree"
                        :props="juritreeProps"
                        node-key="orgId"
                        ref="jTree"
                        border	
                        highlight-current
                        :expand-on-click-node="false"
                    >  
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-checkbox-group v-model="checkedCities" @change="checked => handleCheckedCitiesChange(checked,data,node)">
                                    <el-checkbox v-if="item.orgId == data.orgId" v-for="item in checkBoxArr" :key="item.orgId+'|'+item.businessCode+'|'+item.orgType" :label="item.orgId+'|'+item.businessCode"></el-checkbox>
                                </el-checkbox-group>
                            </span>
                        </span>
                    </el-tree> -->
                    <user-tree-grid ref="treeGrid"></user-tree-grid>
                </el-form-item>
                <el-form-item>
                    <el-button class="common-button" v-if="showType" type="primary" @click="submitForm('tempForm')">提交</el-button>
                    <el-button class="common-button" v-else type="primary" @click="submitForm('tempForm')">保存</el-button>
                    <el-button @click="goBackHome">返回</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import api from "@/api/index.js";
    import { isEmpty, isUndefined, findIndex, remove, find } from 'lodash';
    import UserTreeGrid from './tree-grid.vue';

    export default {
        components: { 'user-tree-grid': UserTreeGrid },
        data() {
            return {
                showType: '',
                changeId: '',
                checkedCities: [],
                juTreeSelect: [],
                // checkBoxArr: [],
                dataAuthList: [],// 数据权限列表
                treeProps: {
                    label: 'permLabel',
                    children: 'childFunPerms'
                },
                juritreeProps: {
                    label: 'orgName',
                    children: 'childOrgs'
                },
                userTree: [], // 用户权限树
                jurTree: [],
                selectData: [],
                allParentNode: [],
                formLabelWidth: '150px',
                defaultSearchProps: {
                    children: 'childOrgs',
                    label: 'orgName',
                    value: 'orgId'
                },
                tempForm: {
                    orgCode: [],
                    name: '',
                    desc: '',
                    functions: [],
                    userTemp: '',
                    juri: []
                },
                rules: {
                    orgCode: [
                        { required: true, message: '请输入角色隶属', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                    ],
                    desc: [
                        { validator: this.descValid, message: '描述信息不超过30字', trigger: 'blur' }
                    ],
                    functions: [
                        { required: true, message: '请至少选择一个功能权限', trigger: 'change' }
                    ],
                    userTemp: [
                        { required: false, message: '请选择角色模板', trigger: 'change' }
                    ],
                }
            }
        },
        created() {
            this.showType = isUndefined(this.$route.params.id);//编辑角色模版的id
        },
        mounted() {
            const editId = this.$route.params.id;

            this.getConstruTree();
            this.getUserMissionId();
            this.getConfigRoleList();
            this.getJurisTree();

            if (isUndefined(editId)) {
                //新建
                this.$refs['treeGrid'].show(false)
                return false
            } else {

                // 编辑
                this.seeUserDetail(editId);//获取编辑信息
                this.getDataPermList(editId);//获取角色的选中的数据权限列表
            }
        },
        methods: {
            goBackHome() {
                this.$router.push({name: 'user-role', params: {cuPage: 'user'}});
            },
            //通用提醒
            commonAlert(res){
                this.$notify({
                    title: res.success?'成功':'错误',
                    message: res.message,
                    type: res.success?'success':'error'
                });
            },
            handleCheckedCitiesChange(val, data, node) {
                const oldData = this.tempForm.juri;//需要上传的值

                if (val.length == 0) {//编辑时全部取消时
                    this.tempForm.juri = []
                } else {

                    const juriObj = {//需要上传的值
                        businessCode: (val[val.length - 1].split('|'))[1],
                        orgId: data.orgId,
                        orgType: data.orgType
                    }

                    this.checkedCities = val;//checkbox group设置选中值
                    if (findIndex(oldData, juriObj) < 0) {
                        //添加
                        this.tempForm.juri = oldData.concat(juriObj)
                    } else {
                        //移除
                        this.tempForm.juri = oldData.map(res => {
                            if (res.orgId == data.orgId && res.orgType == data.orgType) {

                            } else {
                                return res
                            }

                        })
                    }
                    console.log(this.tempForm.juri)
                }
            },
            //查看角色信息
            seeUserDetail(roleId) {
                api.seeUserDetail({ roleId }).then(res => {
                    if (res.success) {
                        const { roleDesc, roleName, funPermIds, orgLink, id } = res.data;
                        const { desc, name, functions } = this.tempForm;
                        
                        this.tempForm.orgCode = orgLink
                        this.changeId = id;//编辑者的id
                        this.tempForm.desc = roleDesc;
                        this.tempForm.name = roleName;
                        this.tempForm.functions = funPermIds;
                    } else {
                        this.commonAlert(res);
                    }
                })
            },
            //编辑时获取数据权限分配对应数据
            getDataPermList(roleId) {
                api.getDataPermList({
                    roleId
                }).then(res => {
                    if (res.success) {
                        const new_juri = res.data.map(res => {
                            return res.orgId + '|' + res.businessCode
                        })

                        this.checkedCities = new_juri;
                        this.tempForm.juri = res.data;

                        this.$refs['treeGrid'].show(true, res.data)
                    } else {
                        this.commonAlert(res);
                    }
                })
            },
            //新增角色方法
            addNewUser(dataPerms, orgId, orgType, permIds, roleDesc, roleName) {
                api.addNewUser({
                    dataPerms,//数据权限参数
                    orgId,//组织ID
                    orgType,//组织类型
                    permIds,//权限id集合
                    roleDesc,//角色描述
                    roleName,//角色名称
                }).then(res => {
                    if (res.success) {
                        this.$router.push({name: 'user-role', params: {cuPage: 'user'}});
                    } else { }

                    this.commonAlert(res);
                })
            },
            //更新角色
            updateUser(dataPermParams, id, orgId, permIds, roleDesc, roleName) {
                api.updateUser({
                    dataPermParams,
                    id,
                    orgId,
                    permIds,
                    roleDesc,
                    roleName
                }).then(res => {
                    if (res.success) {
                        this.$router.push({name: 'user-role', params: {cuPage: 'user'}});
                    } else { }

                    this.commonAlert(res);
                })
            },
            //获取角色隶属树
            getConstruTree() {
                api.constructTree({}).then(res => {
                    if (res.success) {
                        this.userTree = res.data;
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            //获取个人数据权限树
            getUserMissionId() {
                api.getUserMissionId({}).then(res => {
                    if (res.success) {
                        this.dataAuthList = res.data;
                    } else {
                        this.$message.error(res.message);
                    }

                })
            },
            //获取角色模板下拉列表
            getConfigRoleList() {
                api.getConfigRoleList().then(res => {
                    if (res.success) {
                        this.selectData = res.data;
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            //获取角色模版列表
            getUserTempList() {
                api.getUserTempList()
            },
            //获取功能权限树
            getJurisTree() {
                api.getJurisTree().then(response => {
                    const { success, data, message } = response;

                    if (success) {
                        let allParentNode=[];
                        let loop = res => {
                            res.forEach(item => {
                                if (item.childFunPerms.length != 0) {
                                    allParentNode.push(item.permId);
                                    loop(item.childFunPerms);
                                    return;
                                }

                                if (item.childFunPerms == 0) {
                                    loop(item.childFunPerms);
                                    return;
                                }
                            });
                        };
                        loop(data);
                        this.jurTree = data;
                        this.allParentNode = allParentNode;//取得所有父节点
                    } else {
                        this.$message.error(message);
                    }
                })
            },
            //角色模板选值改变
            selectChange(val) {
                this.tempForm.userTemp = val;//select选中
                this.tempForm.functions = val.permIds;//功能权限选中的值
                this.$refs.jurTree.setCheckedKeys(val.permIds);
            },
            //树选择改变
            treeCheckChange(node, status) {
                this.tempForm.functions = this.$refs.jurTree.getCheckedKeys();
            },
            //自定义验证描述
            descValid(rule, value, callback) {
                if (value.length > 30) {
                    callback('描述信息不超过30字')
                } else {
                    callback()
                }
            },
            //提交表单
            submitForm(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const { changeId, checkedCities, allParentNode } = this;
                        const { orgCode, name, desc, functions, userTemp } = this.tempForm;
                        const juri = this.$refs['treeGrid'].getBusinessList();
                        const uploadNodes = functions.filter(res => {
                            if(allParentNode.indexOf(res)<0){
                                return res
                            }else{
                                return
                            }
                        })
                        let tempNode = {};

                        let loop = data => {
                            data.forEach(item => {
                                if (item.orgId == orgCode[orgCode.length - 1]) {
                                    tempNode = item;
                                    return;
                                }
                                if (item.childOrgs) {
                                    loop(item.childOrgs);
                                }
                            });
                        };
                        loop(this.userTree);

                        if (this.showType) {
                            //新增
                            this.addNewUser(juri, orgCode[orgCode.length - 1], tempNode.orgType, uploadNodes, desc, name)
                        } else {
                            //保存
                            // const dataPermParams = juri.map(res => {
                            //     return { businessCode: res.split('|')[1], orgId: res.split('|')[0] }
                            // })
                            this.updateUser(juri, changeId, orgCode[orgCode.length - 1], uploadNodes, desc, name)
                        }
                    } else {
                        this.$message.info('验证异常')
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .common-button{
        background: #5A8CFF;
    }
    .vk-add-header {
      height: auto !important;
      padding: 20px 0 0 20px;
      p {
        font-size: 16px;
        color: #333333;
      }
    }
    .vk-add-main {
      background: #fff;
      margin: 20px;
      .el-cascader {
        width: 100%;
      }
      .el-form-item__content {
        width: 25%;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
</style>
