<template>
    <div class="app-container">
        <el-row type="flex" justify="space-around" class="panel-group">
        <el-col :span="7" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <i class="el-icon-delete iconfont"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">任务数量</div>
              <count-to :start-val="0" :end-val="15" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :span="7" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <i class="el-icon-warning iconfont"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">调度次数</div>
              <count-to :start-val="0" :end-val="99" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
        <el-col :span="7" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <i class="el-icon-question iconfont"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">执行器数量</div>
              <count-to :start-val="0" :end-val="99" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- echarts -->
      <el-row type="flex" align='middle'>
        <el-col :span="12">
          <div id="echartId" style="width:100%;height:600px"/>
        </el-col>
        <el-col :span="12">
          <div id="echartIds" style="width:100%;height:600px;background:#fff"/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import echarts from "echarts";
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo
  },
  data() {
    return {
      chart: null,
      charts: null
    };
  },
  mounted() {
    this.initChart();
    this.initCharts();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    if (!this.charts) {
      return;
    }
    this.charts.dispose();
    this.charts = null;
  },
  methods: {
    //日期分布图
    initChart() {
      this.chart = echarts.init(document.getElementById("echartId"));
      const xData = (function() {
        const data = [];
        for (let i = 1; i < 13; i++) {
          data.push(i + "month");
        }
        return data;
      })();
      this.chart.setOption({
        backgroundColor: "#344b58",
        title: {
          text: "日期分布图",
          x: "20",
          top: "20",
          textStyle: {
            color: "#fff",
            fontSize: "22"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        grid: {
          left: "5%",
          right: "5%",
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: "#fff"
          }
        },
        legend: {
          x: "5%",
          top: "10%",
          textStyle: {
            color: "#90979c"
          },
          data: ["失败", "成功", "进行中"]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#90979c"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5"
            },
            textStyle: {
              color: "#fff"
            },
            borderColor: "#90979c"
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ],
        series: [
          {
            name: "失败",
            type: "bar",
            stack: "total",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff"
                  },
                  position: "insideTop",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: [
              709,
              1917,
              2455,
              2610,
              1719,
              1433,
              1544,
              3285,
              5208,
              3372,
              2484,
              4078
            ]
          },

          {
            name: "成功",
            type: "bar",
            stack: "total",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: [
              327,
              1776,
              507,
              1200,
              800,
              482,
              204,
              1390,
              1001,
              951,
              381,
              220
            ]
          },
          {
            name: "进行中",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: [
              1036,
              3693,
              2962,
              3810,
              2519,
              1915,
              1748,
              4675,
              6209,
              4323,
              2865,
              4298
            ]
          }
        ]
      });
    },
    //饼图
    initCharts() {
      this.charts = echarts.init(document.getElementById("echartIds"))

      this.charts.setOption({
        title : {
            text: '成功比例图',
            x:'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['成功', '失败', '进行中']
        },
        calculable: true,
        series: [
          {
            name: '成功比例图',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 150],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '成功' },
              { value: 240, name: '失败' },
              { value: 149, name: '进行中' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .iconfont {
      font-size: 36px;
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      margin-left: 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>