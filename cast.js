/* Cast, director and creators on the player page */
(function () {
  const section = document.getElementById("people");
  if (!section) return;
  const id = new URLSearchParams(location.search).get("id") || ANIME[0].id;
  const castGrid = document.getElementById("castGrid");
  const staffGrid = document.getElementById("staffGrid");
  const msg = document.getElementById("peopleMsg");
  const staffTitle = document.getElementById("staffTitle");
  const castTitle = document.getElementById("castTitle");
  const directed = document.getElementById("directedBy");

  function photo(src, alt, cls) {
    const el = document.createElement("img");
    el.className = cls;
    el.alt = alt;
    el.loading = "lazy";
    el.referrerPolicy = "no-referrer";
    if (src) el.src = src;
    el.addEventListener("error", () => { el.style.visibility = "hidden"; });
    return el;
  }

  function render(d) {
    castGrid.textContent = "";
    staffGrid.textContent = "";
    d.cast.forEach((c) => {
      const li = document.createElement("li");
      li.className = "cast-card";
      li.append(photo(c.i, c.n, "cc-img"));
      const box = document.createElement("div");
      box.className = "cc-text";
      const name = document.createElement("strong");
      name.textContent = c.n;
      box.append(name);
      if (c.r) { const r = document.createElement("small"); r.textContent = c.r; box.append(r); }
      if (c.v) {
        const va = document.createElement("span");
        va.className = "cc-va";
        va.append(photo(c.vi, c.v, "va-thumb"));
        const t = document.createElement("span");
        t.textContent = "Voiced by " + c.v;
        va.append(t);
        box.append(va);
      }
      li.append(box);
      castGrid.append(li);
    });
    d.staff.forEach((s) => {
      const li = document.createElement("li");
      li.className = "staff-card";
      li.append(photo(s.i, s.n, "st-img"));
      const box = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = s.n;
      const role = document.createElement("small");
      role.textContent = s.r;
      box.append(name, role);
      li.append(box);
      staffGrid.append(li);
    });
    castTitle.hidden = !d.cast.length;
    staffTitle.hidden = !d.staff.length;
    if (directed) {
      directed.hidden = !(d.dir && d.dir.length);
      if (d.dir && d.dir.length) directed.textContent = "Directed by " + d.dir.join(", ");
    }
    msg.hidden = true;
  }

  async function run() {
    msg.hidden = false;
    msg.textContent = "Loading cast and creators...";
    const d = await loadPeople(id);
    if (d && (d.cast.length || d.staff.length)) { render(d); return; }
    msg.textContent = "The cast and director could not load right now. ";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-ghost small";
    retry.textContent = "Try again";
    retry.addEventListener("click", run);
    msg.append(retry);
  }

  castTitle.hidden = true;
  staffTitle.hidden = true;
  run();
})();
