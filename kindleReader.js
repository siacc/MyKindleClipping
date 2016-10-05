var fs = require('fs');
var path = require('path');

fs.unlink('./target.html', (err) => {
  if(err) throw err;
});

fs.appendFile('target.html', '<link rel="stylesheet" href="./index.css"/>', (err) => {
    if (err) throw err;
});

fs.readFile('./My\ Clippings.txt', 'utf-8', function(err, data) {
  if(err) throw err;
  parseData(data);
});

/**
 * 数据解析
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function parseData(data) {
  var items = data.split('==========');
  var bookTitles = [];
  var currentBookTitle = '';
  items.forEach(function(item, index) {
    var lines = item.split('\r\n');
    var formattedLines = [];
    lines.forEach(function(line) {
      if(line) {
        formattedLines.push(line);
      }
    });
    if(formattedLines.length) {
      var appendTxt = '';
      var needTitle = false;
      var bookTitle = formattedLines[0];
      var markTime = formattedLines[1].split('|')[1].slice(5);
      var content = formattedLines[2];
      if(bookTitle && markTime && content) {
        if (currentBookTitle !== bookTitle) {
          currentBookTitle = bookTitle;
          bookTitles.push(bookTitle);
          needTitle = true;
        }
        var appendTxt = renderItem(needTitle ? bookTitle : '', markTime, content);
        fs.appendFile('target.html', appendTxt, (err) => {
            if (err) throw err;
        });
      } else {
        console.log('******错误行：', item);
      }
    }
  });

  fs.appendFile('target.html', renderMenu(bookTitles), (err) => {
      if (err) throw err;
  });
}

/**
 * 生成笔记html片段
 * @param  {String} bookTitle 书名
 * @param  {String} markTime  标记时间
 * @param  {String} content   标记内容
 * @return {String}           笔记html片段
 */
function renderItem(bookTitle, markTime, content) {
  var titleTxt = bookTitle ? '<h3><a name="' + bookTitle + '" href="#' + bookTitle + '">' + bookTitle + '</a></h3>' : '';
  var renderTxt = '<div class="mark-item">' +
                    titleTxt +
                    '<p class="mark-time">' + markTime + '</p>' +
                    '<p class="mark-content">' + content + '</p>' +
                  '</div>';
  return renderTxt;
}

/**
 * 生成menu html片段
 * @param  {Array} bookTitles 书名列表
 * @return {String}           menu html片段
 */
function renderMenu(bookTitles) {
  var menuTxt = '<ul class="menu">';
  bookTitles.forEach((bookTitle, index) => {
    menuTxt += '<li><a href="#' + bookTitle + '" title="' + bookTitle + '">' + index + '. '+ bookTitle + '</a></li>';
  });
  menuTxt += '</ul>';
  return menuTxt;
}
