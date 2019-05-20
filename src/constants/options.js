import moment from 'moment';
import questionPng from '@public/assets/imgs/question.svg';

/* 首页折线图（今日成交客户数） */
export const indexBodyOption = {
    title: {
        text: '',
        subtext: '31,899',
        left: 17,
        top: 17,
        triggerEvent: true,
        textStyle: {
            fontFamily: 'PingFang SC',
            fontSize: '18',
            color: '#000000',
            rich: {
                a: {
                    backgroundColor: {
                        image: questionPng
                    },
                    fontSize: 16
                }
            }
        },
        subtextStyle: {
            fontFamily: 'DIN Condensed',
            fontSize: '40',
            color: '#000'
        }
    },
    color: ['rgb(57,123,255,0.8)'],
    tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: '#FFF',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        textStyle: {
            color: '#000'
        },
        formatter: function (params, ticket, callback) {
            return '<div>' +
                '<div style="color: #999999">' + params[0].axisValue + '</div>' +
                '<div style="color: #000000;font-size: 18px;font-family: DIN Condensed;">' + params[0].data + '</div>'
                + '</div>'
        }
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: 0,
        top: 80
    },
    xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        show: false,
    },
    series: [{
        symbol: 'none',
        data: [],
        type: 'line',
        areaStyle: {}
    }]
};
/* 仪表图（浓度，满意度） */
export const deepConcenOption = {
    title: {
        text: '',
        padding: [17, 17, 17, 17],
        triggerEvent: true,
        textStyle: {
            rich: {
                a: {
                    backgroundColor: {
                        image: questionPng
                    },
                    fontSize: 16
                }
            }
        }
    },
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
        name: '业务指标',
        type: 'gauge',
        startAngle: 200,
        endAngle: -25,
        radius: '50%',
        center: ['50%', '70%'],
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
        },
        markLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                width: 15,
                color: [
                    [0.17, '#f5f5f5'],
                    [0.18, '#fff'],
                    [0.19, '#f5f5f5'],
                    [0.20, '#fff'],
                    [0.37, '#f5f5f5'],
                    [0.38, '#fff'],
                    [0.39, '#f5f5f5'],
                    [0.40, '#fff'],
                    [0.57, '#f5f5f5'],
                    [0.58, '#fff'],
                    [0.59, '#f5f5f5'],
                    [0.60, '#fff'],
                    [0.77, '#f5f5f5'],
                    [0.78, '#fff'],
                    [0.79, '#f5f5f5'],
                    [0.80, '#fff'],
                    [1, '#f5f5f5']
                ]
            }
        },
        pointer: {
            width: "3%",
            length: '90%',
            color: "black"
        },
        itemStyle: {
            normal: {
                color: "rgba(255, 255, 255, 0.8)",
                shadowBlur: 20
            }
        },
        //仪表盘详情，用于显示数据。
        detail: {
            show: false,
        },

    }, {
        name: '业务指标',
        type: 'gauge',
        startAngle: 200,
        endAngle: -25,
        center: ['50%', '70%'],
        detail: {
            fontFamily: 'DIN Condensed',
            color: '#000',
            fontSize: '35',
            formatter: '{value}%',
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
        },
        markLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                width: 20,
                shadowBlur: 0,
                color: [
                    [1, '#397bff']
                ]
            }
        },
        pointer: {
            show: true,
            width: "5%",
            length: '20%',
        },
        itemStyle: {
            normal: {
                color: '#ffffff',
                borderColor: '#397bff',
                borderWidth: 3,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
            }
        },
        data: [{
            value: 50,
        }]

    }]
};

