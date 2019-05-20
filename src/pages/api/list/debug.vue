<template>
  <div class="content ">
    <el-row>
      <el-col class="debug-left" :span="12">
      <p> <span class="field-des">API Name</span><span class="field-val"> SERVER01</span></p>
      <p> <span class="field-des">版本号：</span><span class="field-val"> 1.0.0</span></p>
      <p><span class="field-des">参数：</span></p>
      <div class='params'>
       <el-tree
        v-loading="isLoad"
        :data="treeData"
        node-key="id"
        v-if="!isLoad"
        default-expand-all
        :expand-on-click-node="false">
        <span class="tree-node-param" slot-scope="{ node, data }">
          <span><span style="color: #000000;opacity: 0.85;">{{ data.label }}:</span><span style="color: #000000;opacity:0.65">{{data.value}}</span></span>
          <span class="debug-btn">
            <i class="el-icon-edit" @click="edit(node,data)"></i>
            <i class="iconfont icon-copy" @click="copy(node,data)"></i>
            <i class="el-icon-delete" @click="del(node, data)"></i>
            </span>
         </span>
        </el-tree>
      </div>
      <div><el-button type="primary"  size="small" @click="send()">发送测试</el-button></div>
      </el-col>
      <el-col class="debug-right" :span="12">
         <div class=right-btn>
            <el-button type="primary"  size="small" @click="formatText('json')">格式化JSON</el-button>
            <el-button type="primary" size="small" @click="formatText('wsdl')">格式化WSDL</el-button>
         </div>
         <div class="right-content">
                <codemirror class="code-mirror" ref="myCm"
                    :value="formatStr"
                    :options="mirrorOption"
                    >
               </codemirror>
           </div>
       </el-col>
    </el-row>
    <debug-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :data="dialogData"
      @update:visible="updateVisible"
      @update:data="updateData"
    ></debug-dialog>
  </div>
</template>
<script>
import utils from "@/utils";
import api from "@/api";
import DebugDialog from "./component/debugDialog";
const _ = require("lodash");
const xml = require("xml");
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import { setTimeout } from "timers";
let  id = 1000;
export default {
  components: {
    "debug-dialog": DebugDialog,
    codemirror
  },
  data() {
    return {
      treeData: [],
      dialogVisible: false,
      dialogTitle: "修改",
      dialogData: {},
      formatStr: "",
      debugResutl: [],
      isLoad: false,
      mirrorOption: {
        mode: "JSON-LD",
        indentUnit: 2, // 缩进单位，默认2
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true
      }
    };
  },
  methods: {
    send() {
      this.debugResutl = [
        {
          toys: [{ toy: "Transformers" }, { toy: "GI Joe" }, { toy: "He-man" }]
        }
      ];
      this.formatText('json');
    },
    formatText(flag) {
      if (flag == "json") {
        this.formatStr = utils.formatJson(JSON.stringify(this.debugResutl));
      } else {
        this.formatStr = `\n${xml(this.debugResutl, true)}`;
      }
    },
    updateVisible() {
      this.dialogVisible = false;
    },
    updateData(val) {
      let tempData = this.treeData,
        curNode = this.dialogData;
      let loopUpdate = data => {
        data.forEach(item => {
          if (item.id == curNode.id) {
            item.value = val;
          }
          if (item.children) {
            loopUpdate(item.children);
          }
        });
        return data;
      };
      this.treeData = loopUpdate(tempData);
      this.dialogVisible = false;
    },
    edit(node, data) {
      this.dialogData = data;
      this.dialogVisible = true;
    },
    copy(node, curNode) {
      this.isLoad = true;
      let tempData = this.treeData;
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === curNode.id);
      children.splice(index, 0,utils.initTree([_.cloneDeep(curNode)],`${++id}_`)[0]);
      setTimeout(()=>{
        if(!parent.data.children){
           this.treeData=children;
        }else{
           this.treeData=this.setChild(children,parent);
        }
        this.isLoad = false;
      },0)
    },
    del(node, curNode) {
      this.isLoad = true;
      let tempData = this.treeData;
      let levelArr = curNode.id.match(/\^*\d_/g);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === curNode.id);
      children.splice(index, 1);
      setTimeout(() => {
        if(!parent.data.children){
          this.treeData = children;
        } else {
          this.treeData=this.setChild(children,parent);
        }
        this.isLoad = false;
      }, 10);
    },
    setChild(children,parent){
      let loopChild = data => {
            data.forEach(item => {
              if (item.id == parent.data.id) {
                item.children = children;
                return;
              }
              if(item.children){
                loopChild(item.children);
              }
            });
            return data;
        };
         return loopChild(this.treeData);
    }

  },
  mounted() {
    api.getTreeData({}).then(ret => {
      this.treeData = utils.initTree(ret.data, "");
    });
  },
};
</script>
<style lang="scss">
.tree-node-param {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.debug-left {
  p {
    margin-bottom: 25px;
  }
  .params {
    min-height: 160px;
    padding-right: 10px;
    padding-bottom: 35px;
  }
  .debug-btn {
    i {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.debug-right {
  .right-content {
    height: 600px;
    margin-top: 25px;
    background: #bfbfbf;
    .CodeMirror {
      height: 600px;
      background: #bfbfbf;
    }
  }
}
</style>


