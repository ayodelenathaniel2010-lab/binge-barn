(function () {
  const modal = document.createElement("div");
  modal.className = "tm";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Trailer");
  modal.innerHTML =
    '<div class="tm-box">' +
    '<button class="tm-close" type="button" aria-label="Close trailer">&#10005;</button>' +
    '<div class="tm-stage"></div>' +
    '<div class="tm-info"><h2></h2><p class="tm-meta"></p><p class="tm-desc"></p>' +
    '<div class="hero-actions"><a class="btn btn-red tm-watch" href="#">Watch on Binge Barn</a>' +
    '<button class="btn btn-ghost tm-save" type="button" data-save="">+ My List</button>' +
    '<a class="btn btn-ghost tm-yt" target="_blank" rel="noopener" href="#">Open on YouTube</a></div></div>' +
    '<h3 class="tm-next-title">Up next</h3><ul class="tm-next"></ul></div>';
  document.body.append(modal);

  const stage = modal.querySelector(".tm-stage");
  const closeBtn = modal.querySelector(".tm-close");
  const nextList = modal.querySelector(".tm-next");
  let token = 0;
  let opener = null;

  const searchUrl = (a) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(a.title + " official trailer");

  async function open(id) {
    const a = ANIME.find((x) => x.id === id);
    if (!a) return;
    const my = ++token;
    if (modal.hidden) { opener = document.activeElement; }
    modal.hidden = false;
    document.body.classList.add("tm-open");
    modal.querySelector("h2").textContent = a.title;
    modal.querySelector(".tm-meta").textContent = "\u2605 " + a.rating + "   " + a.year + "   " + a.genres.join(", ");
    modal.querySelector(".tm-desc").textContent = a.desc;
    modal.querySelector(".tm-watch").href = "player.html?id=" + a.id;
    modal.querySelector(".tm-yt").href = searchUrl(a);
    modal.querySelector(".tm-save").dataset.save = a.id;
    if (typeof refreshSaveButtons === "function") refreshSaveButtons();
    stage.textContent = "Loading trailer...";
    stage.className = "tm-stage tm-msg";

    // Up next: the next titles in the list
    nextList.textContent = "";
    const i = ANIME.indexOf(a);
    for (let k = 1; k <= 6; k++) {
      const n = ANIME[(i + k) % ANIME.length];
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      const sw = document.createElement("span");
      sw.className = "sr-swatch";
      sw.style.setProperty("--a", n.a);
      sw.style.setProperty("--b", n.b);
      if (n.poster) { sw.style.setProperty("--img", 'url("' + n.poster + '")'); sw.classList.add("has-poster"); }
      const t = document.createElement("span");
      t.textContent = n.title;
      b.append(sw, t);
      b.addEventListener("click", () => open(n.id));
      li.append(b);
      nextList.append(li);
    }
    closeBtn.focus();

    let tid = await resolveTrailer(a);
    if (my !== token) return;
    if (!tid) {
      const alts = await trailerAlts(a);
      if (my !== token) return;
      tid = alts[0] || "";
    }
    const tried = new Set();
    const showFrame = (vid) => {
      stage.textContent = "";
      if (!vid) {
        stage.className = "tm-stage tm-msg";
        stage.textContent = "This trailer could not play here. Use Open on YouTube to watch it.";
        return;
      }
      tried.add(vid);
      stage.className = "tm-stage";
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1";
      f.allow = "autoplay; encrypted-media; fullscreen";
      f.allowFullscreen = true;
      f.title = a.title + " trailer";
      stage.append(f);
      modal.querySelector(".tm-yt").href = "https://www.youtube.com/watch?v=" + vid;
      watchYT(f, async () => {
        if (my !== token) return;
        const alts = await trailerAlts(a);
        if (my !== token) return;
        showFrame(alts.find((x) => !tried.has(x)) || "");
      }, () => { if (a.trailer !== vid) setWorkingTrailer(a, vid); });
    };
    showFrame(tid);
  }

  function close() {
    token++;
    modal.hidden = true;
    stage.textContent = "";
    document.body.classList.remove("tm-open");
    if (opener && opener.focus) opener.focus();
  }

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-trailer]");
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    open(t.dataset.trailer);
  }, true);

  window.openTrailer = open;
})();
