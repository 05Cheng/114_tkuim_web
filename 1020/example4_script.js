// example4_script.js
// 判斷輸入數字是否為奇數或偶數

var input = prompt('請輸入一個整數：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// 額外示範 switch（1、2、3 對應文字）
var choice = prompt('輸入 1/2/3 試試 switch：');
switch (choice) {
  case '1':
    msg += '\n你輸入了 1';
    break;
  case '2':
    msg += '\n你輸入了 2';
    break;
  case '3':
    msg += '\n你輸入了 3';
    break;
  default:
    msg += '\n非 1/2/3';
}
var scoreInput = prompt('請輸入分數（0–100)：');
var score = Number(scoreInput);
if (Number.isNaN(score)) {
    msg += '\n分數輸入不是數字！';
  } else if (score < 0 || score > 100) {
    msg += '\n分數需介於 0 到 100。';
  } else{
    var band = (score === 100) ? 10 : Math.floor(score / 10);
  var grade;

  switch (band) {
    case 10:
    case 9:
      grade = 'A'; break;
    case 8:
      grade = 'B'; break;
    case 7:
      grade = 'C'; break;
    case 6:
      grade = 'D'; break;
    default:
      grade = 'F';
  }
  msg += '\n分數：' + score + '，等級：' + grade;
}
console.log(msg);
document.getElementById('result').textContent = msg;
