<template>
    <div class="vk-lb-mg-ct">   
        <div class="top-floor">
            <el-input
                clearable
                class="search"
                row-key="key"
                placeholder="输入类别名称搜索"
                v-model="search_input"
                @change="inputChange"
                @keyup.enter.native="inputSubmit"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button icon="el-icon-search" plain @click="inputSubmit" type="primary" style="height:31px;">搜索</el-button>
        </div>
        <el-container>
            <side-tree 
                :searchInput="search_input"
            ></side-tree>
            <main-table></main-table>
        </el-container>

        <!-- <div>
            <el-tree
                icon-class="el-icon-circle-plus"
                :props="treeProps"
                :data="tree_data"
                node-key="tagClass"
                :default-expanded-keys="defaultKey"
                :expand-on-click-node="false"
                @node-click="treeNodeClick"	
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                    <el-button
                        type="text"
                        size="normal"
                        @click="() => addNewLabelType('edit',node,data)">
                        编辑
                    </el-button>
                    </span>
                </span>
            </el-tree>
        </div> -->
    </div>
</template>
<script>
import api from '@/api/';
import { mapState } from 'vuex';
import SideTree from './sideTree';
import MainTable from './mainTable';
import { findIndex, indexOf } from 'lodash';

export default {
    components: {
        "side-tree": SideTree,
        "main-table": MainTable,
    },
    data(){
        return{
            search_input: '',
            defaultKey: [],
            selectOption: [],
            select_data: [],
            select_data_arr: [],
        }
    },
    mounted(){
        // this.getTagManageTree('');
    },
    computed: mapState({
        treeListLen: state => state.home.treeListLen,
    }),
    methods: {
        //搜索框输入
        inputChange(val){
            this.search_input = val;
        },
        inputSubmit(e){
            const { search_input } = this;

            this.$store.dispatch('changeLabelValue',search_input);
        },
    }
}
</script>
<style lang="scss">
    .vk-lb-mg-ct{
        height: 100%;
        background: #fff;
        .top-floor{
            padding: 20px 28px;
            .search{
                width: 220px;
            }
        }
        
        .vk-tr-dialog{
            .el-select{
                width: 100%;
            }
        }
    }
</style>
