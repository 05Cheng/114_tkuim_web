// ===== 工具 =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const toastEl = $('#toast');
const toast = new bootstrap.Toast(toastEl);
const showToast = (msg, type = 'success') => {
  $('#toastMsg').textContent = msg;
  toastEl.className = `toast text-bg-${type} border-0`;
  toast.show();
};

// ===== 深色模式 =====
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const THEME_KEY = 'unilife_theme';

function applyTheme(v) { document.documentElement.setAttribute('data-theme', v);
document.documentElement.setAttribute('data-bs-theme', v) }
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  themeToggle.checked = (saved === 'dark');
  applyTheme(saved);
}
themeToggle.addEventListener('change', () => {
  const v = themeToggle.checked ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, v);
  applyTheme(v);
});

// ===== 課程規劃 / GPA =====
const courseForm = $('#courseForm');
const courseTbody = $('#courseTbody');
const totalCreditsEl = $('#totalCredits');
const avgScoreEl = $('#avgScore');
const gpaEl = $('#gpa');
const emptyHint = $('#emptyHint');
const searchInput = $('#searchInput');
const btnClear = $('#btnClear');
const btnExport = $('#btnExport');

const COURSE_KEY = 'unilife_courses';
let courses = []; // {id, name, credits, gradeRaw, score, letter}

const LETTER_TO_SCORE = {
  'A+': 95, 'A': 90, 'A-': 85,
  'B+': 80, 'B': 75, 'B-': 70,
  'C+': 67, 'C': 63, 'C-': 60,
  'D': 50, 'F': 0
};
function toScore(s) {
  if (s === '' || s == null) return null;
  s = String(s).trim().toUpperCase();
  if (LETTER_TO_SCORE[s] != null) return LETTER_TO_SCORE[s];
  const n = Number(s);
  if (Number.isFinite(n) && n >= 0 && n <= 100) return n;
  return null;
}
function scoreToGPA43(score) {
  // 簡化版（可調整）：90+→4.3, 85→4.0, 80→3.7, 75→3.3, 70→3.0, 67→2.7, 63→2.3, 60→2.0, 50→1.0, 0→0
  if (score >= 90) return 4.3;
  if (score >= 85) return 4.0;
  if (score >= 80) return 3.7;
  if (score >= 75) return 3.3;
  if (score >= 70) return 3.0;
  if (score >= 67) return 2.7;
  if (score >= 63) return 2.3;
  if (score >= 60) return 2.0;
  if (score >= 50) return 1.0;
  return 0.0;
}
function saveCourses() { localStorage.setItem(COURSE_KEY, JSON.stringify(courses)); }
function loadCourses() {
  courses = JSON.parse(localStorage.getItem(COURSE_KEY) || '[]');
  renderCourses();
  calcStats();
}
function addCourse(name, credits, gradeRaw) {
  const score = toScore(gradeRaw ?? '');
  const letter = (typeof gradeRaw === 'string' && LETTER_TO_SCORE[gradeRaw.toUpperCase()] != null)
    ? gradeRaw.toUpperCase() : null;
  const id = crypto.randomUUID();
  courses.push({ id, name, credits, gradeRaw: gradeRaw ?? '', score, letter });
  saveCourses();
  renderCourses();
  calcStats();
  showToast('課程已加入');
}
function removeCourse(id) {
  courses = courses.filter(c => c.id !== id);
  saveCourses();
  renderCourses();
  calcStats();
}
function renderCourses() {
  courseTbody.innerHTML = '';
  const keyword = searchInput.value.trim().toLowerCase();
  const list = courses.filter(c => c.name.toLowerCase().includes(keyword));
  list.forEach(c => {
    const tr = document.createElement('tr');
    tr.classList.add('added');
    tr.innerHTML = `
      <td>
        <span class="fw-medium">${c.name}</span>
        ${c.letter ? `<span class="badge text-bg-light ms-2">${c.letter}</span>` : ''}
      </td>
      <td class="text-center">${c.credits}</td>
      <td class="text-center">${c.score == null ? '—' : Math.round(c.score)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger" data-id="${c.id}">刪除</button>
      </td>
    `;
    courseTbody.appendChild(tr);
  });
  emptyHint.style.display = courses.length === 0 ? '' : 'none';
}
function calcStats() {
  const sumCredits = courses.reduce((a, c) => a + Number(c.credits), 0);
  totalCreditsEl.textContent = sumCredits.toFixed(1).replace(/\.0$/, '');
  if (sumCredits === 0) {
    avgScoreEl.textContent = '—';
    gpaEl.textContent = '—';
    return;
  }
  const weightedScore = courses.reduce((a, c) => a + (Number(c.credits) * (c.score ?? 0)), 0);
  const avgScore = weightedScore / sumCredits;
  const gpa = scoreToGPA43(avgScore);
  avgScoreEl.textContent = avgScore.toFixed(1);
  gpaEl.textContent = gpa.toFixed(2);
}

