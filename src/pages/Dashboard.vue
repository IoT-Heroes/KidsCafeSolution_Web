<template>
  <div class="content">
    <!-- <select class="rangeDropdown"> 
      <option value="selectAge">연령선택</option>
      <option value="5">5</option>
      <option value="10">10</option>  
    </select>  -->
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <vue-highcharts :options="Pulse.options" ref="pulseCharts"></vue-highcharts>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <vue-highcharts :options="RecZone.options" ref="recZoneCharts"></vue-highcharts>       
      </div>
    </div> 


    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <vue-highcharts :options="Air.options" ref="airCharts"></vue-highcharts>       
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <div id="highCharts"></div>
      </div>
    </div>
  </div>
  
</template>
<script>
import VueHighcharts from "vue-highcharts"
import Highcharts from  "highcharts";
import solidgauge from "highcharts/modules/solid-gauge";
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(Highcharts);
solidgauge(Highcharts);


import Axios from 'axios';

var pulse_interval = null;
var inside_air_interval = null;
var outside_air_interval = null;
var activity_interval = null;

var date = new Date();
var current_time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
var end_time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()+1);
var zone_info = [];

var token;
var BAND_URI = '/api/v1/streams/band1/log';
var ZONE_URI = '/api/v1/streams/zone1/log';

var pulse = [];
var activity = [];
var air = [];

var band_data = [];

var now = new Date().getTime();

//실시간 활동량 데이터 SETTING
function getActivityData() {
  var data = [];
  data = requestBandData();
  var atvity_data;
  var activity = [];

  if(data.data[0].attributes.step != null) {
    atvity_data = data.data[0].attributes.step;
  } else if (data.data[1].attributes.step != null) {
    atvity_data = data.data[1].attributes.step;
  } else if (data.data[2].attributes.step != null) {
    atvity_data = data.data[2].attributes.step;
  } else if (data.data[3].attributes.step != null) {
    atvity_data = data.data[3].attributes.step;
  }
  else if (data.data[4].attributes.step != null) {
    atvity_data = data.data[4].attributes.step;
  }
  activity.push(atvity_data);

  console.log("step : " + activity);

  return activity;
}

//실시간 활동량 SETTING
Highcharts.setOptions({
  
  title: '실시간 활동량',
  subtitle: {
    text: '실시간 활동량',
    style: {
      'font-size' : '30px'
    },
    y: 200,
    zIndex: 7
  },
  pane: [{
    startAngle: -120,
    endAngle: 120,
    background: [{ // Track for Move
      outerRadius: '100%',
      innerRadius: '80%',
      backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
      borderWidth: 0,
      shape: 'arc'
    }],
    size: '120%',
    center: ['50%', '65%']
  },{
    startAngle: -120,
    endAngle: 120,
    size: '95%',
    center: ['50%', '65%'],
    background: []
  }],
  tooltip: {
      enabled: false
  },
  yAxis: [{
    min: 0,
    max: 10,
    lineWidth: 2,
    lineColor: 'white',
    tickInterval: 1,
    labels: {
      enabled: false
    },
    minorTickWidth: 0,
    tickLength: 50,
    tickWidth: 5,
    tickColor: 'white',
    zIndex: 6,
    stops: [
      [0, '#fff'],
      [0.101, '#0f0'],
      [0.201, '#2d0'],
      [0.301, '#4b0'],
      [0.401, '#690'],
      [0.501, '#870'],
      [0.601, '#a50'],
      [0.701, '#c30'],
      [0.801, '#e10'],
      [0.901, '#f03'],
      [1, '#f06']
    ]
  }, {
    linkedTo: 0,
    pane: 1,
    lineWidth: 5,
    lineColor: 'white',
    tickPositions: [],
    zIndex: 6
  }],
  plotOptions: {
      solidgauge: {
          dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
          }
      }
  }
});


