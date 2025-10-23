// example3_script.js
// 使用 prompt 取得輸入，並做基本運算

var name = prompt('請輸入你的名字：');
if (!name) {
  name = '同學';
}

var a = prompt('請輸入數字 A：');
var b = prompt('請輸入數字 B：');

var numA = parseFloat(a);
var numB = parseFloat(b);

var output = '';
output += '哈囉，' + name + '！\n\n';
output += 'A = ' + numA + ', B = ' + numB + '\n';
if(isNaN(numA)||isNaN(numB)){
    output +='其中至少一個輸入不是有效數字，請重新整理並輸入數字。\n';
}else{
    output += 'A + B = ' + (numA + numB) + '\n';
    output += 'A - B = ' + (numA - numB) + '\n';
    output += 'A * B = ' + (numA * numB) + '\n';
}
if (numB === 0) {
    output += 'A / B = 無法計算（B=0）\n';
    output += 'A % B = 無法計算（B=0）\n';
  } else {
    output += 'A / B = ' + (numA / numB) + '\n';
    output += 'A % B = ' + (numA % numB) + '\n';
  }
output += 'A > B ? ' + (numA > numB) + '\n';
output += 'A == B ? ' + (numA == numB) + '（僅比較值）\n';
output += 'A === B ? ' + (numA === numB) + '（比較值與型態）\n';

alert('計算完成，請看頁面結果與 Console');
console.log(output);
document.getElementById('result').textContent = output;
