/* Cast, director, and details for an anime (Jikan / MyAnimeList data, cached in the browser) */
const KEY_ROLES = ["Director", "Chief Director", "Original Creator", "Series Composition", "Original Character Design", "Character Design", "Music", "Sound Director"];
const flipName = (n) => { if (!n) return ""; const p = n.split(","); return p.length === 2 ? p[1].trim() + " " + p[0].trim() : n; };
const imgOf = (o) => (o && o.images && o.images.jpg && o.images.jpg.image_url) || "";

async function loadPeople(animeId) {
  const key = "bb_cast2_" + animeId;
  try { const c = JSON.parse(localStorage.getItem(key)); if (c && (c.cast.length || c.staff.length)) return c; } catch (e) {}
  const mal = MAL[animeId];
  if (!mal) return null;
  const chars = await jikan("/anime/" + mal + "/characters");
  const staff = await jikan("/anime/" + mal + "/staff");
  if (!chars && !staff) return null;
  const list = staff || [];
  const score = (s) => {
    const hits = (s.positions || []).map((p) => KEY_ROLES.findIndex((k) => k.toLowerCase() === p.toLowerCase())).filter((n) => n > -1);
    return hits.length ? Math.min(...hits) : 99;
  };
  const dir = [];
  list.forEach((s) => {
    if ((s.positions || []).some((p) => /^(chief )?director$/i.test(p))) {
      const n = flipName(s.person.name);
      if (n && !dir.includes(n)) dir.push(n);
    }
  });
  let chosen = list.filter((s) => score(s) < 99).sort((a, b) => score(a) - score(b));
  if (!chosen.length) chosen = list;
  const data = {
    dir: dir.slice(0, 3),
    cast: (chars || []).sort((a, b) => (b.favorites || 0) - (a.favorites || 0)).slice(0, 12).map((c) => {
      const va = (c.voice_actors || []).find((v) => v.language === "Japanese");
      return { n: flipName(c.character.name), i: imgOf(c.character), r: c.role || "", v: va ? flipName(va.person.name) : "", vi: va ? imgOf(va.person) : "" };
    }),
    staff: chosen.slice(0, 8).map((s) => {
      const roles = (s.positions || []).filter((p) => KEY_ROLES.some((k) => k.toLowerCase() === p.toLowerCase()));
      return { n: flipName(s.person.name), i: imgOf(s.person), r: (roles.length ? roles : s.positions || []).slice(0, 2).join(", ") };
    })
  };
  if (data.cast.length || data.staff.length) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} }
  return data;
}

async function loadDetails(animeId) {
  const key = "bb_info_" + animeId;
  try { const c = JSON.parse(localStorage.getItem(key)); if (c) return c; } catch (e) {}
  const mal = MAL[animeId];
  if (!mal) return null;
  const d = await jikan("/anime/" + mal);
  if (!d) return null;
  const data = {
    synopsis: (d.synopsis || "").replace(/\[Written by MAL Rewrite\]/i, "").trim(),
    episodes: d.episodes || 0,
    status: d.status || "",
    studios: (d.studios || []).map((s) => s.name),
    aired: (d.aired && d.aired.string) || "",
    duration: d.duration || ""
  };
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  return data;
}
