// signup_form.js

// 取得元素
const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");
const interestGroup = document.getElementById("interest-group");
const interestsHidden = document.getElementById("interests");
const termsCheckbox = document.getElementById("terms");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const successMsg = document.getElementById("success-msg");

// 錯誤訊息容器
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const passwordError = document.getElementById("password-error");
const confirmError = document.getElementById("confirm-error");
const interestError = document.getElementById("interest-error");
const termsError = document.getElementById("terms-error");

// 密碼強度
const strengthBar = document.getElementById("password-strength-bar");
const strengthText = document.getElementById("password-strength-text");

// 用來記錄哪些欄位被動過
const touched = new Set();

// ------- localStorage 功能 (可拿掉) -------
const STORAGE_KEY = "week07_signup_draft";

function saveDraft() {
  const data = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    password: passwordInput.value,
    confirm: confirmInput.value,
    interests: interestsHidden.value,
    terms: termsCheckbox.checked,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.name) nameInput.value = data.name;
    if (data.email) emailInput.value = data.email;
    if (data.phone) phoneInput.value = data.phone;
    if (data.password) passwordInput.value = data.password;
    if (data.confirm) confirmInput.value = data.confirm;
    if (data.interests) {
      interestsHidden.value = data.interests;
      // 還原 tag 樣式
      const arr = data.interests.split(",");
      Array.from(interestGroup.querySelectorAll(".tag")).forEach((tag) => {
        if (arr.includes(tag.dataset.value)) {
          tag.classList.add("active");
        }
      });
    }
    if (data.terms) termsCheckbox.checked = true;
  } catch (err) {
    console.warn("restore draft failed", err);
  }
}
restoreDraft();
// ------------------------------------------

// 驗證函式們
function validateName() {
  let msg = "";
  if (!nameInput.value.trim()) {
    msg = "請輸入姓名。";
  }
  nameInput.setCustomValidity(msg);
  nameError.textContent = msg;
  return !msg;
}