/* 客户旅程折线图 */
export const tourLineOption = {
    color: ['rgb(57,123,255,0.8)'],
    tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: '#FFF',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        textStyle: {
            color: '#000'
        },
        formatter: function (params, ticket, callback) {
            return '<div>' +
                '<div style="color: #999999">' + params[0].data.evaluateDate + '</div>' +
                '<div style="color: #000000;font-size: 16px;font-weight:bold;">' + params[0].data.evaluateEvent + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#5dd089;font-size: 14px;">' + params[0].data.value + '</span></div>'
                + '</div>'
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '5%'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        nameGap: 16,
        nameTextStyle: {
            color: '#666',
            fontSize: 14
        },
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#E9E9E9'
            }
        },
        data: []
    },
    yAxis: {
        type: 'category',
        // nameLocation: 'end',
        nameTextStyle: {
            color: '#333',
            fontSize: 16
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed'
            }
        },
        data: [
            { value: '满意', textStyle: { color: '#333' } },
            { value: '一般', textStyle: { color: '#333' } },
            { value: '不满意', textStyle: { color: '#333' } }
        ],

    },
    series: [{
        // symbol: 'roundRect',
        symbolSize: 8,
        data: [],
        type: 'line',
        areaStyle: {}
    }]
};

var itemStyle = {
    normal: {
        color: '#397bff',
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(255, 255, 255, 0.5)'
    }
};
export const scatterOption = {
    backgroundColor: '#FFF',
    color: ['#397bff', '#5dd089'],
    legend: {
        y: 'top',
        data: ['线下行为', '线上行为'],
    },
    textStyle: {
        color: '#666666'
    },
    grid: {
        x: '10%',
        x2: '10%',
        y: '15%',
        y2: '15%'
    },
    tooltip: {
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1,
        formatter: function (formatterData) {
            let str = '';
            let hour = Math.floor(formatterData.data[1] / 60 / 60)
            let minute = Math.floor(formatterData.data[1] / 60 % 60)
            if (hour <= 9) {
                hour = '0' + hour
            }
            if (minute <= 9) {
                minute = '0' + minute
            }

            let circle = ''
            if (formatterData.seriesName != "线上行为") {
                circle = '<div style="display:inline-block;width:14px;height:14px;background-color:#397bff;border-radius:20px;"></div> '
            } else {
                circle = '<div style="display:inline-block;width:14px;height:14px;background-color:#5dd089;border-radius:20px;"></div> '
            }

            let ele = '<div style="font-size: 16px;padding: 8px;text-align: left;">'
                + formatterData.data[0] + '  ' + hour + ':' + minute + '<br>'
                + circle
                + formatterData.seriesName + '：' + formatterData.data[4];
            + '</div>'
            str = str + ele;
            return str
        }
    },
    xAxis: {
        type: 'time',
        name: '',
        nameGap: 16,
        nameTextStyle: {
            color: '#666',
            fontSize: 14
        },
        min: 'dataMin',
        max: 'dataMax',
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#E9E9E9'
            }
        },
        axisLabel: {
            interval: 0,
            rotate: -30,
            formatter: (value, index) => {
                const resultTime = moment(value).format('YYYY/MM/DD')
                return resultTime
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '',
        nameLocation: 'end',
        nameGap: 20,
        min:"dataMin",
        max:"dataMax",
        nameTextStyle: {
            color: '#333',
            fontSize: 12
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgba(225,219,219,0.8)"
            }
        },
        splitLine: {
            show: false,
            lineStyle: {
                type: 'dashed'
            }
        },
        axisLabel: {
            formatter: (value, index) => {
                let hour = Math.floor(value / 60 / 60)
                let minute = Math.floor(value / 60 % 60)
                if (hour <= 9) {
                    hour = '0' + hour
                }
                if (minute <= 9) {
                    minute = '0' + minute
                }

                return hour + ':' + minute
                // return moment(value).format('HH:MM')
            }
        }
    },
    visualMap: [
        {
            show: false,
            calculable: true,
            precision: 0.1,
            dimension: 2,
            inRange: {
                symbolSize: [20, 80]
            }
        },
    ],
    series: [
        {
            name: '线下行为',
            // symbolSize: 50,
            label: {
                normal: {
                    show: true,
                    formatter: '{@[3]}',
                    color: '#fff',
                    textStyle: {
                        fontSize: '12'
                    }
                },
            },
            type: 'scatter',
            itemStyle: {
                color: 'rgba(57,123,255,1)',
                normal: {
                    opacity: 0.8,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowColor: 'rgba(255, 255, 255, 0.5)'
                }
            },
            data: []
        },
        {
            name: '线上行为',
            // symbolSize: 50,
            label: {
                normal: {
                    show: true,
                    formatter: '{@[3]}',
                    color: '#fff',
                    textStyle: {
                        fontSize: '12'
                    }
                },
            },
            type: 'scatter',
            itemStyle: {
                color: '#5dd089',
                normal: {
                    opacity: 0.8,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowColor: 'rgba(255, 255, 255, 0.5)'
                }
            },
            data: []
        }
    ]
}