var requestBandData  = function(callback, args) {
  var appId = "nvGYOawLuQnXDZBv";
  var secret = "qe3inAQTgpQs1jT6";

  var bandData = [];

  $.ajax('https://iotmakers.kt.com/oauth/token', {
		method: 'POST',
		xhrFields: { withCredentials: true },
    headers: { 'Authorization': 'Basic ' + btoa(appId + ':' + secret)},
    async: false,
		data: { 
      grant_type: 'password',
			username: 'lockandlock1',
			password: '1q2w3e4r!'
		},
		success: function(result) {
      token = result.access_token,
      $.ajax('https://iotmakers.kt.com:443' + BAND_URI, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token},
        async: false,
        data: {
          period: 9999,
          from : now,
          count: 5
        },
        success: function (data, status, xhr) {
          bandData = data;
          return bandData;
        },
        error: function(xhr,status,e){

        }
      });
      return bandData;
		},
      error: function(xhr,status,error){
      console.log(xhr);
		}
  });    
  return bandData;
};



var requestPulseData  = function(callback, args) {
  var appId = "nvGYOawLuQnXDZBv";
  var secret = "qe3inAQTgpQs1jT6";

  $.ajax('https://iotmakers.kt.com/oauth/token', {
		method: 'POST',
		xhrFields: { withCredentials: true },
    headers: { 'Authorization': 'Basic ' + btoa(appId + ':' + secret)},
    async: false,
		data: { 
      grant_type: 'password',
			username: 'lockandlock1',
			password: '1q2w3e4r!'
		},
		success: function(result) {
      token = result.access_token,
      $.ajax('https://iotmakers.kt.com:443' + BAND_URI, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token},
        async: false,
        data: {
          period: 9999,
          from : now,
          count: 5
        },
        success: function (data, status, xhr) {
          pulse = data;
          return pulse;
        },
        error: function(xhr,status,e){

        }
      });
      return pulse;
		},
      error: function(xhr,status,error){
      console.log(xhr);
		}
  });    
  return pulse;
};

var requestAirData = function(callback, args) {
  var appId = "nvGYOawLuQnXDZBv";
  var secret = "qe3inAQTgpQs1jT6";

  $.ajax('https://iotmakers.kt.com/oauth/token', {
		method: 'POST',
		xhrFields: { withCredentials: true },
    headers: { 'Authorization': 'Basic ' + btoa(appId + ':' + secret)},
    async: false,
		data: { 
      grant_type: 'password',
			username: 'lockandlock1',
			password: '1q2w3e4r!'
		},
		success: function(result) {
      token = result.access_token,
      $.ajax('https://iotmakers.kt.com:443' + ZONE_URI, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token},
        async: false,
        data: {
          period: 9999,
          from : now,
          count: 2
        },
        success: function (data, status, xhr) {
          air = data;
          return air;
        },
        error: function(xhr,status,e){

        }
      });
      return air;
		},
      error: function(xhr,status,error){
      console.log(xhr);
		}
  });    
  return air;
};

function getRecZone() {
  const baseURI = 'http://192.168.0.4:7080/heroes/statistics/zonefrequency/select';
  return Axios.get(baseURI, {
    params: {
      startDate :'2018-12-15',
      endDate : '2018-12-16',
      // startDate : current_time,
      // endDate: end_time,
      batchType: 'D'
    }
  })
  .then(response => {
    if(response.data.result == "success") {
      zone_info = response.data.data;
      return zone_info;
    }
  })
  .catch(error => {
    alert("fail");
  })
}

function getData(rawData) {
  var data = [];
  var start = Math.round(Math.floor(rawData / 10) * 10);
  data.push(rawData);
  for (i = start; i > 0; i -= 10) {
    data.push({
      y: i
    });
  }
  return date; 
}

