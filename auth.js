/* Demo-only accounts stored in this browser (localStorage).
   For a real site, replace with a backend or Google Sign-In. */
const BB = {
  users() { try { return JSON.parse(localStorage.getItem("bb_users")) || {}; } catch (e) { return {}; } },
  saveUsers(u) { try { localStorage.setItem("bb_users", JSON.stringify(u)); } catch (e) {} },
  current() { try { return localStorage.getItem("bb_session"); } catch (e) { return null; } },
  login(email) { try { localStorage.setItem("bb_session", email); } catch (e) {} },
  logout() { try { localStorage.removeItem("bb_session"); } catch (e) {} },
  isGmail(email) { return /^[^\s@]+@gmail\.com$/i.test(email); }
};

// Nav button: Sign in / Sign out
(function () {
  const link = document.getElementById("authLink");
  if (!link) return;
  if (BB.current()) {
    link.textContent = "Sign out";
    link.href = "#";
    link.addEventListener("click", (e) => { e.preventDefault(); BB.logout(); location.reload(); });
  } else {
    link.href = "auth.html";
  }
})();

// Sign up / sign in page
(function () {
  const form = document.getElementById("authForm");
  if (!form) return;
  const tabs = document.querySelectorAll(".tab");
  const nameRow = document.getElementById("nameRow");
  const msg = document.getElementById("authMsg");
  const submit = document.getElementById("authSubmit");
  let mode = "signup";

  function setMode(m) {
    mode = m;
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.mode === m)));
    nameRow.hidden = m !== "signup";
    submit.textContent = m === "signup" ? "Create account" : "Sign in";
    msg.textContent = "";
  }
  tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
  if (new URLSearchParams(location.search).get("mode") === "signin") setMode("signin");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const pass = form.password.value;
    const users = BB.users();
    if (!BB.isGmail(email)) { msg.textContent = "Please use a Gmail address (name@gmail.com)."; return; }
    if (pass.length < 6) { msg.textContent = "Password must be at least 6 characters."; return; }
    if (mode === "signup") {
      if (users[email]) { msg.textContent = "That Gmail is already registered. Sign in instead."; return; }
      users[email] = { name: form.name.value.trim() || email.split("@")[0], pass };
      BB.saveUsers(users);
    } else if (!users[email] || users[email].pass !== pass) {
      msg.textContent = "Wrong Gmail or password."; return;
    }
    BB.login(email);
    const next = new URLSearchParams(location.search).get("next") || "";
    location.href = /^[\w-]+\.html(\?[\w=&-]*)?$/.test(next) ? next : "index.html";
  });
})();
