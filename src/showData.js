
function yearStarCallBack(data){
  let yearStarData = data
  let year = []
  let star = []
  // 格式化数据
  for (var variable in yearStarData) {
    if (yearStarData.hasOwnProperty(variable)) {
      yearStarData[variable] = parseFloat(yearStarData[variable])
      year.push(variable)
      star.push(yearStarData[variable])
    }
  }
  // 配置echarts
  let option = {
      title: {
          text: '豆瓣电影 Top250 电影年总评分量',
          subtext: '评分',
          x: 'center'
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:['电影评分量']
      },
      toolbox: {
          show: true,
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      calculable: true,
      xAxis: [
          {
              type: 'category',
              data: year
          }
      ],
      yAxis: [
          {
              type: 'value'
          }
      ],
      series: [
          {
              name:'电影总评分数',
              type:'bar',
              data: star,
              markPoint: {
                  data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                  ]
              },
              markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
              }
          }
      ]
  };
  let myEchart = echarts.init(document.querySelector('.left'))
  myEchart.setOption(option)
}

var creatColor = function(){
  return 'rgb(' + [
    Math.round(Math.random() * 160),
    Math.round(Math.random() * 160),
    Math.round(Math.random() * 160)
  ].join(',') + ')';
}

var createRandomItemStyle = function (len) {
    let colorArr = []
    for (var i = 0; i < len; i++) {
      colorArr.push(creatColor())
    }
    // console.log(colorArr)
    return colorArr
}


function tagCallBack (data){
  let tagData = data
  let tagTypes = []
  let tagValue = []
  let modelData = []
  let otherData = {}
  // 数据筛选 其他数据收集
  for (let variable in tagData) {
    if (tagData.hasOwnProperty(variable)) {
      let model = {}
      if(tagData[variable] < 18 ){
        if(otherData.hasOwnProperty('value')){
          otherData['value'] += tagData[variable]
        }else{
          otherData['value'] = tagData[variable]
          otherData['name'] = '其他'
        }
      }else{
        tagTypes.push(variable)
        model['value'] = tagData[variable]
        model['name'] = variable
        modelData.push(model)
      }
    }
  }
  tagTypes.push('其他')
  modelData.push(otherData)

  let myCircleOption =  {
    title : {
        text: '豆瓣电影 Top250 电影类型分布',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y: 'middle',
        data: tagTypes
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    series: [
        {
            name:'电影类型',
            type:'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: modelData
        }
    ]
};

  let myCircle = echarts.init(document.querySelector('.center'))
  myCircle.setOption(myCircleOption)

  // 热词图
  let cloudData = []
  for (let variable in tagData) {
    if (tagData.hasOwnProperty(variable)) {
      let cloud = {}
      cloud['name'] = variable
      cloud['value'] = tagData[variable]
      cloudData.push(cloud)
    }
  }

  let cloudOption = {
    title: {
        text: '豆瓣电影 Top250 电影类型热词',
        x: 'center'
    },
    tooltip: {
      backgroundColor:'rgba(255,255,255,0)',
      textStyle: {
        fontWeight:'bold',
        fontSize:20,
        color:'#FF0000',
      }
    },
    toolbox: {
      show : true,
      right:'5%',
      feature: {
        dataView: {readOnly: true},
        restore: {},
        saveAsImage: {}
      }
    },
    series: [ {
      type: 'wordCloud',
      sizeRange: [30, 100],
      rotationRange: [0, 0],  //设置为不旋转
      gridSize: 10,            //字符之间的间隔
      shape: 'circle',
      drawOutOfBound: false,
      textStyle: {
        //正常情况下的样式
        normal: {
          color: function(){
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          }
        },
      //鼠标悬浮时的样式
        emphasis: {
          fontWeight:'bolder',
          fontSize: 50,
          color: '#00467A'
        }
      },
    data: cloudData
    }],
  };

  let myCloud = echarts.init(document.querySelector('.right'))
  myCloud.setOption(cloudOption)
}
