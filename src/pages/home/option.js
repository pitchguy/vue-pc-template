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