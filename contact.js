(function () {
  const WHATSAPP = "2348136985204";
  const EMAIL = "ayodelenathaniel2010@gmail.com";
  const form = document.getElementById("contactForm");
  if (!form) return;
  const msg = document.getElementById("contactMsg");

  function compose() {
    const name = form.name.value.trim();
    const text = form.message.value.trim();
    if (!text) { msg.textContent = "Please type a message first."; form.message.focus(); return null; }
    msg.textContent = "";
    return { name, text };
  }

  document.getElementById("sendWa").addEventListener("click", () => {
    const m = compose();
    if (!m) return;
    const body = "Hello Binge Barn" + (m.name ? ", this is " + m.name : "") + ".\n\n" + m.text;
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(body), "_blank", "noopener");
  });

  document.getElementById("sendMail").addEventListener("click", () => {
    const m = compose();
    if (!m) return;
    const body = m.text + (m.name ? "\n\n" + m.name : "");
    location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Message from Binge Barn") + "&body=" + encodeURIComponent(body);
  });
})();
