/* ============================================================
   M REALTY — Site configuration (single source of truth)
   Edit this file to change contact details & form delivery.
   ============================================================ */

const MRCONFIG = {
  /* ---- Brand / people ---- */
  company: "M Realty",
  founder: "Realtor Brian Mwangi",
  tagline: "Exceptional Properties. Enduring Value.",

  /* ---- Contact details (used everywhere via data attributes) ---- */
  email: "contacts.mrealtyke@gmail.com",
  phoneDisplay: "+254 183 255543",
  phoneHref: "tel:+254183255543",
  whatsappLink: "https://wa.link/xs24k4",           // public chat link
  whatsappNumber: "254183255543",                    // E.164, no + for wa.me
  address: "Park Lane Chambers, 4th Floor, Westlands, Nairobi",
  hours: "Mon–Fri 9:00–18:00 · Sat by appointment",

  /* ------------------------------------------------------------
     FORM DELIVERY — email + WhatsApp notifications
     ------------------------------------------------------------
     Modes:
       "demo"    → no network calls; enquiries are stored locally
                   and a WhatsApp deep-link is offered to the visitor.
       "formspree" → POST to Formspree (email routing). Set endpoint below.
       "edge"    → POST to your own serverless function that fans out
                   to Email (Resend/SendGrid) + WhatsApp Cloud API.

     Setup instructions live in README.md (§ Notifications).
     ------------------------------------------------------------ */
  forms: {
    mode: "formspree", // "demo" | "formspree" | "edge"
    // Create a free form at formspree.eu (EU data residency), paste its
    // endpoint here, and add contacts.mrealtyke@gmail.com as a recipient.
    // Enable "WhatsApp/Slack/Zapier" integrations in Formspree OR connect
    // the form's Zapier webhook to the WhatsApp Cloud API (see README).
    endpoint: "https://formspree.eu/f/xxxxxxxx", // ← REPLACE after signup
    edgeEndpoint: "/api/enquiry"                 // used when mode === "edge"
  },

  /* Map embed (Westlands, Nairobi) */
  mapEmbed:
    "https://www.google.com/maps?q=Park+Lane+Chambers,+Third+Parkland+Boulevard,+Westlands,+Nairobi&output=embed"
};

/* Helper: build a prefilled WhatsApp deep-link */
MRCONFIG.waText = function (msg) {
  return "https://wa.me/" + this.whatsappNumber + "?text=" + encodeURIComponent(msg);
};

window.MRCONFIG = MRCONFIG;