var symbols = [
    'path://M512.009143 115.2m-115.2 0a115.2 115.2 0 1 0 230.4 0 115.2 115.2 0 1 0-230.4 0Z M794.706286 546.925714L691.154286 283.428571c-9.508571-24.210286-23.771429-32.091429-61.074286-32.091428l-43.885714 0.768v0.182857h-148.498286v-0.182857l-43.885714-0.768c-37.229714 0-51.547429 7.881143-61.074286 32.091428L229.293714 546.925714a47.085714 47.085714 0 0 0 26.605715 61.056 47.104 47.104 0 0 0 61.074285-26.605714l67.529143-184.045714-0.201143 94.116571c-0.164571 1.645714-0.237714 3.328-0.237714 5.010286v473.6a53.942857 53.942857 0 0 0 53.942857 53.942857 53.942857 53.942857 0 0 0 53.942857-53.942857V629.028571h40.228572v341.028572a53.942857 53.942857 0 0 0 53.942857 53.942857 53.942857 53.942857 0 0 0 53.942857-53.942857v-473.6V398.628571l67.017143 182.710858A47.104 47.104 0 0 0 794.706286 546.925714z',
    'path://M370.746111 619.789474 350.515071 781.89264C348.717467 796.296117 359.279754 808.421053 374.175663 808.421053L404.210526 808.421053 404.210526 970.237594C404.210526 999.946165 428.317115 1024 458.0541 1024L565.945899 1024C595.89507 1024 619.789474 999.929751 619.789474 970.237594L619.789474 808.421053 649.819101 808.421053C664.669502 808.421053 675.308218 796.543879 673.479693 781.89264L653.248652 619.789474 682.77044 619.789474C712.866026 619.789474 732.361502 596.125903 726.556685 566.935412L683.042447 348.116795C671.470428 289.924956 613.539552 242.526316 553.705367 242.526316L470.294124 242.526316C410.502918 242.526316 352.553757 289.800782 340.957044 348.116795L297.442805 566.935412C291.625247 596.189974 311.241758 619.789474 341.22905 619.789474L370.746111 619.789474ZM512 215.578947C571.530483 215.578947 619.789474 167.319956 619.789474 107.789474 619.789474 48.258991 571.530483 0 512 0 452.469517 0 404.210526 48.258991 404.210526 107.789474 404.210526 167.319956 452.469517 215.578947 512 215.578947Z',
];
var bodyMax = 100;
export const pictOption = {
    title: {
        text: '',
        left: 'center',
    },
    tooltip: {
        show: true,
        formatter: "{b}:({c}%)"
    },
    xAxis: {
        data: ['男性占比', '女性占比'],
        show: false
    },
    yAxis: {
        max: bodyMax,
        offset: 20,
        show: false
    },
    grid: {
        top: 'center',
        height: 120,
        width: 140
    },
    series: [{
        name: '',
        type: 'pictorialBar',
        symbolClip: true,
        symbolBoundingData: bodyMax,
        data: [{
            name: '男性',
            value: '',
            itemStyle: {
                normal: {
                    color: '#6292FF'
                }
            },
            symbol: symbols[0]
        }, {
            name: '女性',
            value: '',
            itemStyle: {
                normal: {
                    color: '#957EFB'
                }
            },
            symbol: symbols[1]
        }],
        z: 10
    }, {
        name: '',
        type: 'pictorialBar',
        symbolBoundingData: bodyMax,
        animationDuration: 0,
        tooltip: {
            show: false,
            formatter: "{b}:({c}%)"
        },
        itemStyle: {
            normal: {
                color: '#ccc'
            }
        },
        data: [{
            value: '',
            symbol: symbols[0]
        }, {
            value: '',
            symbol: symbols[1]
        }]
    }]
};

