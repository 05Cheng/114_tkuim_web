
function toNumber(s) {
    var n = parseFloat((s || '').trim());
    return isNaN(n) ? null : n;
  }
  
  var rawTemp = prompt('請輸入溫度數值（可含小數）：');
  var unit = prompt('請輸入單位（C 或 F）：');
  
  var text = '';
  
  var temp = toNumber(rawTemp);
  var u = (unit || '').trim().toUpperCase();
  
  if (temp === null || (u !== 'C' && u !== 'F')) {
    text = '輸入有誤：請填寫有效的數值與單位（C 或 F）。';
    alert(text);
  } else {
    var converted, msg;
    if (u === 'C') {
      // C → F
      converted = temp * 9 / 5 + 32;
      msg = temp + '°C = ' + converted.toFixed(2) + '°F';
    } else {
      // F → C
      converted = (temp - 32) * 5 / 9;
      msg = temp + '°F = ' + converted.toFixed(2) + '°C';
    }
    text = '原始輸入：' + temp + '°' + u + '\n' + msg;
    alert(msg);
  }
  console.log(text);
  document.getElementById('result').textContent = text;
  