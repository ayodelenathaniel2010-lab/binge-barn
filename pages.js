(function () {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const page = document.body.dataset.page;
  const head = document.getElementById("pageTitle");
  const sub = document.getElementById("pageSub");
  const count = document.getElementById("pageCount");
  const empty = document.getElementById("pageEmpty");

  const BLURBS = {
    "Action": "Fast fights, big stakes and nonstop momentum.",
    "Adventure": "Long journeys, new worlds and crews worth following.",
    "Fantasy": "Magic, myths and worlds that run on different rules.",
    "Drama": "Stories about people, loss and the choices that shape them.",
    "Sci-Fi": "Time, technology and the future gone sideways.",
    "Supernatural": "Curses, spirits and the things that go bump."
  };

  function fill(list) {
    grid.textContent = "";
    list.forEach((a) => { const li = document.createElement("li"); li.append(buildCard(a)); grid.append(li); });
    applyPosters();
    count.textContent = list.length + (list.length === 1 ? " anime" : " anime");
  }

  if (page === "genre") {
    const all = [...new Set(ANIME.flatMap((a) => a.genres))];
    const wanted = (new URLSearchParams(location.search).get("g") || "").toLowerCase();
    const genre = all.find((g) => g.toLowerCase() === wanted);
    if (!genre) {
      head.textContent = "Genre not found";
      sub.textContent = "Pick a genre from the menu at the top.";
      count.textContent = "";
      return;
    }
    document.title = genre + " Anime - Binge Barn";
    head.textContent = genre + " Anime";
    sub.textContent = BLURBS[genre] || "";
    fill(ANIME.filter((a) => a.genres.includes(genre)).sort((p, q) => q.rating - p.rating));
  } else if (page === "saved") {
    const render = () => {
      const list = Saved.get().slice().reverse().map((id) => ANIME.find((a) => a.id === id)).filter(Boolean);
      fill(list);
      empty.hidden = list.length > 0;
      count.hidden = list.length === 0;
    };
    render();
    document.addEventListener("saved-changed", render);
  }
})();
