/* "More info" pop-up: synopsis, director, details and cast */
(function () {
  const modal = document.createElement("div");
  modal.className = "tm im";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "More info");
  modal.innerHTML =
    '<div class="tm-box im-box">' +
    '<button class="tm-close" type="button" aria-label="Close">&#10005;</button>' +
    '<div class="im-head"><div class="im-poster" aria-hidden="true"></div><div class="im-top">' +
    '<h2></h2><p class="tm-meta"></p><p class="im-dirline"></p>' +
    '<div class="hero-actions"><button class="btn btn-red" type="button" data-trailer="">&#9654; Play Trailer</button>' +
    '<button class="btn btn-ghost" type="button" data-save="">+ My List</button>' +
    '<a class="btn btn-ghost im-page" href="#">Open page</a></div></div></div>' +
    '<div class="im-body"><h3>Synopsis</h3><p class="im-syn"></p>' +
    '<h3>Director</h3><p class="im-dir"></p>' +
    '<h3>Details</h3><p class="im-det"></p>' +
    '<h3>Cast</h3><ul class="im-cast"></ul></div></div>';
  document.body.append(modal);

  const q = (s) => modal.querySelector(s);
  const closeBtn = q(".tm-close");
  let token = 0;
  let opener = null;

  function thumb(src, cls, alt) {
    const el = document.createElement("img");
    el.className = cls;
    el.alt = alt || "";
    el.loading = "lazy";
    el.referrerPolicy = "no-referrer";
    if (src) el.src = src;
    el.addEventListener("error", () => { el.style.visibility = "hidden"; });
    return el;
  }

  async function open(id) {
    const a = ANIME.find((x) => x.id === id);
    if (!a) return;
    const my = ++token;
    if (modal.hidden) opener = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("tm-open");
    q("h2").textContent = a.title;
    q(".tm-meta").textContent = "\u2605 " + a.rating + "   " + a.year + "   " + a.genres.join(", ");
    q(".im-dirline").textContent = "";
    q(".im-syn").textContent = a.desc;
    q(".im-dir").textContent = "Loading...";
    q(".im-det").textContent = "Loading...";
    q(".im-cast").textContent = "";
    q(".im-page").href = "player.html?id=" + a.id;
    const posterBox = q(".im-poster");
    posterBox.style.setProperty("--a", a.a);
    posterBox.style.setProperty("--b", a.b);
    posterBox.style.backgroundImage = "";
    if (a.poster) { posterBox.style.setProperty("--img", 'url("' + a.poster + '")'); posterBox.classList.add("has-poster"); }
    else posterBox.classList.remove("has-poster");
    q("[data-trailer]").dataset.trailer = a.id;
    q("[data-save]").dataset.save = a.id;
    if (typeof refreshSaveButtons === "function") refreshSaveButtons();
    modal.scrollTop = 0;
    closeBtn.focus();

    loadDetails(a.id).then((d) => {
      if (my !== token) return;
      if (d && d.synopsis) q(".im-syn").textContent = d.synopsis;
      const parts = [];
      if (d) {
        if (d.episodes) parts.push(d.episodes + (d.episodes === 1 ? " episode" : " episodes"));
        if (d.status) parts.push(d.status);
        if (d.studios && d.studios.length) parts.push("Studio: " + d.studios.join(", "));
        if (d.aired) parts.push("Aired: " + d.aired);
      }
      q(".im-det").textContent = parts.length ? parts.join("  \u2022  ") : "Details are not available right now.";
    });

    loadPeople(a.id).then((p) => {
      if (my !== token) return;
      const dir = p && p.dir && p.dir.length ? p.dir.join(", ") : "";
      q(".im-dir").textContent = dir || "Not listed";
      q(".im-dirline").textContent = dir ? "Directed by " + dir : "";
      const ul = q(".im-cast");
      ul.textContent = "";
      if (!p || !p.cast.length) {
        const li = document.createElement("li");
        li.className = "im-none";
        li.textContent = "Cast could not load right now.";
        ul.append(li);
        return;
      }
      p.cast.slice(0, 8).forEach((c) => {
        const li = document.createElement("li");
        li.append(thumb(c.i, "im-cimg", c.n));
        const t = document.createElement("span");
        const n = document.createElement("strong");
        n.textContent = c.n;
        t.append(n);
        if (c.v) { const s = document.createElement("small"); s.textContent = "Voiced by " + c.v; t.append(s); }
        li.append(t);
        ul.append(li);
      });
    });
  }

  function close() {
    token++;
    modal.hidden = true;
    document.body.classList.remove("tm-open");
    if (opener && opener.focus) opener.focus();
  }

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  // Runs before trailer.js, so the info pop-up closes and the trailer pop-up takes over
  document.addEventListener("click", (e) => {
    if (!modal.hidden && e.target.closest && e.target.closest(".im [data-trailer]")) {
      token++;
      modal.hidden = true;
      document.body.classList.remove("tm-open");
    }
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-info]");
    if (!t || !t.dataset.info) return;
    e.preventDefault();
    e.stopPropagation();
    open(t.dataset.info);
  }, true);

  window.openInfo = open;
})();
