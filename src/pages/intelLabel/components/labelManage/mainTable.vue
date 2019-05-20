<template>
    <el-main>
        <div class="lb-manage-table" v-loading="table_loading">
            <el-table
                ref="lbManageTable"
                :max-height="tableMaxHeight"
                tooltip-effect="dark"
                highlight-current-row
                :data="lb_manage_data"
                @selection-change="lbManageChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop='tagName' label='中文名称' />
                <el-table-column prop='tagDesc' label='标签描述' />
                <el-table-column prop='tagType' label='标签性质' />
                <el-table-column prop='objectName' label="业务域" />
                <el-table-column prop="tagState" label="启用/禁用">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.tagState"
                            active-color="#5A8CFF"
                            inactive-color="#dcdfe6"
                            @change="switchChange(scope.row,scope.$index)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bt-el-ct" v-if="lb_manage_data.length!=0">
                <el-button class="common-button" type="primary" @click="batchSwitch('start',1)">批量启动API</el-button>
                <el-button class="common-button" type="primary" @click="batchSwitch('close',0)">批量禁用API</el-button>
            </div>
            <div class="t-page">
                <el-pagination
                    class="vk-pg-ct"
                    v-if="pageTotal!=0"
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="pageTotal"
                    :page-size="pageSize"
                    :current-page.sync="currentPage"
                    @size-change="pnSizeChange"
                    @current-change="pnCurrentChange"
                />
            </div>
        </div>
    </el-main>
</template>

<script>
import api from '@/api/';
import { mapState } from 'vuex';
import { isEmpty, findIndex } from 'lodash';

export default {
    data(){
        return{
            table_loading: true,
            lb_manage_data: [],
            checkboxSelected: [],
            class1Id: '',
            class2Id: '',
            pageTotal: 0,
            currentPage: 1,
            pageSize: 10,
        }
    },
    mounted(){
    },
    watch: {
        labelValue(newVal){
            // console.log(newVal)
        },
        treeNodeIdObj(newVal){
            if(newVal.class1Id == 'empty'&&newVal.class2Id == 'empty'){
                this.pageTotal = 0;
                this.currentPage = 1;
                this.pageSize = 10;
                this.lb_manage_data = [];
            }else{
                this.table_loading = true;
                this.class1Id = newVal.class1Id;//父级classId
                this.class2Id = newVal.class2Id;//子级classId
                this.getTagManageTable(newVal.class1Id,newVal.class2Id,1,10);
            }
        }
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 250
        },
        labelValue(){
            return this.$store.state.home.labelValue;
        },
        treeNodeIdObj(){
            return this.$store.state.home.treeNodeIdObj;
        }
    },
    
    methods: {
        //通用提醒
        commonAlert(res){
            this.$notify({
                title: res.success?'成功':'错误',
                message: res.message,
                type: res.success?'success':'error'
            });
        },
        //全选change
        lbManageChange(val){
            this.checkboxSelected = val;
        },
        //根据标签类目查询标签
        getTagManageTable(class1Id,class2Id,pageNo,pageSize){
            api.tagManageSearch({
                class1Id,
                class2Id,
                pageNo,
                pageSize
            }).then(res => {
                if(res.success){
                    res.data.data.forEach(res => {
                        res.tagState = res.tagState==1?true:false;
                        res.tagType = res.tagType==1?'原子标签':res.tagType==2?'衍生标签':'自定义标签';
                    })
                    
                    this.$store.dispatch('setCurrentDataLen',res.data.total);//无数据可删除
                    this.pageTotal = res.data.total;
                    this.lb_manage_data = res.data.data;
                    this.table_loading = false;
                }else{
                    this.commonAlert(res)
                }
            })
        },
        //开关改变
        switchChange(val){
            api.tagStatuSingle({
                tagId: val.id,
                status: val.tagState?1:0,
            }).then(res => {
                this.commonAlert(res);
            })
        },
        //批量开启开关
        batchSwitch(type, status){
            const tagIds = this.checkboxSelected.map(res => {
                return res.id
            })//批量开始的id

            if(isEmpty(tagIds)){
                this.$message.error('请选择标签')
            }else{
                api.tagStatubatch({
                    tagIds,
                    status: status,
                }).then(res => {
                    if(res.success){
                        this.checkboxSelected.forEach(res => {
                            this.$refs.lbManageTable.data[findIndex(this.lb_manage_data,['id',res.id])].tagState = type=='start'?true:false;
                        })
                    }else{}
                    this.commonAlert(res);
                })
            }
        },
        //分页器size大小
        pnSizeChange(val){
            const { currentPage, pageSize, class1Id, class2Id } = this;

            this.table_loading = true;
            this.pageSize = val;
            this.currentPage = 1;//重置到第一页
            this.getTagManageTable(class1Id,class2Id,1,val);
        },
        //分页器页码改变
        pnCurrentChange(val){
            const { currentPage, pageSize, class1Id, class2Id  } = this;

            this.table_loading = true;
            this.currentPage = val;
            this.getTagManageTable(class1Id,class2Id,val,pageSize)
        },
    }
}
</script>

<style lang="scss">
    .common-button{
        background:#5A8CFF;
    }
    .lb-manage-table{
        .bt-el-ct{
            float: left;
            margin: 20px 0 0 0;
        }
        .t-page{
            text-align: right;
            padding: 20px 0px 0px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
        }
    }
</style>
