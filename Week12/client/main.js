const API = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token") || "";
}
function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}
function setMe(user) {
  if (user) localStorage.setItem("me", JSON.stringify(user));
  else localStorage.removeItem("me");
}
function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
function renderMe() {
  const me = localStorage.getItem("me");
  const token = getToken();
  document.querySelector("#me").textContent = me ? me : "未登入";
  document.querySelector("#tokenPreview").textContent = token ? token.slice(0, 20) + "..." : "-";
}

async function login(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || "login failed");
  setToken(data.token);
  setMe(data.user);
  renderMe();
}

async function refreshList() {
  const r = await fetch(`${API}/api/signup`, { headers: { ...authHeaders() } });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || "fetch failed");

  const ul = document.querySelector("#list");
  ul.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} | ${item.email} | ${item.phone} | ownerId=${item.ownerId} `;
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = async () => {
      const rr = await fetch(`${API}/api/signup/${item._id}`, {
        method: "DELETE",
        headers: { ...authHeaders() }
      });
      const dd = await rr.json();
      if (!rr.ok) alert(dd?.error || "delete failed");
      await refreshList();
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function createSignup() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const phone = document.querySelector("#phone").value.trim();

  const r = await fetch(`${API}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, email, phone })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || "create failed");
  await refreshList();
}

document.querySelector("#btnLogin").onclick = async () => {
  try {
    await login(
      document.querySelector("#loginEmail").value.trim(),
      document.querySelector("#loginPassword").value
    );
    await refreshList();
  } catch (e) {
    alert(e.message);
  }
};

document.querySelector("#btnLogout").onclick = () => {
  setToken("");
  setMe(null);
  renderMe();
};

document.querySelector("#btnRefresh").onclick = async () => {
  try { await refreshList(); } catch (e) { alert(e.message); }
};

document.querySelector("#btnCreate").onclick = async () => {
  try { await createSignup(); } catch (e) { alert(e.message); }
};

renderMe();
