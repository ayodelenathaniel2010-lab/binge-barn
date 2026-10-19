(async function () {
  const params = new URLSearchParams(location.search);
  const anime = ANIME.find((x) => x.id === params.get("id")) || ANIME[0];
  const user = BB.current();
  const here = "player.html?id=" + anime.id + "&watch=full";
  const authUrl = (mode) => "auth.html?mode=" + mode + "&next=" + encodeURIComponent(here);
  const ytSearch = "https://www.youtube.com/results?search_query=" + encodeURIComponent(anime.title + " official trailer");

  // ---- Page text (shown immediately) ----
  document.title = anime.title + " - Binge Barn";
  document.getElementById("title").textContent = anime.title;
  document.getElementById("rating").textContent = "\u2605 " + anime.rating;
  document.getElementById("year").textContent = anime.year;
  document.getElementById("genres").textContent = anime.genres.join(", ");
  document.getElementById("desc").textContent = anime.desc;
  document.getElementById("saveBtn").dataset.save = anime.id;
  document.getElementById("infoBtn").dataset.info = anime.id;
  refreshSaveButtons();
  const stage = document.getElementById("stage");
  stage.style.setProperty("--a", anime.a);
  stage.style.setProperty("--b", anime.b);
  document.getElementById("lockSignup").href = authUrl("signup");
  document.getElementById("lockSignin").href = authUrl("signin");
  document.getElementById("bannerSignup").href = authUrl("signup");
  if (user) document.getElementById("banner").hidden = true;

  // ---- A bit more about the anime (synopsis and facts) ----
  const about = document.getElementById("about");
  const facts = document.getElementById("facts");
  loadDetails(anime.id).then((d) => {
    if (!d) return;
    if (d.synopsis) {
      let text = d.synopsis.replace(/\s+/g, " ");
      let cut = false;
      if (text.length > 380) {
        text = text.slice(0, 380);
        text = text.slice(0, Math.max(text.lastIndexOf(" "), 200)).replace(/[,;:\s]+$/, "") + "...";
        cut = true;
      }
      about.textContent = text + " ";
      if (cut) {
        const more = document.createElement("button");
        more.type = "button";
        more.className = "link-btn";
        more.dataset.info = anime.id;
        more.textContent = "Read more";
        about.append(more);
      }
      about.hidden = false;
    }
    const parts = [];
    if (d.episodes) parts.push(d.episodes + (d.episodes === 1 ? " episode" : " episodes"));
    if (d.status) parts.push(d.status);
    if (d.studios && d.studios.length) parts.push("Studio: " + d.studios.join(", "));
    if (parts.length) { facts.textContent = parts.join("  \u2022  "); facts.hidden = false; }
  });

  // ---- Player: Trailer (everyone) or Full anime (members; guests get a preview) ----
  const video = document.getElementById("video");
  const lock = document.getElementById("lock");
  const badge = document.getElementById("badge");
  const hint = document.getElementById("soundHint");
  const tabs = document.querySelectorAll(".stage-tab");
  let mode = "";
  let frameEl = null;

  const ytCmd = (f, fn) => {
    try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: [] }), "*"); } catch (e) {}
  };

  function setTabs() {
    tabs.forEach((t) => {
      const on = t.dataset.mode === mode;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", String(on));
    });
  }

  function clearStage() {
    stage.querySelectorAll(".trailer-frame, .stage-msg").forEach((n) => n.remove());
    frameEl = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
    lock.hidden = true;
    hint.hidden = true;
  }

  function stageMsg(text, withLink) {
    const m = document.createElement("div");
    m.className = "tm-msg stage-msg";
    m.append(text + " ");
    if (withLink) {
      const a = document.createElement("a");
      a.className = "btn btn-red small";
      a.href = ytSearch;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Search on YouTube";
      m.append(a);
    }
    stage.prepend(m);
    return m;
  }

  async function showTrailer() {
    mode = "trailer";
    clearStage();
    setTabs();
    badge.textContent = "Official trailer";
    const loading = stageMsg("Loading trailer...", false);
    let tid = await resolveTrailer(anime);
    if (mode !== "trailer") return;
    if (!tid) {
      const alts = await trailerAlts(anime);
      if (mode !== "trailer") return;
      tid = alts[0] || "";
    }
    loading.remove();
    const tried = new Set();
    // Start with sound when the browser allows it, otherwise muted with a "turn sound on" button
    const quiet = !(navigator.userActivation && navigator.userActivation.hasBeenActive);
    const frame = (vid) => {
      stage.querySelectorAll(".trailer-frame, .stage-msg").forEach((n) => n.remove());
      if (!vid) { stageMsg("This trailer could not play here.", true); return; }
      tried.add(vid);
      const f = document.createElement("iframe");
      f.className = "trailer-frame";
      f.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1&mute=" + (quiet ? 1 : 0) + "&rel=0&modestbranding=1&playsinline=1&enablejsapi=1";
      f.allow = "autoplay; encrypted-media; fullscreen";
      f.allowFullscreen = true;
      f.title = anime.title + " trailer";
      stage.prepend(f);
      frameEl = f;
      hint.hidden = !quiet;
      watchYT(f, async () => {
        if (mode !== "trailer") return;
        const alts = await trailerAlts(anime);
        if (mode !== "trailer") return;
        frame(alts.find((x) => !tried.has(x)) || "");
      }, () => { if (anime.trailer !== vid) setWorkingTrailer(anime, vid); });
    };
    frame(tid);
  }

  function showFull() {
    mode = "full";
    clearStage();
    setTabs();
    video.hidden = false;
    video.src = anime.video;
    video.muted = false;
    badge.textContent = user ? "Full access" : "Preview: first " + PREVIEW_SECONDS + " seconds";
    const p = video.play();
    if (p) p.catch(() => { video.muted = true; video.play().catch(() => {}); hint.hidden = false; });
  }

  // Guests can only watch the first seconds of the full anime
  function guard() {
    if (mode !== "full" || user) return;
    if (video.currentTime >= PREVIEW_SECONDS) {
      video.pause();
      video.currentTime = Math.min(video.currentTime, PREVIEW_SECONDS);
      lock.hidden = false;
    }
  }
  video.addEventListener("timeupdate", guard);
  video.addEventListener("seeking", guard);
  video.addEventListener("play", guard);

  hint.addEventListener("click", () => {
    hint.hidden = true;
    if (mode === "trailer" && frameEl) ytCmd(frameEl, "unMute");
    else { video.muted = false; video.play().catch(() => {}); }
  });
  tabs.forEach((t) => t.addEventListener("click", () => { if (t.dataset.mode === "full") showFull(); else showTrailer(); }));

  if (params.get("watch") === "full") showFull(); else showTrailer();

  // ---- Suggestions: same genre first, then top rated ----
  const others = ANIME.filter((x) => x.id !== anime.id);
  const shared = (x) => x.genres.filter((g) => anime.genres.includes(g)).length;
  others.sort((p, q) => shared(q) - shared(p) || q.rating - p.rating);
  const list = document.getElementById("suggestions");
  others.slice(0, 8).forEach((x) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "card";
    a.href = "player.html?id=" + x.id;
    a.style.setProperty("--a", x.a);
    a.style.setProperty("--b", x.b);
    const s = document.createElement("strong");
    s.textContent = x.title;
    const r = document.createElement("span");
    r.className = "score";
    r.textContent = "\u2605 " + x.rating;
    a.append(s, r);
    li.appendChild(a);
    list.appendChild(li);
  });
  applyPosters();
})();