export const liquidOption = {
    series: [{
        type: 'liquidFill',
        // data: [0.6, 0.5, 0.4, 0.3],
        data: [0.4],
        direction: 'right', //波浪方向或者静止
        radius: '80%',
        // 水球颜色
        color: ['#00c2ff'],
        center: ['50%', '45%'], //水球位置
        // outline  外边
        outline: {
            // show: false
            borderDistance: 0, //内环padding值
            itemStyle: {
                borderWidth: 2, //圆边线宽度
                borderColor: '#00c2ff',
            },
        },
        label: {
            normal: {
                // formatter: '', //重置百分比字体为空
                // textStyle: {
                color: '#000',
                insideColor: 'yellow',
                fontSize: 10
                // }
            }
        },
        // 内图 背景色 边
        backgroundStyle: {
            color: '#fff',
            // borderWidth: 5,
            // borderColor: 'red',
        }
    }]
}
/* 首页饼图信息 */
export const homePieOption = {
    title: {
        text: '',
        triggerEvent: true,
        textStyle: {
            rich: {
                a: {
                    backgroundColor: {
                        image: questionPng
                    },
                    fontSize: 16
                }
            }
        }
    },
    color: ['#397bff', '#5dd089', '#783cff', '#ff6a9d', '#ffc04b','#C0DE6B', '#6AD6FF', '#c10cc7'],
    tooltip: {
        backgroundColor: '#FFF',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        trigger: 'item',
        formatter: function (params, ticket, callback) {
            return '<div>' +
                '<div style="color: #999999">' + params.data.name + '</div>' +
                '<div style="color: #000000;font-size: 18px;font-family: DIN Condensed;">' + params.data.truValue + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:16px;color:#397bff;">' + params.data.value + '%</span></div>'
                + '</div>'
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '6%',
        containLabel: true
    },
    legend: {
        orient: "horizontal",
        left: '0',
        bottom: '10',
        icon: "roundRect",
        itemWidth: 15,
        textStyle: {
            width: '14',
            height: '14'
        },
        data: []
    },
    series: [
        {
            type: 'pie',
            center: ['55%', '45%'],
            radius: ['60%', '45%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            label: {
                show: true,
                normal: {
                    show: true,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle: { // 此配置
                normal: {
                    borderWidth: 3,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 2,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            data: []
        }
    ]
}

/* 客群分析饼图 */
export const labelPieOption = {
    title: {
        text: ''
    },
    color: ['#397bff', '#5dd089', '#783cff', '#ff6a9d', '#ffc04b','#C0DE6B', '#6AD6FF', '#c10cc7'],
    tooltip: {
        backgroundColor: '#FFF',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        trigger: 'item',
        formatter: function (params, ticket, callback) {
            return '<div>' +
                '<div style="color: #999999">' + params.data.name + '</div>' +
                '<div style="color: #000000;font-size: 18px;font-family: DIN Condensed;">' + params.data.value + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:16px;color:#397bff;">' + params.percent + '%</span></div>'
                + '</div>'
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '6%',
        containLabel: true
    },
    legend: {
        orient: "horizontal",
        left: '0',
        bottom: '10',
        icon: "roundRect",
        itemWidth: 15,
        textStyle: {
            width: '14',
            height: '14'
        },
        data: []
    },
    series: [
        {
            type: 'pie',
            center: ['55%', '45%'],
            radius: ['60%', '45%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            label: {
                show: true,
                normal: {
                    show: true,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle: { // 此配置
                normal: {
                    borderWidth: 3,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 2,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            data: []
        }
    ]
}

export const pieOption = {
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color: ["#4a97d9",
        "#96de65",
        "#34cfc9",
        "#597ef7",
        "#3fa9ff",
    ],
    legend: {
        orient: "vertical",
        x: "left",
        left: '15',
        top: '50',
        icon: "circle",
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
    },
    series: [{
        name: "",
        type: "pie",
        radius: ["100%", "70%"],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: "center"
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: "30",
                    fontWeight: "bold"
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 335,
            name: "直接访问"
        },
        {
            value: 310,
            name: "邮件营销"
        },
        {
            value: 234,
            name: "联盟广告"
        },
        {
            value: 135,
            name: "视频广告"
        },
        {
            value: 1548,
            name: "搜索引擎"
        }
        ]
    }]
};

//
export const hbarOption = {
    title: {
        top: '17',
        left: '20',
        text: '标签分布',
        textStyle: {
            fontSize: '16',
            color: '#333'
        }
    },
    color: ['#1890FF', '#36CBCB', '#957EFB', '#7AC9FF'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        top: '17',
        right: '10',
        data: ['原子标签', '衍生标签', '自定义标签']
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '30%',
        bottom: '6%',
        containLabel: true
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        // feature: {
        //     mark: {show: true},
        //     dataView: {show: true, readOnly: false},
        //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //     restore: {show: true},
        //     saveAsImage: {show: true}
        // }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false },
            data: []
        }
    ],
    yAxis: [
        {
            name: '标签数',
            type: 'value',
            axisTick: { show: false },
            axisLine: { show: false },
            splitLine: {
                lineStyle: {
                    color: '#e9e9e9'
                }
            }
        }
    ],
    series: [
    ]
};

//首页柱状图数据
export const indexbarOption = {
    title: {
        text: '',
        triggerEvent: true,
        textStyle: {
            rich: {
                a: {
                    backgroundColor: {
                        image: questionPng
                    },
                    fontSize: 16
                }
            }
        }
    },
    color: [
        "#4a97d9",
        "#96de65",
        "#34cfc9",
        "#597ef7",
        "#3fa9ff",
        "#C0DE6B",
        "#6AD6FF",
        "#c10cc7"
    ],
    legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        data: [],
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        },
    },
    grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: "category",
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        nameTextStyle: {
            color: "#404040",
        },
        axisLabel: {
            color: "#404040",
            nameLocation: 'start',
            interval: 0,
            rotate: 30
        },
        axisLine: {
            lineStyle: {
                color: '#bfbfbf'
            }
        },
    }],
    yAxis: [{
        type: "value",
        name: '',
        axisTick: false,
        axisLabel: {
            color: "#bfbfbf"
        },
        nameTextStyle: {
            color: "#bfbfbf"
        },
        axisLine: false,
        splitLine: {
            lineStyle: {
                // type: "dotted",
                color: '#f5f5f5'
            }
        }
    }],
    series: [{
        name: "",
        type: "bar",
        barWidth: "30%",
        data: []
    }]
};

//直立柱状图数据
export const barOption = {
    title: {
        text: ''
    },
    color: [
        "#4a97d9",
        "#96de65",
        "#34cfc9",
        "#597ef7",
        "#3fa9ff",
    ],
    legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        data: [],
        formatter: '{name}'
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        },
    },
    grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: "category",
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        nameTextStyle: {
            color: "#404040"
        },
        axisLabel: {
            color: "#404040",
            nameLocation: 'start',
            interval: 0,
            rotate: 30
        },
        axisLine: {
            lineStyle: {
                color: '#bfbfbf'
            }
        }
    }],
    yAxis: [{
        type: "value",
        name: '',
        axisTick: false,
        axisLabel: {
            color: "#bfbfbf"
        },
        nameTextStyle: {
            color: "#bfbfbf"
        },
        axisLine: false,
        splitLine: {
            lineStyle: {
                // type: "dotted",
                color: '#f5f5f5'
            }
        }
    }],
    series: [{
        name: "",
        type: "bar",
        barWidth: "30%",
        data: []
    }]
};

