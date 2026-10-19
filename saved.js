/* My List (saved anime), stored in this browser */
const Saved = {
  get() { try { return JSON.parse(localStorage.getItem("bb_saved")) || []; } catch (e) { return []; } },
  set(list) { try { localStorage.setItem("bb_saved", JSON.stringify(list)); } catch (e) {} },
  has(id) { return this.get().includes(id); },
  label(id) { return this.has(id) ? "\u2713 In My List" : "+ My List"; },
  toggle(id) {
    const list = this.get();
    const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    this.set(list);
    refreshSaveButtons();
    document.dispatchEvent(new CustomEvent("saved-changed", { detail: { id } }));
    return i === -1;
  }
};

function refreshSaveButtons() {
  document.querySelectorAll("[data-save]").forEach((el) => {
    const id = el.dataset.save;
    if (!id) return;
    el.textContent = Saved.label(id);
    el.classList.toggle("is-saved", Saved.has(id));
  });
}

// Build one anime card (used by the genre and My List pages)
function buildCard(a) {
  const link = document.createElement("a");
  link.className = "card";
  link.href = "player.html?id=" + a.id;
  link.style.setProperty("--a", a.a);
  link.style.setProperty("--b", a.b);
  const t = document.createElement("strong");
  t.textContent = a.title;
  const s = document.createElement("span");
  s.className = "score";
  s.textContent = "\u2605 " + a.rating;
  link.append(t, s);
  return link;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest && e.target.closest("[data-save]");
  if (!b || !b.dataset.save) return;
  e.preventDefault();
  e.stopPropagation();
  Saved.toggle(b.dataset.save);
}, true);

// Highlight the current page in the nav
(function () {
  const here = location.pathname.split("/").pop() + location.search;
  document.querySelectorAll(".nav nav a").forEach((a) => {
    if (a.getAttribute("href").toLowerCase() === here.toLowerCase()) a.classList.add("active");
  });
  refreshSaveButtons();
})();
