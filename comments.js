/* Comments on each anime page.
   Demo mode: comments are saved in this browser only (localStorage).
   To share comments between visitors, replace the Store object with calls to a backend. */
(function () {
  const box = document.getElementById("comments");
  if (!box) return;
  const id = new URLSearchParams(location.search).get("id") || ANIME[0].id;
  const MAX = 500;
  const title = document.getElementById("commentsTitle");
  const formBox = document.getElementById("commentForm");
  const list = document.getElementById("commentList");

  const Store = {
    all() { try { return JSON.parse(localStorage.getItem("bb_comments")) || {}; } catch (e) { return {}; } },
    list(a) { return this.all()[a] || []; },
    save(all) { try { localStorage.setItem("bb_comments", JSON.stringify(all)); } catch (e) {} },
    add(a, c) { const all = this.all(); (all[a] = all[a] || []).push(c); this.save(all); },
    remove(a, cid) { const all = this.all(); all[a] = (all[a] || []).filter((c) => c.id !== cid); this.save(all); }
  };

  const user = BB.current();
  const displayName = user ? ((BB.users()[user] || {}).name || user.split("@")[0]) : "";

  function ago(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + (m === 1 ? " minute ago" : " minutes ago");
    const h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
    const d = Math.floor(h / 24);
    if (d < 30) return d + (d === 1 ? " day ago" : " days ago");
    return new Date(ts).toLocaleDateString();
  }

  function buildForm() {
    formBox.textContent = "";
    if (!user) {
      const p = document.createElement("p");
      p.className = "comment-login";
      p.append("Want to join the conversation? ");
      const a = document.createElement("a");
      a.href = "auth.html?mode=signin&next=" + encodeURIComponent("player.html?id=" + id);
      a.textContent = "Sign in or sign up with Gmail";
      p.append(a, " to leave a comment.");
      formBox.append(p);
      return;
    }
    const form = document.createElement("form");
    form.className = "comment-form";
    const label = document.createElement("label");
    label.textContent = "Commenting as " + displayName;
    const ta = document.createElement("textarea");
    ta.rows = 3;
    ta.maxLength = MAX;
    ta.placeholder = "What did you think of this anime?";
    label.append(ta);
    const row = document.createElement("div");
    row.className = "comment-row";
    const count = document.createElement("small");
    count.textContent = "0/" + MAX;
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.className = "btn btn-red small";
    btn.textContent = "Post comment";
    row.append(count, btn);
    const err = document.createElement("p");
    err.className = "form-msg";
    err.setAttribute("role", "alert");
    form.append(label, err, row);
    ta.addEventListener("input", () => { count.textContent = ta.value.length + "/" + MAX; });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (!text) { err.textContent = "Write something before posting."; return; }
      err.textContent = "";
      Store.add(id, {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        email: user, name: displayName, text: text.slice(0, MAX), ts: Date.now()
      });
      ta.value = "";
      count.textContent = "0/" + MAX;
      render();
    });
    formBox.append(form);
  }

  function render() {
    const items = Store.list(id).slice().sort((a, b) => b.ts - a.ts);
    title.textContent = "Comments (" + items.length + ")";
    list.textContent = "";
    if (!items.length) {
      const li = document.createElement("li");
      li.className = "comment-empty";
      li.textContent = "No comments yet. Be the first to share what you thought.";
      list.append(li);
      return;
    }
    items.forEach((c) => {
      const li = document.createElement("li");
      li.className = "comment";
      const av = document.createElement("span");
      av.className = "avatar";
      av.setAttribute("aria-hidden", "true");
      av.textContent = (c.name || "?").charAt(0).toUpperCase();
      const body = document.createElement("div");
      body.className = "comment-body";
      const head = document.createElement("div");
      head.className = "comment-head";
      const name = document.createElement("strong");
      name.textContent = c.name;
      const time = document.createElement("small");
      time.textContent = ago(c.ts);
      head.append(name, time);
      const text = document.createElement("p");
      text.textContent = c.text;
      body.append(head, text);
      if (user && c.email === user) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "comment-del";
        del.textContent = "Delete";
        del.addEventListener("click", () => {
          if (confirm("Delete this comment?")) { Store.remove(id, c.id); render(); }
        });
        body.append(del);
      }
      li.append(av, body);
      list.append(li);
    });
  }

  buildForm();
  render();
})();
