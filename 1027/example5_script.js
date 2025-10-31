  // example5_script.js
const form = document.getElementById('dynamic-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const successModal = document.getElementById('successModal'); // 成功提交後的彈窗
const closeModalBtn = document.getElementById('closeModalBtn'); // 已讀完畢按鈕
const agreeCheckbox = document.getElementById('agree'); // 隱私條款勾選框

  // 顯示隱私條款模態彈窗
  privacyModal.style.display = 'flex'; // 顯示彈窗
  submitBtn.disabled = true; // 禁用送出按鈕
;

// 點擊「已讀完畢」按鈕時，關閉隱私條款彈窗並勾選同意條款框
closeModalBtn.addEventListener('click', () => {
  privacyModal.style.display = 'none'; // 隱藏彈窗
  agreeCheckbox.checked = true; // 自動勾選同意隱私條款
  submitBtn.disabled = false; // 啟用送出按鈕
  submitBtn.textContent = '送出';
  
});



// 清除表單並重設驗證狀態
resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

// 當輸入欄位有效時，移除無效樣式
form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});
