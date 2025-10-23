
(function () {
  'use strict';

  var answer = Math.floor(Math.random() * 100) + 1;
  var attempts = 0;
  var guesses = [];              // ← 不用 history
  var text = '（已產生 1~100 的整數）\n';

  while (true) {
    var input = prompt('請猜一個 1~100 的整數：');
    if (input === null) {
      text += '\n你已取消遊戲。';
      alert('已取消遊戲');
      break;
    }

    var n = parseInt((input || '').trim(), 10);
    if (isNaN(n)) {
      alert('不是有效整數，請再試一次。');
      continue;
    }

    attempts++;
    guesses.push(n);

    if (n === answer) {
      var msg = '恭喜答對！答案是 ' + answer + '，共猜了 ' + attempts + ' 次。';
      alert(msg);
      text += '\n' + msg;
      break;
    } else if (n < answer) {
      alert('再大一點！');
    } else {
      alert('再小一點！');
    }
  }

  if (guesses.length) {
    text += '\n你的猜測歷程：' + guesses.join(' → ');
  }
  console.log(text);
  document.getElementById('result').textContent = text;
})();
