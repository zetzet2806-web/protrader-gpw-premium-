const ADMIN_PASSWORD = "ADMIN-GPW";

const STORAGE_KEY_CODES = "ptgpw_codes";
const STORAGE_KEY_SESSION = "ptgpw_session";

function loadCodes() {
  const raw = localStorage.getItem(STORAGE_KEY_CODES);
  return raw ? JSON.parse(raw) : [];
}

function saveCodes(codes) {
  localStorage.setItem(STORAGE_KEY_CODES, JSON.stringify(codes));
}

function addCode(code) {
  const codes = loadCodes();
  if (!codes.includes(code)) {
    codes.push(code);
    saveCodes(codes);
  }
}

function isCodeValid(code) {
  return loadCodes().includes(code);
}

function setSession(active) {
  if (active) localStorage.setItem(STORAGE_KEY_SESSION, "1");
  else localStorage.removeItem(STORAGE_KEY_SESSION);
}

function isLoggedIn() {
  return localStorage.getItem(STORAGE_KEY_SESSION) === "1";
}

function logoutUser() {
  setSession(false);
  window.location.href = "index.html";
}

if (location.pathname.endsWith("premium.html")) {
  if (!isLoggedIn()) window.location.replace("login.html");
}

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const code = document.getElementById("accessCode").value.trim();
      const msg = document.getElementById("msg");

      if (isCodeValid(code)) {
        msg.textContent = "Kod poprawny. Logowanie…";
        msg.style.color = "#4caf50";
        setSession(true);
        setTimeout(() => window.location.href = "premium.html", 600);
      } else {
        msg.textContent = "Nieprawidłowy kod.";
        msg.style.color = "#ff5252";
      }
    });
  }

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      const pass = document.getElementById("adminPass").value.trim();
      const msg = document.getElementById("adminMsg");
      const panel = document.getElementById("adminPanel");

      if (pass === ADMIN_PASSWORD) {
        msg.textContent = "Zalogowano.";
        msg.style.color = "#4caf50";
        panel.style.display = "block";
        renderCodes();
      } else {
        msg.textContent = "Błędne hasło.";
        msg.style.color = "#ff5252";
      }
    });
  }

  const addCodeBtn = document.getElementById("addCodeBtn");
  if (addCodeBtn) {
    addCodeBtn.addEventListener("click", () => {
      const code = document.getElementById("newCode").value.trim();
      if (!code) return;
      addCode(code);
      document.getElementById("newCode").value = "";
      renderCodes();
    });
  }

  function renderCodes() {
    const list = document.getElementById("codesList");
    if (!list) return;
    list.innerHTML = "";
    loadCodes().forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      list.appendChild(li);
    });
  }
});