export default{
    components: {
        Highcharts,
        HighchartsMore,
        solidgauge
    },

    data(){
      return{
        Pulse: {
          options: {
            chart: {
              type: 'spline',
              animation: Highcharts.svg, // don't animate in old IE
              marginRight: 10,
              events: {
                load: function () {
                  var series = this.series[0];

                  pulse_interval = setInterval(function () {
                    pulse = requestBandData();
                    // band_data = requestBandData();
                    var x = new Date(pulse.data[0].occDt).getTime();
                    var y;
                    if(pulse.data[0].attributes.pulse != null) {
                      y = pulse.data[0].attributes.pulse;
                    } else if (pulse.data[1].attributes.pulse != null) {
                      y = pulse.data[1].attributes.pulse;
                    } else if (pulse.data[2].attributes.pulse != null) {
                      y = pulse.data[2].attributes.pulse;
                    }
                    series.addPoint([x, y], true, true);                     
                  }, 5000);
                }
              }
            },
            time: {
                useUTC: false
            },
            title: {
                text: '실시간 맥박'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
              name: '맥박',
              data: (function () {
                
                var data = [],
                time = (new Date()).getTime(),
                i;
                var index = 0.1;
                for (i = -4; i <= 0; i += 1) {
                    data.push({
                        x: time+i*5000,
                        y: 0
                    });
                }
                return data;
              }())
            }]
          }
        },
        RecZone: {
          options: {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie',
              events: {
                load: function() {
                  var series = this.series[0];
                  var series_data = [];

                  getRecZone().then((response) => {
                    for(var i=0; i<response.length; i++) {
                      series_data.push([response[i].zoneName, response[i].count]);
                    }
                    series.setData(series_data, true);
                  })
                }
              }
            },
            title: {
              text: '추천 놀이구역'
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                }
              }
            },
            series: [ {
              name: '이용현황',
              ColorByPoint: true,
              data:[]
            }]
          }
        },
        Air: {
          options: {
            chart: {
              title: {
                text: 'Combination chart',
                events: {
                  load: function() {
                    setInterval(function() {
                      var point, newVal, inc;

                      point = this.series[0].points[0];
                      inc = Math.round((Math.random() - 0.5) * 100);
                      newVal = point.y + inc;

                      if(newVal <0 || newVal > 200) {
                        newVal = point.y - inc;
                      }
                      point.update(newVal);
                    }, 2000);
                  }
                }
              },
              events: {
                load: function () {
                  var inside_series = this.series[0];
                  var outside_series = this.series[1];
          
                  inside_air_interval = setInterval(function () {
                    air = requestAirData();
                    inside_series.data[0].update(air.data[0].attributes.humid);
                    inside_series.data[1].update(air.data[1].attributes.temp);
                  }, 1000);

                    outside_series.data[0].update(25);
                    outside_series.data[1].update(0);
                }
              }
            },
            title: {
                text: '쾌적도 조회'
            },
            xAxis: {
                categories: ['습도', '온도']
            },
            yAxis: {
                title: {
                    text: 'Value'
                }
            },
            series: [{
              type: 'column',
              name: '실내',
              data: [0, 0]
              // data: 
            },
            {
              type: 'spline',
              name: '실외',
              data: [0, 0]
            }]
          }
        }  
      }
    },
    methods: {
      init() {
        this.draw();
      },
      draw() {
        new Highcharts.chart('highCharts', {
          chart: {
            type: 'solidgauge',
            marginTop: 10,
            events: {
              load: function() {
              var point = this.series[0].points[0];
              var newVal;

              activity_interval = setInterval(function() {
                newVal = getActivityData();
                // point.update(newVal);
                point.update(3);
              }, 1000);
              }
            }
          },
          yAxis: {
            min: 0,
            max: 200,
            title: {
              text: '실시간 활동량'
            },
          },
          credits: {
            enabled: false
          },
          series: [{
            animation: false,
            borderWidth: 0,
            color: Highcharts.getOptions().colors[0],
            radius: '100%',
            innerRadius: '80%',
            data: [0]
          }]
        })
      }
    },
    created() {
      
    },
    mounted() {
      this.init();
    },
    beforeDestroy() {
      clearInterval(pulse_interval);
      clearInterval(inside_air_interval);
      clearInterval(outside_air_interval);
      clearInterval(activity_interval);
    }
}
</script>


<style>
.md-layout {
    margin-bottom: 30px
  }
</style>