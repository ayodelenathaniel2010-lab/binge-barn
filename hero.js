/* Homepage hero: rotating anime trailers (muted by default, with a sound button) */
(function () {
  const hero = document.getElementById("hero");
  if (!hero) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FEATURED = ["frieren", "jjk", "aot", "demonslayer", "dandadan", "onepunchman"]
    .map((id) => ANIME.find((a) => a.id === id)).filter(Boolean);
  const SLIDE_MS = 22000;

  const mediaBox = document.getElementById("heroMedia");
  const title = document.getElementById("heroTitle");
  const meta = document.getElementById("heroMeta");
  const desc = document.getElementById("heroDesc");
  const play = document.getElementById("heroPlay");
  const info = document.getElementById("heroInfo");
  const save = document.getElementById("heroSave");
  const mute = document.getElementById("heroMute");
  const picks = document.getElementById("heroPicks");
  picks.style.setProperty("--slide", SLIDE_MS / 1000 + "s");

  let idx = 0, timer = null, muted = true, cur = null, token = 0;

  const ytUrl = (id) => "https://www.youtube-nocookie.com/embed/" + id +
    "?autoplay=1&mute=1&controls=0&loop=1&playlist=" + id + "&rel=0&modestbranding=1&playsinline=1&disablekb=1&enablejsapi=1";
  const ytCmd = (f, fn) => {
    try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: [] }), "*"); } catch (e) {}
  };

  function buildMedia(a) {
    if (a.trailer) {
      const f = document.createElement("iframe");
      f.className = "hero-video";
      f.src = ytUrl(a.trailer);
      f.allow = "autoplay; encrypted-media";
      f.tabIndex = -1;
      f.title = "";
      f.setAttribute("aria-hidden", "true");
      f.addEventListener("load", () => { if (!muted) setTimeout(() => ytCmd(f, "unMute"), 900); });
      watchYT(f, () => { if (cur && cur.el === f) show(idx + 1); }, () => { if (a.trailer) setWorkingTrailer(a, a.trailer); });
      return { el: f, setMuted: (m) => ytCmd(f, m ? "mute" : "unMute") };
    }
    const v = document.createElement("video");
    v.className = "hero-video";
    v.src = a.video;
    v.loop = true;
    v.playsInline = true;
    v.muted = muted;
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
    return { el: v, setMuted: (m) => { v.muted = m; if (!m) v.play().catch(() => {}); } };
  }

  // Poster thumbnails to pick a trailer
  FEATURED.forEach((a, n) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pick";
    b.title = a.title;
    b.setAttribute("aria-label", "Play " + a.title);
    const t = document.createElement("span");
    t.className = "pick-thumb";
    t.style.setProperty("--a", a.a);
    t.style.setProperty("--b", a.b);
    b.append(t);
    b.addEventListener("click", () => show(n));
    li.append(b);
    picks.append(li);
  });
  function refreshThumbs() {
    picks.querySelectorAll(".pick-thumb").forEach((t, n) => {
      const a = FEATURED[n];
      if (a && a.poster) { t.style.setProperty("--img", 'url("' + a.poster + '")'); t.classList.add("has-poster"); }
    });
  }
  document.addEventListener("posters-updated", refreshThumbs);
  refreshThumbs();

  function schedule() {
    clearTimeout(timer);
    if (!reduce) timer = setTimeout(() => show(idx + 1), SLIDE_MS);
  }

  function stopMedia() {
    token++;
    clearTimeout(timer);
    if (cur) { cur.el.remove(); cur = null; }
  }

  async function show(i) {
    idx = (i + FEATURED.length) % FEATURED.length;
    const a = FEATURED[idx];
    const my = ++token;
    title.textContent = a.title;
    meta.textContent = "\u2605 " + a.rating + "   " + a.year + "   " + a.genres.slice(0, 3).join(", ");
    desc.textContent = a.desc;
    play.dataset.trailer = a.id;
    save.dataset.save = a.id;
    refreshSaveButtons();
    info.dataset.info = a.id;
    hero.style.setProperty("--ha", a.a);
    hero.style.setProperty("--hb", a.b);
    const btns = picks.querySelectorAll(".pick");
    btns.forEach((b) => { b.classList.remove("on"); b.removeAttribute("aria-current"); });
    void picks.offsetWidth;
    btns[idx].classList.add("on");
    btns[idx].setAttribute("aria-current", "true");
    schedule();
    if (reduce || document.body.classList.contains("tm-open") || document.hidden) return;

    await resolveTrailer(a);
    if (my !== token) return;
    if (!a.trailer) {
      const alts = await trailerAlts(a);
      if (my !== token) return;
      if (alts[0]) a.trailer = alts[0];
    }
    const old = cur;
    const m = buildMedia(a);
    cur = m;
    mediaBox.append(m.el);
    requestAnimationFrame(() => requestAnimationFrame(() => m.el.classList.add("is-in")));
    if (old) {
      old.setMuted(true);
      old.el.classList.remove("is-in");
      setTimeout(() => old.el.remove(), 900);
    }
  }

  mute.addEventListener("click", () => {
    muted = !muted;
    mute.textContent = muted ? "Sound off" : "Sound on";
    if (cur) cur.setMuted(muted);
  });

  // Pause the hero while the trailer pop-up is open or the tab is hidden
  new MutationObserver(() => {
    if (document.body.classList.contains("tm-open")) stopMedia(); else show(idx);
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopMedia(); else show(idx); });

  show(0);
})();
