/* Extra homepage rows, built from the anime list in data.js */
(function () {
  const host = document.getElementById("moreRows");
  if (!host) return;

  function makeRow(title, list, href) {
    if (!list.length) return;
    const sec = document.createElement("section");
    sec.className = "row";
    const head = document.createElement("div");
    head.className = "row-head";
    const h = document.createElement("h2");
    h.textContent = title;
    head.append(h);
    if (href) {
      const more = document.createElement("a");
      more.className = "see-all";
      more.href = href;
      more.textContent = "See all";
      head.append(more);
    }
    const ul = document.createElement("ul");
    ul.className = "track";
    list.forEach((a) => { const li = document.createElement("li"); li.append(buildCard(a)); ul.append(li); });
    sec.append(head, ul);
    host.append(sec);
  }

  const byRating = (a, b) => b.rating - a.rating;
  const genre = (g) => ANIME.filter((a) => a.genres.includes(g)).sort(byRating).slice(0, 12);

  const pick = (ids) => ids.map((i) => ANIME.find((a) => a.id === i)).filter(Boolean);
  makeRow("Just Added", ANIME.filter((a) => a.added).sort(byRating).slice(0, 20));
  makeRow("Anime Films", pick(["spiritedaway", "yourname", "mononoke", "silentvoice", "howl", "fireflies", "weathering", "perfectblue", "akira"]));
  makeRow("Classics", ANIME.filter((a) => a.year <= 2005).sort(byRating).slice(0, 14));
  makeRow("New Releases", ANIME.filter((a) => a.year >= 2022).sort((a, b) => b.year - a.year || b.rating - a.rating).slice(0, 14));
  makeRow("Comedy Favorites", genre("Comedy"), "genre.html?g=Comedy");
  makeRow("Thrillers and Mysteries", genre("Thriller"), "genre.html?g=Thriller");
  makeRow("Fantasy Worlds", genre("Fantasy"), "genre.html?g=Fantasy");
  makeRow("Sci-Fi Picks", genre("Sci-Fi"), "genre.html?g=Sci-Fi");
  makeRow("Sports and Rivalry", genre("Sports"), "genre.html?g=Sports");
  makeRow("Mystery and Psychological", genre("Mystery"), "genre.html?g=Mystery");
  makeRow("Romance", genre("Romance"), "genre.html?g=Romance");
  applyPosters();
})();
