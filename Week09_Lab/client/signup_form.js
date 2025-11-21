
const API_BASE_URL = 'http://localhost:3000';

const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const viewListBtn = document.getElementById('view-list-btn');
const messageDiv = document.getElementById('message');
const signupListPre = document.getElementById('signup-list');

let isSubmitting = false;

function setLoading(isLoading) {
  isSubmitting = isLoading;
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';
    form.classList.add('loading');
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出報名';
    form.classList.remove('loading');
  }
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = '';
  if (type === 'error') {
    messageDiv.classList.add('error');
  } else if (type === 'success') {
    messageDiv.classList.add('success');
  }
}

function getFormData() {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  data.agree = form.querySelector('input[name="agree"]').checked;
  return data;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  const data = getFormData();
  setLoading(true);
  showMessage('', '');

  try {
    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      if (result && result.errors) {
        const errMsgs = Object.values(result.errors).join('，');
        showMessage(`報名失敗：${errMsgs}`, 'error');
      } else {
        showMessage(result.message || '報名失敗', 'error');
      }
      return;
    }

    showMessage('報名成功！', 'success');
    form.reset();
    await fetchSignupList();
  } catch (err) {
    console.error(err);
    showMessage('無法連線到伺服器，請稍後再試', 'error');
  } finally {
    setLoading(false);
  }
});

viewListBtn.addEventListener('click', async () => {
  await fetchSignupList();
});

async function fetchSignupList() {
  signupListPre.textContent = 'Loading...';
  try {
    const res = await fetch(`${API_BASE_URL}/api/signup`);
    const data = await res.json();
    signupListPre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    signupListPre.textContent = '載入失敗，請稍後再試';
  }
}
