(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverOK = matchMedia("(hover: hover)").matches;
  const byId = (id) => ANIME.find((x) => x.id === id);
  let soundOn = true;
  let timer = null;

  const ytUrl = (id) => "https://www.youtube-nocookie.com/embed/" + id +
    "?autoplay=1&mute=1&controls=0&loop=1&playlist=" + id + "&rel=0&modestbranding=1&playsinline=1&enablejsapi=1";
  const ytCmd = (f, fn) => {
    try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: [] }), "*"); } catch (e) {}
  };

  // One helper for both YouTube trailers and video files
  function makeMedia(a) {
    if (a.trailer) {
      const f = document.createElement("iframe");
      f.src = ytUrl(a.trailer);
      f.allow = "autoplay; encrypted-media";
      f.tabIndex = -1;
      f.title = "";
      f.setAttribute("aria-hidden", "true");
      let muted = true;
      return {
        el: f,
        isMuted: () => muted,
        setMuted(m) { muted = m; ytCmd(f, m ? "mute" : "unMute"); },
        start() {
          const active = navigator.userActivation && navigator.userActivation.hasBeenActive;
          if (soundOn && active) f.addEventListener("load", () => setTimeout(() => this.setMuted(false), 900));
        }
      };
    }
    const v = document.createElement("video");
    v.src = a.video;
    v.loop = true;
    v.playsInline = true;
    return {
      el: v,
      isMuted: () => v.muted,
      setMuted(m) { v.muted = m; if (!m) v.play().catch(() => {}); },
      start() {
        v.muted = !soundOn;
        const p = v.play();
        if (p) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
      },
      onChange(fn) { v.addEventListener("volumechange", fn); }
    };
  }

  // Netflix-style hover preview on every card
  if (!reduce && hoverOK) {
    document.addEventListener("mouseenter", (e) => {
      const c = e.target;
      if (!c.classList || !c.classList.contains("card")) return;
      const m = /id=(\w+)/.exec(c.getAttribute("href") || "");
      const a = m && byId(m[1]);
      if (!a) return;
      if (!a.trailer || !a.poster) resolveTrailer(a);
      timer = setTimeout(() => {
        if (c.querySelector(".card-video")) return;
        const media = makeMedia(a);
        media.el.classList.add("card-video");
        const btn = document.createElement("span");
        btn.className = "card-sound";
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", "Turn sound on or off");
        const update = () => { btn.textContent = media.isMuted() ? "Sound off" : "Sound on"; };
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          media.setMuted(!media.isMuted());
          soundOn = !media.isMuted();
          update();
        });
        if (media.onChange) media.onChange(update);
        c.classList.add("previewing");
        c.prepend(media.el);
        c.append(btn);
        const play = document.createElement("span");
        play.className = "card-play";
        play.setAttribute("role", "button");
        play.dataset.trailer = a.id;
        play.textContent = "\u25B6 Trailer";
        c.append(play);
        const more = document.createElement("span");
        more.className = "card-info";
        more.setAttribute("role", "button");
        more.dataset.info = a.id;
        more.textContent = "More info";
        c.append(more);
        if (typeof Saved !== "undefined") {
          const save = document.createElement("span");
          save.className = "card-save";
          save.setAttribute("role", "button");
          save.dataset.save = a.id;
          save.textContent = Saved.label(a.id);
          save.classList.toggle("is-saved", Saved.has(a.id));
          c.append(save);
        }
        media.start();
        update();
      }, 350);
    }, true);

    document.addEventListener("mouseleave", (e) => {
      const c = e.target;
      if (!c.classList || !c.classList.contains("card")) return;
      clearTimeout(timer);
      c.classList.remove("previewing");
      c.querySelectorAll(".card-video, .card-sound, .card-play, .card-info, .card-save").forEach((n) => { if (n.pause) n.pause(); n.remove(); });
    }, true);
  }

  // Autoplaying hero with a sound toggle
  const old = document.getElementById("heroVideo");
  const hb = document.getElementById("heroSound");
  function initHero() {
    if (!(old && hb) || reduce) return;
    const media = makeMedia(byId("frieren"));
    media.el.id = "heroVideo";
    media.el.className = "hero-video";
    old.replaceWith(media.el);
    if (!byId("frieren").trailer) { media.el.muted = true; media.el.play().catch(() => {}); }
    hb.addEventListener("click", () => {
      media.setMuted(!media.isMuted());
      hb.textContent = media.isMuted() ? "Sound off" : "Sound on";
    });
  }
  if (old && hb) resolveTrailer(byId("frieren")).then(initHero, initHero).then(() => setTimeout(preloadTrailers, 1500));
})();
