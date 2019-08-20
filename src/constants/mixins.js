import { indexOf } from "lodash";

export default {
  data() {
    return {
      basicSearch: [
        {
          action: "equals",
          child: [
            {
              type: 1,
              result: "stsin"
            },
            {
              type: 2,
              result: "num"
            },
            {
              type: 3,
              result: "str"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        },
        {
          action: "not_equals",
          child: [
            {
              type: 1,
              result: "stsin"
            },
            {
              type: 2,
              result: "num"
            },
            {
              type: 3,
              result: "str"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        },
        {
          action: "contains",
          child: [
            {
              type: 1,
              result: "stmuti"
            }
          ]
        },
        {
          action: "not_contains",
          child: [
            {
              type: 1,
              result: "stmuti"
            }
          ]
        },
        {
          action: "between",
          child: [
            {
              type: 2,
              result: "numRg"
            },
            {
              type: 4,
              result: "dayRg"
            }
          ]
        },
        {
          action: "is_null",
          child: [
            {
              type: 1,
              result: "empty"
            },
            {
              type: 2,
              result: "empty"
            },
            {
              type: 3,
              result: "empty"
            },
            {
              type: 4,
              result: "empty"
            }
          ]
        },
        {
          action: "is_not_null",
          child: [
            {
              type: 1,
              result: "empty"
            },
            {
              type: 2,
              result: "empty"
            },
            {
              type: 3,
              result: "empty"
            },
            {
              type: 4,
              result: "empty"
            }
          ]
        },
        {
          action: "like",
          child: [
            {
              type: 1,
              result: "str"
            },
            {
              type: 2,
              result: "str"
            },
            {
              type: 3,
              result: "str"
            },
            {
              type: 4,
              result: "str"
            }
          ]
        },
        {
          action: "within",
          child: [
            {
              type: 4,
              result: "num"
            }
          ]
        },
        {
          action: "before",
          child: [
            {
              type: 4,
              result: "num"
            }
          ]
        },
        {
          action: "greater",
          child: [
            {
              type: 2,
              result: "num"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        },
        {
          action: "greater_eq",
          child: [
            {
              type: 2,
              result: "num"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        },
        {
          action: "less",
          child: [
            {
              type: 2,
              result: "num"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        },
        {
          action: "less_eq",
          child: [
            {
              type: 2,
              result: "num"
            },
            {
              type: 4,
              result: "day"
            }
          ]
        }
      ]
    };
  },
  methods: {
    //通用提醒
    commonAlert(res) {
      this.$notify({
        title: res.success ? "成功" : "错误",
        message: res.message,
        type: res.success ? "success" : "error"
      });
    },
    //衍生标签第三列表单形式判断 action操作符 type数据类型
    thComponentCheck(actions, types) {
      let result = "";
      //数据类型 1.字典类型;2.数值类型;3.字符串类型;4.日期类型
      this.basicSearch.map(res => {
        if (res.action == actions) {
          res.child.map(item => {
            if (item.type == types) {
              result = item.result;
            }
          });
        }
      });
      return result;
    },
    //每个标签的赋值类型判断
    tagValueTypeCheck(tagType) {
      var uploadType;

      if (_.indexOf(["stsin", "num", "str", "day"], tagType) >= 0) {
        //单值的情况传key=value
        uploadType = "value";
      } else if (tagType == "stmuti") {
        //多值情况下传数组
        uploadType = "listValue";
      } else if (_.indexOf(["numRg", "dayRg"], tagType) >= 0) {
        //多值情况且为两个输入框(最大最小值和时间范围选择器)
        uploadType = ["lvalue", "rvalue"];
      } else if (tagType == "empty") {
        return false;
      }
      return uploadType;
    }
  }
};
