// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表
var startInput = prompt('請輸入起始數字（1–9）：',1);
var endInput = prompt('請輸入結束數字（1–9）：',9);
var start = parseInt(startInput,10);
var end = parseInt(endInput,10);

var output = '';

if (isNaN(start) || isNaN(end)) {
    output = ' 起訖範圍需為數字，請重新整理並輸入 1–9 的整數。';
  } else {
    // 夾到 1..9 區間
    if (start < 1) start = 1;
    if (start > 9) start = 9;
    if (end   < 1) end   = 1;
    if (end   > 9) end   = 9;
  }
  output+= '範圍：'+start+'到：'+end+'\n\n';
for (var i = start; i <= end; i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}
console.log(output);
document.getElementById('result').textContent = output;
