// ✅ 事件委派 Todo：新增 / 完成 / 刪除（含清楚的 console 訊息）

console.log('[BOOT] example1_script.js loaded'); // 看到這行就代表 JS 有成功載入

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list  = document.getElementById('todo-list');

if (!form || !input || !list) {
  console.error('[ERROR] 缺少必要的 DOM 元素（請確認 id: todo-form / todo-input / todo-list）');
}

// 簡單 XSS 防護
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

// 建立 li
function createItem(text) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.innerHTML = `
    <span class="todo-text">${escapeHtml(text)}</span>
    <div class="btn-group btn-group-sm">
      <button class="btn btn-outline-success" data-action="toggle">完成</button>
      <button class="btn btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  return li;
}

// 送出：新增
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  console.log('[SUBMIT] 收到送出, value =', value);

  if (!value) { console.warn('[SUBMIT] 空字串，忽略'); input.focus(); return; }
  if (value.length > 100) { console.warn('[SUBMIT] 超過 100 字，忽略'); alert('字數太長，請在 100 字以內'); return; }

  list.appendChild(createItem(value));
  console.log('[SUBMIT] 已新增到清單');
  input.value = '';
  input.focus();
});

// 事件委派：完成 / 刪除
list.addEventListener('click', (event) => {
  // 冒泡路徑觀察
  console.log('[CLICK:list] target =', event.target);

  const btn = event.target.closest('[data-action]');
  if (!btn || !list.contains(btn)) {
    console.log('[CLICK:list] 沒點到 data-action 按鈕，忽略');
    return;
  }

  const li = btn.closest('li');
  const action = btn.dataset.action;
  console.log('[CLICK:list] action =', action, 'li =', li);

  if (action === 'remove') {
    li.remove();
    console.log('[CLICK:list] 已刪除項目');
  } else if (action === 'toggle') {
    li.classList.toggle('list-group-item-success');
    const textEl = li.querySelector('.todo-text');
    if (textEl) {
      textEl.style.textDecoration =
        textEl.style.textDecoration === 'line-through' ? '' : 'line-through';
    }
    console.log('[CLICK:list] 已切換完成狀態');
  }
}, false);

// 捕獲階段也印（比較事件流向）
list.addEventListener('click', (e) => {
  console.log('[CAPTURE:list] 捕獲 click'); 
}, true);
