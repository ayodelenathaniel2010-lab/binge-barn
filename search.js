(function () {
  const form = document.querySelector(".search");
  if (!form || typeof ANIME === "undefined") return;
  const input = form.querySelector("input");
  const list = document.createElement("ul");
  list.className = "search-results";
  list.id = "searchResults";
  list.setAttribute("role", "listbox");
  list.hidden = true;
  form.append(list);
  input.autocomplete = "off";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", "searchResults");

  let results = [];
  let active = -1;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

  function find(raw) {
    const q = norm(raw);
    if (!q) return [];
    const words = q.split(" ");
    return ANIME.map((a) => {
      const t = norm(a.title);
      let s = 0;
      if (t.startsWith(q)) s = 5;
      else if (t.split(" ").some((w) => w.startsWith(q))) s = 4;
      else if (t.includes(q)) s = 3;
      else if (words.every((w) => t.includes(w))) s = 2;
      else if (a.genres.some((g) => norm(g).startsWith(q))) s = 1;
      return { a, s };
    })
      .filter((x) => x.s)
      .sort((p, q2) => q2.s - p.s || q2.a.rating - p.a.rating)
      .slice(0, 6)
      .map((x) => x.a);
  }

  function setActive(i) {
    const items = list.querySelectorAll("[role=option]");
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach((el, n) => {
      el.classList.toggle("active", n === active);
      el.setAttribute("aria-selected", String(n === active));
    });
    input.setAttribute("aria-activedescendant", items[active].id);
  }

  function close() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function render() {
    const q = input.value.trim();
    list.textContent = "";
    active = -1;
    if (!q) { close(); return; }
    results = find(q);
    if (!results.length) {
      const li = document.createElement("li");
      li.className = "search-empty";
      li.textContent = "No anime found for \"" + q + "\". Try another title or genre.";
      list.append(li);
    }
    results.forEach((a, n) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.id = "result-" + n;
      const link = document.createElement("a");
      link.href = "player.html?id=" + a.id;
      const sw = document.createElement("span");
      sw.className = "sr-swatch";
      sw.style.setProperty("--a", a.a);
      sw.style.setProperty("--b", a.b);
      if (a.poster) { sw.style.setProperty("--img", 'url("' + a.poster + '")'); sw.classList.add("has-poster"); }
      const text = document.createElement("span");
      text.className = "sr-text";
      const title = document.createElement("strong");
      title.textContent = a.title;
      const meta = document.createElement("small");
      meta.textContent = "★ " + a.rating + "   " + a.year + "   " + a.genres.slice(0, 2).join(", ");
      text.append(title, meta);
      link.append(sw, text);
      li.append(link);
      li.addEventListener("mouseenter", () => setActive(n));
      list.append(li);
    });
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    if (results.length) setActive(0);
  }

  function go() {
    const pick = results[active >= 0 ? active : 0];
    if (pick) location.href = "player.html?id=" + pick.id;
  }

  input.addEventListener("input", render);
  input.addEventListener("focus", () => { if (input.value.trim()) render(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) render(); else setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Escape") { close(); input.blur(); }
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); go(); });
  document.addEventListener("click", (e) => { if (!form.contains(e.target)) close(); });
})();
