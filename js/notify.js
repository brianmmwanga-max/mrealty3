/* ============================================================
   M REALTY — Enquiry delivery layer
   Every form / concierge submission flows through MRNotify.send().
   Modes (see js/config.js): formspree | edge | demo
   ============================================================ */

const MRNotify = (() => {
  const CFG = window.MRCONFIG;

  const slug = (s) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* Build a plain-text body used for WhatsApp + mailto fallbacks */
  function toText(type, data) {
    const lines = [`M REALTY — ${type}`, ""];
    Object.entries(data).forEach(([k, v]) => {
      if (v) lines.push(`${k}: ${v}`);
    });
    lines.push("", `Page: ${location.href}`);
    return lines.join("\n");
  }

  async function send(type, data) {
    const payload = {
      _subject: `M Realty website — new ${type.toLowerCase()}`,
      _template: "table",
      type,
      ...data
    };
    const text = toText(type, data);
    const mode = CFG.forms.mode;

    try {
      if (mode === "formspree" && !CFG.forms.endpoint.includes("xxxxxxxx")) {
        await fetch(CFG.forms.endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else if (mode === "edge") {
        await fetch(CFG.forms.edgeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn("[MRNotify] delivery failed, falling back locally:", err);
    }

    /* Always keep a local copy so nothing is lost in demo mode */
    try {
      const q = JSON.parse(localStorage.getItem("mr_queue") || "[]");
      q.push({ ts: Date.now(), type, data });
      localStorage.setItem("mr_queue", JSON.stringify(q.slice(-50)));
    } catch (e) {}

    return { ok: true, waLink: CFG.waText(text), mailto: mailto(type, text) };
  }

  function mailto(type, text) {
    return (
      `mailto:${CFG.email}?subject=` +
      encodeURIComponent(`M Realty website — new ${type.toLowerCase()}`) +
      "&body=" + encodeURIComponent(text)
    );
  }

  return { send, toText };
})();

window.MRNotify = MRNotify;
