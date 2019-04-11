var request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')
"use strict"
// 分别对应 名字, 电影描述 年代 国家 评论数 标签  分数  引言
function Movie() {
  this.name = ''
  this.year = ''
  this.country = ''
  this.comment = 0
  this.tag = ''
  this.score = 0
  this.quote  = ''
}

// 根据 URL 请求页面内容
// 根据url发送请求
// 根据页面内容进行数据解析,并保存到本地
// 获取分析好的本地数据,显示在屏幕上

const saveMovie = function(movies){
  const path = './static/api.douban.json'
  const data = JSON.stringify(movies, null, 2)
  fs.appendFile(path, data, (error)=>{
    if(error){
      console.log('写入失败')
    }else{
      console.log('保存成功')
    }
  })
}

const movieFromDivs = function(div){
  const elementMovie = new Movie()
  const $ = cheerio.load(div)
  const name = ($('.title').text()).split('/')[0]

  const info = $('.bd').children().first().text()
    .replace(/\s{3,}/g, '|').split('|')
  const infoDesc = info[info.length - 2].split('/')
  const star = $('.star')
  const year = infoDesc[0].replace(/[^0-9]/ig, '')
  const country = infoDesc[infoDesc.length - 2].split(' ')

  const tag = infoDesc[infoDesc.length - 1].split(' ')
  const score = $('.rating_num').text()
  // 获取数字
  const comment =star.children().last().text().replace(/[^0-9]/ig, '')
  const quote = $('.inq').text()
  elementMovie.name = name
  elementMovie.year = year
  elementMovie.country = country
  elementMovie.tag = tag
  elementMovie.score = score
  elementMovie.comment = comment
  elementMovie.quote = quote
  return elementMovie
}

const moviesFromUrl = function(url){
  request(url, function (error, response, body) {
  if(error){
    alert('获取数据失败,请检查网络')
    console.log('error:', error);
  }else if( response && response.statusCode == 200 ||
    response && response.statusCode == 304
  ){
      // 把body传进去进行解析
      // 获取所有的电影条目
      // 遍历分析每一个条目

    const $ = cheerio.load(body)
    const movies = []
    const movieDivs = $('.item')
    for (var i = 0; i < movieDivs.length; i++) {
      const movieDiv = movieDivs[i]
      let movie = movieFromDivs(movieDiv)
      movies.push(movie)
    }
    // 保存数据
    saveMovie(movies)
  }

});
}

const allPageData = function(baseUrl){
  // 或者一个 for 循环 * 25
  const pageStart = [0, 25, 50, 75, 100, 125, 150, 200, 225]
  // let url = baseUrl + '?start=0&filter='
  for (var i = 0; i < 10; i++) {
    let url = baseUrl + `?start=${i*25}&filter=`
    moviesFromUrl(url)
  }
}

var __main = function(){
  // 未封装成类
  let baseUrl = 'https://movie.douban.com/top250';
  allPageData(baseUrl)
}

__main()