//折线图数据
export const lineOption = {
    legend: {
        data: ["用电量"]
    },
    color: ["#4a97d9",
        "#96de65",
        "#34cfc9",
        "#597ef7",
        "#3fa9ff",
    ],
    grid: {
        top: '12%',
        left: "3%",
        right: "6%",
        bottom: "10%",
        containLabel: true
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "cross"
        }
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: [
            "00:00",
            "01:15",
            "02:30",
            "03:45",
            "05:00",
            "06:15",
            "07:30",
            "08:45",
            "10:00",
            "11:15",
            "12:30",
            "13:45",
            "15:00",
            "16:15",
            "17:30",
            "18:45",
            "20:00",
            "21:15",
            "22:30",
            "23:45"
        ],
        axisTick: {
            lineStyle: {
                color: '#bfbfbf'
            }
        },
        axisLabel: {
            color: "#404040"
        },
        axisLine: {
            lineStyle: {
                color: '#bfbfbf'
            }
        }
    },
    yAxis: {
        type: "value",
        axisLabel: {
            formatter: "{value} W"
        },
        axisLabel: {
            color: "#bfbfbf"
        },
        nameTextStyle: {
            color: "#bfbfbf"
        },
        axisLine: false,
        splitLine: {
            lineStyle: {
                type: "dotted",
                color: '#bfbfbf'
            }
        }
    },
    series: [{
        name: "用电量",
        type: "line",
        smooth: true,
        data: [
            300,
            280,
            250,
            260,
            270,
            300,
            550,
            500,
            400,
            390,
            380,
            390,
            400,
            500,
            600,
            750,
            800,
            700,
            600,
            400
        ]
    }]
};