// 表單驗證（Constraint Validation + 自訂訊息）
courseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#courseName').value.trim();
  const credits = $('#credits').value.trim();
  const gradeRaw = $('#grade').value.trim();

  // HTML5 驗證 + 自訂訊息
  const nameEl = $('#courseName');
  const creditEl = $('#credits');
  nameEl.setCustomValidity('');
  creditEl.setCustomValidity('');

  if (name.length < 2 || name.length > 40) {
    nameEl.setCustomValidity('課程名稱需 2–40 字');
  }
  const c = Number(credits);
  if (!Number.isFinite(c) || c < 0 || c > 10) {
    creditEl.setCustomValidity('學分需介於 0–10（可含 0.5）');
  }

  if (!courseForm.checkValidity()) {
    courseForm.classList.add('was-validated');
    return;
  }

  // 防重複：同名+學分視為重複
  const duplicate = courses.some(x => x.name === name && Number(x.credits) === c);
  if (duplicate) {
    showToast('已存在相同課程與學分', 'warning');
    return;
  }

  addCourse(name, c, gradeRaw);
  courseForm.reset();
  courseForm.classList.remove('was-validated');
});

courseTbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (btn) removeCourse(btn.dataset.id);
});
searchInput.addEventListener('input', renderCourses);
btnClear.addEventListener('click', () => {
  if (courses.length === 0) return;
  if (confirm('確定要清空所有課程？')) {
    courses = [];
    saveCourses();
    renderCourses();
    calcStats();
  }
});
btnExport.addEventListener('click', () => {
  if (courses.length === 0) return showToast('沒有可匯出的內容', 'warning');
  const rows = [['課程','學分','預期成績(文字)','分數(0-100)']];
  courses.forEach(c => rows.push([c.name, c.credits, c.letter ?? '', c.score ?? '']));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'courses.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

// ===== 番茄鐘 =====
const display = $('#timerDisplay');
const phaseLabel = $('#phaseLabel');
const pomCountEl = $('#pomCount');
const btnStart = $('#btnStart');
const btnPause = $('#btnPause');
const btnReset = $('#btnReset');
const focusMin = $('#focusMin');
const breakMin = $('#breakMin');
const longBreakMin = $('#longBreakMin');

const POMO_KEY = 'unilife_pomo_count';
let pomCount = Number(localStorage.getItem(POMO_KEY) || 0);
pomCountEl.textContent = pomCount;

let timer = null;
let remain = 0; // 秒
let phase = 'focus'; // focus | break | long
let cycle = 0; // 完成專注次數（切換長休息判斷）

function initTimer() {
  remain = Number(focusMin.value) * 60;
  phase = 'focus';
  phaseLabel.textContent = '專注';
  updateDisplay();
}
function updateDisplay() {
  const m = String(Math.floor(remain / 60)).padStart(2, '0');
  const s = String(remain % 60).padStart(2, '0');
  display.textContent = `${m}:${s}`;
  display.classList.add('tick');
  setTimeout(() => display.classList.remove('tick'), 120);
}
function tick() {
  if (remain > 0) {
    remain--;
    updateDisplay();
  } else {
    // 階段切換
    if (phase === 'focus') {
      cycle++;
      pomCount++;
      localStorage.setItem(POMO_KEY, pomCount);
      pomCountEl.textContent = pomCount;
      if (cycle % 4 === 0) {
        phase = 'long';
        remain = Number(longBreakMin.value) * 60;
        phaseLabel.textContent = '長休息';
      } else {
        phase = 'break';
        remain = Number(breakMin.value) * 60;
        phaseLabel.textContent = '休息';
      }
    } else {
      phase = 'focus';
      remain = Number(focusMin.value) * 60;
      phaseLabel.textContent = '專注';
    }
    showToast(`切換至「${phaseLabel.textContent}」`);
    updateDisplay();
  }
}
btnStart.addEventListener('click', () => {
  if (timer) return;
  if (remain <= 0) initTimer();
  timer = setInterval(tick, 1000);
});
btnPause.addEventListener('click', () => {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
});
btnReset.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  cycle = 0;
  initTimer();
});

// 任務清單（今日）
const taskForm = $('#taskForm');
const taskInput = $('#taskInput');
const taskList = $('#taskList');
const TASK_KEY = 'unilife_tasks';
let tasks = []; // {id, text, done}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem(TASK_KEY) || '[]');
  renderTasks();
}
function saveTasks() { localStorage.setItem(TASK_KEY, JSON.stringify(tasks)); }
function addTask(text) {
  tasks.push({ id: crypto.randomUUID(), text, done: false });
  saveTasks();
  renderTasks();
}
function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t) t.done = !t.done;
  saveTasks();
  renderTasks();
}
function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center justify-content-between';
    li.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" ${t.done ? 'checked' : ''} id="chk-${t.id}">
        <label class="form-check-label ${t.done ? 'text-decoration-line-through text-body-secondary' : ''}" for="chk-${t.id}">${t.text}</label>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary" data-act="toggle" data-id="${t.id}">${t.done ? '復原' : '完成'}</button>
        <button class="btn btn-outline-danger" data-act="del" data-id="${t.id}">刪除</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  taskInput.setCustomValidity('');
  const text = taskInput.value.trim();
  if (text.length < 2 || text.length > 60) {
    taskInput.setCustomValidity('請輸入 2–60 字');
    taskForm.classList.add('was-validated');
    return;
  }
  addTask(text);
  taskForm.reset();
  taskForm.classList.remove('was-validated');
});
taskList.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.act === 'toggle') toggleTask(id);
  if (btn.dataset.act === 'del') removeTask(id);
});
$('#btnClearDone').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
});

// ===== 初始載入 =====
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadCourses();
  loadTasks();
  initTimer();
});
