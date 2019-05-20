<template>
    <div class="unbind-table">
        <el-table
            ref="unBindTable"
            v-loading="tableLoading"
            :max-height="tableMaxHeight"
            tooltip-effect="dark"
            highlight-current-row
            :data="bind_table"
        >
            <el-table-column prop='columnName' label='列名' />
            <el-table-column prop='dataType' label='数据类型' />
            <el-table-column prop='comment' label='备注' />
            <el-table-column prop='sourceTable' label='绑定表名' />
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <div class="action-ct">
                        <span class="boe-btn" @click="bindAction(scope.row)">绑定</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="t-page">
            <el-pagination
                background
                :page-sizes="[10, 20, 30, 40]"
                layout="total, prev, pager, next, sizes, jumper"
                :total="pagination.total"
                :page-size="pagination.pageSize"
                :current-page.sync="pagination.current"
                @size-change="pnSizeChange"
                @current-change="pnCurrentChange"
            >
            </el-pagination>
        </div> -->
    </div>
</template>
<script>
import api from '@/api/';
import mixins from '@/constants/mixins';

export default {
    mixins: [mixins],
    props: ['custom_data'],
    data(){
        return{
            tableLoading: false,
            bind_table: [],
            // pagination: {
            //     total: 1,
            //     pageSize: 10,
            //     current: 1
            // }
        }
    },
    watch: {
        custom_data(newVal){
            this.getAtomTagListUnBind(newVal);
        }
    },
    computed: {
        tableMaxHeight(){
            return window.innerHeight - 250
        },
    },
    methods: {
        /* 获取未绑定表格数据 */
        getAtomTagListUnBind(id){
            this.tableLoading = true;
            api.atomTagListUnBind({},id).then(res => {
                if(res.success){
                    this.bind_table = res.data;
                    this.$emit('unBindTotalReturn',res.data)
                }else{
                    this.commonAlert(res);
                }
                this.tableLoading = false;
            })
        },
        /* 绑定标签操作 */
        bindAction(row){
            this.$emit('bindReturn',{
                action: 'new',
                source: row
            })
        },
        /* 页面显示数量改变 */
        pnSizeChange(val){
            this.pagination.pageSize = val;
            console.log(val)
        },
        /* 页码改变 */
        pnCurrentChange(val){
            this.pagination.current = val;
            console.log(val)
        }
    }
}
</script>
<style lang="scss" scoped>
    .unbind-table{
        .t-page{
            text-align: right;
            padding: 20px 20px 0px 0;
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: rgb(90, 140, 255);
            }
        }
    }
</style>
