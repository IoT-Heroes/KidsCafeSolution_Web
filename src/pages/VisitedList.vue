<template>
  <div class="content">
    <div class="md-layout">

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-40" >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">방문기록</h4>
          </md-card-header>
          <md-card-content>
            <simple-table table-header-color="green"></simple-table>
          </md-card-content>
        </md-card>        
      </div>

      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50" >
        <md-card>
          <div v-if="state" class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
              <vue-highcharts :options="visited_log.options" ref="lineCharts"></vue-highcharts>
          </div>
        </md-card>
      </div>
      
    </div>
  </div>

</template>

<script>
import { SimpleTable } from "@/components";
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';
import Axios from 'axios';

var child_Id;
var visited_Date;

var zoneCategories = [];
var activityCount = [];
var averageActivity = [];

function getZoneCategories() {
  const baseURI = 'http://192.168.0.4:7080/heroes/zone/management/select';
  return Axios.get(baseURI, {
  })
  .then(response => {
    if(response.data.result =="success") {
      zoneCategories = response.data.data.map(value => {
        return value.name;
      })
    }
    return zoneCategories;
  })
  .catch(error => {
    alert("fail");
  })
}

function getUserActivityData() {
  const baseURI = 'http://192.168.0.4:7080/heroes/statistics/childusingfrequency/select';

  return Axios.get(baseURI, {
    params: {
      childId : child_Id,
      startDate: visited_Date
    }
  })
  .then(response => {
    if(response.data.result =="success") {
      activityCount = response.data.data.map(value => {
        return value.count;
      });
      return activityCount;
    }
  })
  .catch(error => {
    alert("fail");
  })
}

function getAverageActivityData() {
  const baseURI = 'http://192.168.0.4:7080/heroes/statistics/zonefrequencybyage/select';
  var tmp_date = new Date(visited_Date.toString().substring(0,10));
  var endDate = tmp_date.getFullYear().toString() + "-" + (tmp_date.getMonth()+1).toString() + "-" + (tmp_date.getDate()+1); 
  var startDate = visited_Date.substring(0, 10);

  return Axios.get(baseURI, {
    params: {
      childId : child_Id,
      startDate : visited_Date,
      endDate : endDate,
      batchType: 'D'
    }
  })
  .then(response => {
    if(response.data.result == "success") {
      averageActivity = response.data.data.map(value => {
        return value.average;
      });
      return averageActivity;
    }
  }) 
}

export default {
  components: {
    SimpleTable,
    VueHighcharts,
    Highcharts
  },
  data() {
    return {
      childId: String,
      visitedDate : String,

      visited_log: {
          options: {
            chart: {
              type: 'bar',
              events: {
                load: function() {
                  var xAxis = this.xAxis[0];
                  var series = this.series[0];
                  var secodnSeries = this.series[1];
                  getZoneCategories().then((response) => {
                    xAxis.setCategories(response);
                  })
                  getUserActivityData().then((response) => {
                    series.setData(response);
                  }),
                  getAverageActivityData().then((response) => {
                    secodnSeries.setData(response);
                  })
                }
              }
            },
            title: {
              text: '방문 놀이구역'
            },
            xAxis: {
              categories: []
            },
            yAxis: {
              min: 0,
              title: {
                align: 'high'
              },
              labels: {
                overflow:  'justify'
              }
            },
            tooltop: {
              valueSuffix: ' millions'
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: true
                }
              }
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'top',
              x: -40,
              y: 80,
              floating: true,
              borderWidth: 1,
              backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
              shadow: true
            },
            credits: {
              enabled: false
            },
            series: [{
              name: '방문 이력',
              data: []
            }, {
              name: '평균 방문이력',
              data: []
            }] 
          }
        },
        state : false
    }
  },
  methods: {
  },
  created() {
  },
  mounted() {
    this.$EventBus.$on('visited', (draw_state, date, child_id) => {
      console.log(draw_state, date, child_id);
      this.state = draw_state;
      child_Id = child_id;
      visited_Date = date;

      // this.visited_log.options.chart.events.series.load.update();
      this.visited_log.render();
    });
  }
};
</script>