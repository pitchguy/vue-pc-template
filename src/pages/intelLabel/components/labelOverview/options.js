export const viewPieOption = {
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
        data: []
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
                show: false,
                textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: []
    }]
};

export const scatterOption = {
    grid: {
        show: false,
        top: 10,
        bottom: 10
    },
    xAxis: [{
        gridIndex: 0,
        type: 'value',
        show: false,
        min: 0,
        max: 100,
        nameLocation: 'middle',
        nameGap: 5
    }],
    yAxis: [{
        gridIndex: 0,
        min: 0,
        show: false,
        max: 100,
        nameLocation: 'middle',
        nameGap: 30
    }],
    series: [{
        type: 'scatter',
        symbol: 'circle',
        label: {
            normal: {
                show: true,
                formatter: '{b}',
                textStyle: {
                    fontSize: '14px',
                }
            },
        },
        data: []
    }]
}

export const wordCloudOption = {
    tooltip: {},
    series: [{
        type: 'wordCloud',
        gridSize: 18,
        sizeRange: [12, 30],
        rotationRange: [0, 0],
        shape: 'smooth',
        textStyle: {
            normal: {
                color: function(){
                    return ['#397bff', '#5dd089', '#783cff', '#ff6a9d', '#ffc04b','#C0DE6B', '#6AD6F'][Math.round(Math.random()*7)]
                }
                // color: function() {
                //     return 'rgb(' + [
                //         Math.round(Math.random() * 160),
                //         Math.round(Math.random() * 160),
                //         Math.round(Math.random() * 160)
                //     ].join(',') + ')';
                // }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: []
    }]
}