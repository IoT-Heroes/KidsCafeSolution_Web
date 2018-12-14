<template>
  <div class="content">
    <!-- <select class="rangeDropdown"> 
      <option value="selectAge">연령선택</option>
      <option value="5">5</option>
      <option value="10">10</option>  
    </select>  -->
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <vue-highcharts :options="userStatics.options" ref="userStaticsCharts"></vue-highcharts>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <vue-highcharts :options="salesStatics.options" ref="salesStaticsCharts"></vue-highcharts>       
      </div>
    </div> 
  </div>
  
</template>

<script>
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';
import Axios from 'axios';


var age_categories= [ 
   '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
]

var current_month = (new Date()).getMonth()+1;

var t_data = [
  0.7537, 0.7535, 0.7559, 0.7631, 0.7644, 0.769, 0.7683, 0.77, 0.7703, 0.7757
]

var date = new Date();
var day = date.getDate();
var tmp = "0";

if(day.length == 1)
{
  day = tmp + day;
}

var start_date = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + "01";
var today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + day;

function getSalesCategories() {
  const baseURI = 'http://192.168.0.4:7080/heroes/statistics/income/select';
  return Axios.get(baseURI, {
    params: {
      startDate: "2018-12-01",
      endDate: "2018-12-16",
      batchType: "D"  
    }
  })
  .then(response => {
    if(response.data.result == "success") {  
      sales_categories = response.data.data.map(value => {
        return value.date.toString().substring(0, 10);
      });
      
    }
    return sales_categories;
  }).catch(error => {
    alert("fail");
  });
}

function getSalesData() {
  const baseURI = 'http://192.168.0.4:7080/heroes/statistics/income/select';
  return Axios.get(baseURI, {
    params: {
      startDate: "2018-12-01",
      endDate: "2018-12-16",
      batchType: "D"  
    }
  })
  .then(response => {
    if(response.data.result == "success") {  
      sales_data = response.data.data.map(value => {
        return value.average;
      })
    }
    return sales_data;
  }).catch(error => {
    alert("fail");
  });

}

var sales_categories = [];
var sales_data = [];

export default{
    components: {
        VueHighcharts,
        Highcharts
    },
    data(){
      return{
        flag : false,

        userStatics: {
          options: {
            chart: {
              type: 'bar'
            },
            title: {
                text: "연령 별 사용자 통계"
            },
            xAxis: [{
              categories: age_categories,
              reversed: false,
              labels: {
                step: 1
              }
            },{
              opposite: true,
              reversed: false,
              categories: age_categories,
              linkedTo: 0,
              labels: {
                step: 1
              }
            }],
            yAxis: {
                visible: false
            },
            plotOptions: {
              series: {
                stacking: 'normal'
              }
            },
            tooltip: {
                formatter: function() {
                   return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },
            series: [{
              name: '남자',
              data: [
                -2.2, -2.1, -2.2, -2.4,
                -2.7, -3.0, -3.3, -3.2,
                -2.9, -3.5
              ]
            }, {
              name: '여자',
              data: [
                2.1, 2.0, 2.1, 2.3, 2.6,
                2.9, 3.2, 3.1, 2.9, 3.4
              ]
            }]
          }
        },
        salesStatics: {
          options: {
            chart: {
              events: {
                load: function() {
                  var xAxis = this.xAxis[0];
                  var series = this.series[0];
                  getSalesCategories().then((response) => {
                    xAxis.setCategories(response);
                  }),
                  getSalesData().then((response) => {
                    series.setData(response);
                  })
                }
              }  
            },
            title: {
                text: "매출 통계"
            },
            xAxis: {
              categories: [] 
            },
            yAxis: { 
                visible:false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series:[{
              type: 'area',
              name: '매출액',
              data: []
            }]
          }
        }
      }
    },
    methods: {
      // userStaticsData_load(){
      //   let userStaticsCharts= this.$refs.userStaticsCharts;        
      // }
    }
}
</script>


<style>
.md-layout {
    margin-bottom: 30px
  }
</style>