export const mapOption = {
    tooltip: {
        show: true,
        // padding: 10,
        trigger: 'item',
        confine: true,
        textStyle: {
            color: '#000'
        },
        backgroundColor: '#FFF',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        formatter: function (params) {
            if (params.data) return params.name
        },
    },
    // visualMap: {
    //     min: 1,
    //     left: 'left',
    //     top: 'bottom',
    //     // calculable: true,
    //     show:false,
    //     // inRange: {
    //     //     color: ['#3276fe']
    //     // }
    // },
    geo: {
        type: 'map',
        map: 'china',//json数据
        zoom: 1,
        top: 0,
        label: {
            normal: {
                show: false,
            },
            emphasis: {
                show: false,
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#dfe9fe',
                borderColor: '#AEB5E4',
                borderWidth: 1,
            },
            emphasis: {
                areaColor: '#88b0ff',
                borderColor: '#AEB5E4',
                borderWidth: 1,
            }
        },
        // regions: []
    },
    series: [{
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#3276fe'
            }
        },
        data: []
    },{
        type: 'scatter',
        coordinateSystem: 'geo',
        effectType: 'ripple',
        showEffectOn: 'render',
        symbolSize: 8,
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
            normal: {
                color: '#FFF'
            }
        },
        data: '',
    }]
};

export const tagRatioOption = {
    color: ['#1890FF', '#36CBCB', '#957EFB', '#7AC9FF'],
    title: {
        text: '标签占比',
        top: '17',
        left: '20',
        textStyle: {
            fontSize: '16',
            color: '#333'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{b}:({d}%)"
    },
    legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        orient: 'vertical',
        right: 100,
        top: 90,
        itemGap: 20,
        data: [],
        formatter: '{name}'
    },
    series: [
        {
            type: 'pie',
            radius: ['33%', '50%'],
            center: ['35%', '50%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            label: {
                show: true,
                normal: {
                    show: false,
                    position: 'center'
                },

            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            itemStyle: { // 此配置
                normal: {

                    borderWidth: 2,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 2,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: []
        }
    ]
}
export const tagRatioUpOption = {
    color: ['#1890FF', '#36CBCB', '#957EFB', '#7AC9FF'],
    title: {
        top: 17,
        left: 27,
        text: '自定义标签增长',
        textStyle: {
            color: '#333',
            fontSize: '15',
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '30%',
        bottom: '6%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        right: 350,
        top: 20,
        itemGap: 20,
        data: ['客户', '房源', '楼盘', '经纪人'],
        formatter: '{name}'
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '25%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value',
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
            lineStyle: {
                color: '#e9e9e9'
            }
        }
    },
    series: [
        {
            name: '客户',
            type: 'line',
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '房源',
            type: 'line',
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '楼盘',
            type: 'line',
            smooth: true,
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '经纪人',
            type: 'line',
            smooth: true,
            data: [320, 332, 301, 334, 390, 330, 320]
        }
    ]
}