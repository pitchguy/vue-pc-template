<template>
    <div style="width: 622px">
        <el-table ref="myTable" border :data="tableData" style="width: 622px;font-size:14px;">
            <el-table-column label="区域" width="300" align="left" header-align="left">
                <template slot-scope="scope">
                    <div :class="levelClass[scope.row.level]">
                        <el-button class="expend-btn" v-if="scope.row.hasChildren" type="text" :icon="scope.row.isExpend?'el-icon-remove-outline':'el-icon-circle-plus-outline'" @click="expendClick(scope.row)"></el-button>
                        <span>{{scope.row.orgName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="DC" label="地产" width="80" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-checkbox :class="scope.row.iDC&&typeof scope.row.DC === 'undefined'?'myClass':''"  :indeterminate="scope.row.iDC" :disabled="typeof scope.row.DC === 'undefined'" @change="checkboxChange(scope.row,'DC')" v-model="scope.row.DC"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="BY" label="公寓" width="80" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-checkbox :class="scope.row.iBY&&typeof scope.row.BY === 'undefined'?'myClass':''"  :indeterminate="scope.row.iBY" :disabled="typeof scope.row.BY === 'undefined'" @change="checkboxChange(scope.row,'BY')" v-model="scope.row.BY"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="BX" label="冰雪" width="80" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-checkbox :class="scope.row.iBX&&typeof scope.row.BX === 'undefined'?'myClass':''"  :indeterminate="scope.row.iBX" :disabled="typeof scope.row.BX === 'undefined'" @change="checkboxChange(scope.row,'BX')" v-model="scope.row.BX"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="JY" label="教育" width="80" align="center" header-align="center">
                <template slot-scope="scope">
                    <el-checkbox :class="scope.row.iJY&&typeof scope.row.JY === 'undefined'?'myClass':''" :indeterminate="scope.row.iJY" :disabled="typeof scope.row.JY === 'undefined'" @change="checkboxChange(scope.row,'JY')" v-model="scope.row.JY"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="!canTouch" class="mask"></div>
    </div>
</template>

<script> 
    import api from "@/api/index.js";
    import { Checkbox } from 'element-ui';
    import { setTimeout } from 'timers';
    export default {
        name: "user-tree-grid",
        props: ['showType'],
        data() {
            return {
                isShow: false,
                levelClass: [, "level1", "level2", "level3"],
                businessList: [], // 组织ID对应的业务
                businessObj: {}, // 自定义的orgId业务数据
                businessListData: [], // 即将上传的权限数据列表
                remoteData: null,
                tableData: [],
                canTouch: true
            }
        },

        async mounted() {

        },

        methods: {
            //获取角色隶属树
            getConstruTree() {
                return api.constructTree({})
            },

            //获取个人数据权限树
            getUserMissionId() {
                api.getUserMissionId({}).then(res => {
                    if (res.success) {
                        this.businessList = res.data;
                    } else {
                        this.$message.error(res.message);
                    }

                })
            },
            /**
             * 根据树结构，数据权限列表合并为table可使用的数据
             * 遍历node节点，并深度优先加入tableData中
             */
            computeTableData() {
                this.treeConvertToList(this.remoteData)
                this.remoteData.hasChildren = false; // 默认打开第一级
            },

            /**
             * 将权限列表转换为object对象列表，达到快速查找，提高性能
             * {"10001":["BY","BX"],"10001":["BY","BX"]}
             */
            businessListConvertToObj(businessList) {
                let businessObj = {}
                for (let i = 0; i < businessList.length; i++) {
                    let item = businessList[i];
                    if (!businessObj[item.orgId]) {
                        businessObj[item.orgId] = []
                    }
                    businessObj[item.orgId].push(item.businessCode)
                }
                return businessObj
            },

            /**
             * 处理远程的树数据，扩展一些属性
             */
            formatTree(node) {
                if (!node) return
                // 默认全部为关闭状态
                if (!node.childOrgs || node.childOrgs.length <= 0) {
                    node.hasChildren = false;
                } else {
                    node.hasChildren = true;
                    node.isExpend = false;// 默认全部为关闭状态
                }

                // 附上权限信息
                // let childTrueNumList =
                let list = this.businessObj[node.orgId]
                if (list) {
                    for (let i = 0; i < list.length; i++) {
                        // 默认可以选这个权限(不赋值代表禁用)
                        if (list[i] && node[list[i]] && typeof node[list[i]] === "boolean") {
                            this.$set(node, list[i], node[list[i]])
                        } else {
                            this.$set(node, list[i], false)
                        }
                    }
                }

                // 处理节点的层级关系
                if (node.childOrgs) {
                    for (let i = 0; i < node.childOrgs.length; i++) {
                        let childNode = node.childOrgs[i];
                        if (childNode) {
                            childNode.parentNode = node; // 添加父节点信息
                            childNode.level = node.level + 1; // 添加层级信息
                            this.formatTree(childNode) // 继续遍历子节点
                        }
                    }
                }

            },

            /**
             * 深度遍历，探测是否有孩子节点选择了
             */
            deepSearchTree(treeNode, type) {

                if (treeNode.childOrgs) {
                    let isSelected = false
                    treeNode.childOrgs.forEach((childNode) => {
                        // console.log(this.deepSearchTree(childNode, type))
                        if (this.deepSearchTree(childNode, type) === true) {
                            isSelected = true
                        }
                    })

                    if (isSelected === true) {
                        if (treeNode[type] != true) {
                            this.$set(treeNode, 'i' + type, isSelected)
                        } else {
                            this.$set(treeNode, 'i' + type, false)
                        }
                    } else {
                        this.$set(treeNode, 'i' + type, false)
                    }

                    return isSelected
                } else {
                    return treeNode[type]
                }
            },

            /**
             * 树结构转为list，用于显示table(默认只展开到一级)
             */
            treeConvertToList(treeNode) {
                if (!treeNode) return
                // 加入列表
                this.tableData.push(treeNode);

                // 所有一级子节点加入
                if (treeNode.childOrgs && treeNode.childOrgs.length > 0) {
                    for (let i = 0; i < treeNode.childOrgs.length; i++) {
                        this.tableData.push(treeNode.childOrgs[i]);
                    }
                }

            },

            /**
             * 点击扩展/收缩按钮
             */
            expendClick(treeNode) {
                if (treeNode.isExpend) {
                    treeNode.isExpend = false;
                    this.removeSubNode(treeNode);
                } else {
                    treeNode.isExpend = true;
                    this.addSubNode(treeNode);
                }
            },

            /**
             * 根据树结构扩展按钮动态显示子节点内容
             */
            addSubNode(treeNode) {
                const idx = this.tableData.indexOf(treeNode);
                if (treeNode.childOrgs && treeNode.childOrgs.length) {
                    this.tableData.splice(idx + 1, 0, ...treeNode.childOrgs)
                }
            },

            /**
             * 根据树结构扩展按钮动态显示子节点内容
             */
            removeSubNode(treeNode) {
                // 找到列表中的位置
                const idx = this.tableData.indexOf(treeNode);
                // 利用孩子节点的长度来删除
                if (treeNode.childOrgs && treeNode.childOrgs.length) {
                    this.tableData.splice(idx + 1, treeNode.childOrgs.length)
                }
            },

            /**
             * 勾选框改变事件
             */
            checkboxChange(treeNode, type) {

                if (!treeNode[type]) {   // 取消
                    // 判断是否有父节点，如果有父节点，父节点强制设置为false
                    if (treeNode.parentNode) {
                        const myIdx = this.tableData.indexOf(treeNode.parentNode);
                        if (typeof treeNode.parentNode[type] != 'undefined') {
                            treeNode.parentNode[type] = false
                        }

                    }
                    // 子节点全部关闭
                    this.changeSubTreeState(treeNode, type, false)

                } else {  // 勾选

                    // 子节点所有都将被选中
                    this.changeSubTreeState(treeNode, type, true)
                    // 如果同级的都选中，父节点也同时选中
                    if (treeNode.parentNode && treeNode.parentNode.childOrgs) {
                        let checkedNum = 0
                        treeNode.parentNode.childOrgs.forEach((childNode) => {
                            if (childNode[type] === true) {
                                checkedNum++
                            }
                        })
                        if (checkedNum >= treeNode.parentNode.childOrgs.length) {
                            if (typeof treeNode.parentNode[type] != 'undefined') {
                                treeNode.parentNode[type] = true
                            }
                        }
                    }
                }
                this.deepSearchTree(this.remoteData, type)
            },

            /**
             * 树的子节点状态批量操作(包括自己)
             */
            changeSubTreeState(treeNode, type, b) {
                treeNode[type] = b
                // 处理节点的层级关系
                if (treeNode.childOrgs) {
                    treeNode.childOrgs.forEach((childNode) => {
                        this.changeSubTreeState(childNode, type, b) // 继续遍历子节点
                    })

                }
            },

            /**
             * 根据orgId改变状态
             */
            changeStateByOrgId(orgId, treeNode, type, b) {
                if (treeNode.orgId === orgId) {
                    treeNode[type] = b
                }

                // 处理节点的层级关系
                if (treeNode.childOrgs) {
                    treeNode.childOrgs.forEach((childNode) => {
                        this.changeStateByOrgId(orgId, childNode, type, b) // 继续遍历子节点
                    })

                }
            },

            /**
             * 生成businessList
             */
            pickBusinessList(treeNode) {

                if (treeNode.JY) {
                    this.businessListData.push({
                        orgId: treeNode.orgId,
                        businessCode: "JY",
                        orgType: treeNode.orgType
                    })
                }
                if (treeNode.DC) {
                    this.businessListData.push({
                        orgId: treeNode.orgId,
                        businessCode: "DC",
                        orgType: treeNode.orgType
                    })
                }
                if (treeNode.BX) {
                    this.businessListData.push({
                        orgId: treeNode.orgId,
                        businessCode: "BX",
                        orgType: treeNode.orgType
                    })
                }
                if (treeNode.BY) {
                    this.businessListData.push({
                        orgId: treeNode.orgId,
                        businessCode: "BY",
                        orgType: treeNode.orgType
                    })
                }

                if (treeNode.childOrgs && treeNode.childOrgs.length > 0) {
                    for (let i = 0; i < treeNode.childOrgs.length; i++) {
                        this.pickBusinessList(treeNode.childOrgs[i])
                    }
                }
            },

            async show(isEdit, juri) {
                if (isEdit) {
                    this.remoteData = (await api.constructTree({})).data[0]
                    this.businessList = (await api.getUserMissionId({})).data
                    this.businessObj = this.businessListConvertToObj(this.businessList)
                    if (this.remoteData) this.remoteData.level = 0
                    this.formatTree(this.remoteData)
                    this.computeTableData()
                    // 根据编辑信息的权限，重现权限选择
                    juri.forEach((juriItem) => {
                        this.changeStateByOrgId(juriItem.orgId, this.remoteData, juriItem.businessCode, true)
                    })
                } else {
                    this.remoteData = (await api.constructTree({})).data[0]
                    this.businessList = (await api.getUserMissionId({})).data
                    this.businessObj = this.businessListConvertToObj(this.businessList)
                    if (this.remoteData) this.remoteData.level = 0
                    this.formatTree(this.remoteData)
                    this.computeTableData()
                }
                let myList = ['DC', "BX", "JY", "BY"]
                myList.forEach((type) => {
                    this.deepSearchTree(this.remoteData, type)
                })

            },

            /**
             * 获取权限列表
             */
            getBusinessList() {
                this.businessListData = [];
                this.pickBusinessList(this.remoteData)
                return this.businessListData
            }

        }


    }
</script>

<style scoped>
    .expend-btn {
      position: absolute;
      top: 0;
      left: 26px;
      height: 100%;
    }
    .my-table-title {
      font-size: 14px;
      color: #333333;
    }
    .level1 {
      padding-left: 36px;
    }
    .level2 {
      padding-left: 54px;
    }
    .level3 {
      padding-left: 72px;
    }
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 99;
      top: 0;
      left: 0;
    }
    /deep/ .myClass .el-checkbox__input span::before{
        background-color: #409EFF !important;
        border-color: #409EFF !important;
    }
</style>