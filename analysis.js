const fs = require('fs')
"use strict"

const saveData = function(path, data){
  let yearStarData = JSON.stringify(data, null, 2)
  fs.writeFile(path, yearStarData, (error)=>{
    if(error){
      console.log( `${path}写入失败`)
    }else {
      console.log(`${path}写入成功`)
    }
  })
}

const formData = function(data){
    let myData = data
    // 去掉多余 [ 和 ]
    let len = myData.replace(/\]\[/g,',')
    let yearStar = {}
    let tagArr = []
    let tagTypes = {}
    let countryArr = []
    let countrys = {}
    let comments = {}
    let allMovieData = JSON.parse(len)
    for (let i = 0; i < allMovieData.length; i++) {
      let year = parseInt(allMovieData[i].year)
      let score = parseFloat(allMovieData[i].score)
      var  yearindex = year.toString()
      // 统计每年的分数
      if(yearStar[year] != null){
        yearStar[year] = score + yearStar[yearindex]
      }else{
        yearStar[year] = score
      }

      // 分析类型
      let tag = allMovieData[i].tag
      for (let i = 0; i < tag.length; i++) {
        tagArr.push(tag[i].replace(/\s+/g, ''))
      }
      let country = allMovieData[i].country
      for (let i = 0; i < country.length; i++) {
        countryArr.push(country[i].replace(/\s+/g, ''))
      }
      // 分析评论数
      let comment = allMovieData[i].comment
      let name = allMovieData[i].name.replace(/\s+/g, '')
      comments[name] = parseInt(comment)
    }

    // 数据组合 (类型 国家 可能有多个所有不能放在一起优化)
    for (let variable in yearStar) {
      if (yearStar.hasOwnProperty(variable)) {
         yearStar[variable] = yearStar[variable].toFixed(2).toString()
      }
    }
    let basePath = './static/api/'
    let yearStarPath = basePath + 'yearStar.json'
    saveData(yearStarPath, yearStar)

    for (let i = 0; i < tagArr.length; i++) {
      let tagIndex = tagArr[i]
        if(tagTypes[tagIndex] != null){
          tagTypes[tagIndex] = tagTypes[tagIndex] + 1
        }else{
          tagTypes[tagIndex] = 1
        }
    }
    let tagPath = basePath +  'tags.json'
    saveData(tagPath, tagTypes)

    for (let i = 0; i < countryArr.length; i++) {
      let tagIndex = countryArr[i]
        if(countrys[tagIndex] != null){
          countrys[tagIndex] = countrys[tagIndex] + 1
        }else{
          countrys[tagIndex] = 1
        }
    }

    let countryPath = basePath +  'countrys.json'
    saveData(countryPath, countrys)

    let commentPath = basePath + 'comments.json'
    saveData(commentPath, comments)
}

const MovieData = function(path){
  fs.readFile(path, 'utf-8', (error, data)=>{
    if(error){
      console.log('读取失败')
    }else{
      formData(data)
    }
  })
}

const __main = function(){
  const path = './static/api/douban.json'
  MovieData(path)
}

__main()