function validateEmail() {
  const value = emailInput.value.trim();
  let msg = "";
  // 簡單 email 驗證
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    msg = "請輸入 Email。";
  } else if (!emailPattern.test(value)) {
    msg = "Email 格式不正確。";
  }
  emailInput.setCustomValidity(msg);
  emailError.textContent = msg;
  return !msg;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  let msg = "";
  if (!value) {
    msg = "請輸入手機。";
  } else if (!/^\d{10}$/.test(value)) {
    msg = "手機需為 10 碼數字。";
  }
  phoneInput.setCustomValidity(msg);
  phoneError.textContent = msg;
  return !msg;
}

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd)) score++;
  if (/[!@#$%^&*(),.?":{}|<>_\-+=~`]/.test(pwd)) score++;
  return score;
}

function updateStrengthBar(pwd) {
  const score = getPasswordStrength(pwd);
  if (!pwd) {
    strengthBar.className = "bar weak";
    strengthText.textContent = "強度：--";
    return;
  }
  if (score === 1) {
    strengthBar.className = "bar weak";
    strengthText.textContent = "強度：弱";
  } else if (score === 2) {
    strengthBar.className = "bar medium";
    strengthText.textContent = "強度：中";
  } else {
    strengthBar.className = "bar strong";
    strengthText.textContent = "強度：強";
  }
}

function validatePassword() {
  const value = passwordInput.value.trim();
  let msg = "";
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`]/.test(value);

  if (!value) {
    msg = "請輸入密碼。";
  } else if (value.length < 8) {
    msg = "密碼至少需 8 碼。";
  } else if (!hasLetter || !hasNumber) {
    msg = "請同時包含英文字母與數字。";
  } else if (!hasSymbol) {
    msg = "建議加入符號以提高安全性。";
    // 如果你想變成「必須有符號」，就把上面那行改成 ↓
    // msg = "請加入至少一個符號（!@#$...）。";
  }

  passwordInput.setCustomValidity(msg === "建議加入符號以提高安全性。" ? "" : msg);
  // 上面這行是：如果只是建議就不擋送出
  passwordError.textContent = msg === "建議加入符號以提高安全性。" ? "" : msg;

  // 更新強度條
  updateStrengthBar(value);

  return !passwordInput.validationMessage;
}

function validateConfirm() {
  const pwd = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();
  let msg = "";
  if (!confirm) {
    msg = "請再次輸入密碼。";
  } else if (pwd !== confirm) {
    msg = "兩次密碼不一致。";
  }
  confirmInput.setCustomValidity(msg);
  confirmError.textContent = msg;
  return !msg;
}

function validateInterests() {
  const value = interestsHidden.value.trim();
  let msg = "";
  if (!value) {
    msg = "請至少選擇一個興趣。";
  }
  interestsHidden.setCustomValidity(msg);
  interestError.textContent = msg;
  return !msg;
}

function validateTerms() {
  let msg = "";
  if (!termsCheckbox.checked) {
    msg = "請勾選服務條款。";
  }
  termsCheckbox.setCustomValidity(msg);
  termsError.textContent = msg;
  return !msg;
}

// 事件委派：點興趣
interestGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".tag");
  if (!btn) return;
  btn.classList.toggle("active");

  const selected = Array.from(
    interestGroup.querySelectorAll(".tag.active")
  ).map((tag) => tag.dataset.value);

  interestsHidden.value = selected.join(",");

  // 即時驗證
  if (touched.has("interests")) {
    validateInterests();
  }

  saveDraft();
});

// blur → 顯示錯誤，input → 即時更新
function handleBlur(e) {
  const id = e.target.id;
  touched.add(id);

  switch (id) {
    case "name":
      validateName();
      break;
    case "email":
      validateEmail();
      break;
    case "phone":
      validatePhone();
      break;
    case "password":
      validatePassword();
      // 如果確認密碼已經輸入過，也一起驗證
      if (touched.has("confirm")) validateConfirm();
      break;
    case "confirm":
      validateConfirm();
      break;
  }
}

function handleInput(e) {
  const id = e.target.id;
  if (!touched.has(id)) return;

  switch (id) {
    case "name":
      validateName();
      break;
    case "email":
      validateEmail();
      break;
    case "phone":
      validatePhone();
      break;
    case "password":
      validatePassword();
      if (touched.has("confirm")) validateConfirm();
      break;
    case "confirm":
      validateConfirm();
      break;
  }

  saveDraft();
}

[nameInput, emailInput, phoneInput, passwordInput, confirmInput].forEach(
  (el) => {
    el.addEventListener("blur", handleBlur);
    el.addEventListener("input", handleInput);
  }
);

// 條款勾選即時驗證
termsCheckbox.addEventListener("change", () => {
  touched.add("terms");
  validateTerms();
  saveDraft();
});

// submit 攔截
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 強制把所有欄位都當成 touched
  ["name", "email", "phone", "password", "confirm", "interests", "terms"].forEach(
    (id) => touched.add(id)
  );

  const v1 = validateName();
  const v2 = validateEmail();
  const v3 = validatePhone();
  const v4 = validatePassword();
  const v5 = validateConfirm();
  const v6 = validateInterests();
  const v7 = validateTerms();

  const allValid = v1 && v2 && v3 && v4 && v5 && v6 && v7;

  if (!allValid) {
    // 聚焦第一個錯的
    const firstError =
      document.querySelector("input:invalid, select:invalid, textarea:invalid") ||
      document.querySelector(".error:not(:empty)");
    if (firstError && firstError.focus) {
      firstError.focus();
    }
    return;
  }

  // 防重送
  submitBtn.disabled = true;
  submitBtn.textContent = "送出中...";

  // 模擬送出 1 秒
  setTimeout(() => {
    successMsg.textContent = "✅ 註冊成功，歡迎加入！";
    submitBtn.disabled = false;
    submitBtn.textContent = "送出";

    // 清空表單 & localStorage
    form.reset();
    updateStrengthBar("");
    interestsHidden.value = "";
    Array.from(interestGroup.querySelectorAll(".tag")).forEach((tag) =>
      tag.classList.remove("active")
    );
    localStorage.removeItem(STORAGE_KEY);
    touched.clear();
  }, 1000);
});

// 重設按鈕
resetBtn.addEventListener("click", () => {
  form.reset();
  nameError.textContent =
    emailError.textContent =
    phoneError.textContent =
    passwordError.textContent =
    confirmError.textContent =
    interestError.textContent =
    termsError.textContent =
      "";
  successMsg.textContent = "";
  updateStrengthBar("");
  interestsHidden.value = "";
  Array.from(interestGroup.querySelectorAll(".tag")).forEach((tag) =>
    tag.classList.remove("active")
  );
  localStorage.removeItem(STORAGE_KEY);
  touched.clear();
});
