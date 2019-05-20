<template>
    <div class="groups">
        <div v-if="conditonGroupData.length>1" class="action-relation" @click="onParentChangeAndOr"><span class="text">{{remoteData.op==="and"?"且":"或"}}</span></div>
        <!--  -->
        <div v-if="atomTagList">
            <condition-component v-for="(item, index) in conditonGroupData" :key="index" :conditionGroupItem="item" @plusEvent="plusEvent" @minusEvent="minusEvent" :onMinusConditionGroupItem="onMinusConditionGroupItem" :atomTagList="atomTagList" :conditonGroupData="conditonGroupData"/>
        </div>
    </div>
</template>

<script>
    import Condition from './condition.vue'

    export default {
        name: "conditions-component",
        components: { 'condition-component': Condition },
        props: ['conditonGroupData', 'remoteData', 'onChangeAndOr', 'atomTagList'],
        data() {
            return {
                // selfAtomTagList: this.atomTagList
            }
        },
        mounted(){},
        methods: {
            plusEvent() {

            },
            minusEvent() {

            },
            onParentChangeAndOr() {
                if (this.remoteData.op === "and") {
                    this.onChangeAndOr("or")
                } else {
                    this.onChangeAndOr("and")
                }

            },
            onMinusConditionGroupItem(value) {
                let idx = this.conditonGroupData.indexOf(value)
                this.conditonGroupData.splice(idx, 1);
            }
        }
    }
</script>

<style scoped>
    .groups {
      position: relative;
    }
    .action-relation {
      position: absolute;
      top: 0;
      left: -27px;
      width: 18px;
      height: 100%;
      z-index: 2;
    }
    .text {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      background: #d8e4ff;
      text-align: center;
      cursor: pointer;
      user-select: none;
      height: 25px;
      margin-top: -18px;
      border-radius: 3px;
      color: #5a8cff;
      font-size: 14px;
      font-weight: 700;
      line-height: 25px;
    }
    .action-relation::before {
      content: " ";
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      overflow: hidden;
      background: #d8e4ff;
      left: 8px;
    }
</style>
