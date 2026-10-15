/* ============================================================
   M REALTY — Property & Content Data
   Single source of truth for listings, projects, agents, areas.
   ============================================================ */

const MR = window.MR || {};

MR.currency = (n) =>
  "KES " + Number(n).toLocaleString("en-KE", { maximumFractionDigits: 0 });

MR.properties = [
  {
    id: "gem-a1201",
    title: "Skyline Penthouse with Terrace",
    type: "Penthouse",
    status: "For Sale",
    price: 68500000,
    beds: 4,
    baths: 4,
    sqft: 4320,
    location: "Westlands",
    address: "Gemini Residences, Park Lane, Westlands",
    year: 2025,
    featuredProject: "gemini",
    listed: "2026-09-28",
    images: [
      "assets/img/prop-penthouse-1.jpg",
      "assets/img/prop-penthouse-2.jpg",
      "assets/img/prop-penthouse-3.jpg",
      "assets/img/prop-penthouse-4.jpg"
    ],
    floorPlan: "assets/img/floorplan-4bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "m.wanjiru",
    blurb:
      "A duplex penthouse occupying the upper two floors of Gemini Residences, with a 90 m² private terrace and uninterrupted views toward the Ngong Hills.",
    description:
      "Arriving by private lift lobby, the residence opens into a double-height living space finished in honed travertine and white-oak joinery. The upper level houses four en-suite bedrooms, a study, and a roof terrace wired for an outdoor kitchen. Ceilings reach 3.4 metres; glazing is triple-laminated throughout.\n\nThe property is sold fully fitted with Gaggenau appliances, ducted climate control, and a home-automation backbone. Two secure parking bays and a temperature-controlled wine store are included.",
    amenities: [
      "Private lift lobby",
      "90 m² roof terrace",
      "Gaggenau kitchen",
      "Ducted air conditioning",
      "Home automation ready",
      "2 secure parking bays",
      "Wine storage room",
      "Triple-glazed fa\u00e7ade"
    ]
  },
  {
    id: "gem-b0704",
    title: "Corner Apartment, Dual Aspect",
    type: "Apartment",
    status: "For Sale",
    price: 24800000,
    beds: 3,
    baths: 3,
    sqft: 1810,
    location: "Westlands",
    address: "Gemini Residences, Park Lane, Westlands",
    year: 2025,
    featuredProject: "gemini",
    listed: "2026-09-14",
    images: [
      "assets/img/prop-corner-1.jpg",
      "assets/img/prop-corner-2.jpg",
      "assets/img/prop-corner-3.jpg"
    ],
    floorPlan: "assets/img/floorplan-3bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "d.otieno",
    blurb:
      "A three-bedroom corner unit with wrap-around glazing, open to morning light over the park and evening sun across the ridge.",
    description:
      "Corner apartments rarely come to market at Gemini. This 181 m² layout places the living and dining zones on the angle, giving the principal suite complete separation from the secondary bedrooms.\n\nThe residence is delivered with engineered oak flooring, stone-clad bathrooms, and an integrated appliance package. Residents share access to the podium garden, lap pool, and business lounge.",
    amenities: [
      "Wrap-around glazing",
      "Engineered oak floors",
      "Stone-clad bathrooms",
      "Podium garden access",
      "Lap pool & gymnasium",
      "Business lounge",
      "1 basement parking bay",
      "Backup power & water"
    ]
  },
  {
    id: "kil-c0302",
    title: "Garden-Level Two Bedroom",
    type: "Apartment",
    status: "For Sale",
    price: 13200000,
    beds: 2,
    baths: 2,
    sqft: 1130,
    location: "Kilimani",
    address: "Rowan Court, Elgon Road, Kilimani",
    year: 2024,
    featuredProject: null,
    listed: "2026-08-30",
    images: [
      "assets/img/prop-garden-1.jpg",
      "assets/img/prop-garden-2.jpg",
      "assets/img/prop-garden-3.jpg"
    ],
    floorPlan: "assets/img/floorplan-2bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "s.njoroge",
    blurb:
      "Ground-floor apartment opening onto a private landscaped courtyard, five minutes from Yaya Centre.",
    description:
      "Set on the quiet side of Rowan Court, this two-bedroom residence trades vertical views for something rarer in Kilimani: a private 60 m² garden terrace with direct lawn access.\n\nInternally the plan is efficient and bright, with a separated kitchen, built-in wardrobes to both bedrooms, and a guest cloakroom. A mature jacaranda screens the terrace from the courtyard drive.",
    amenities: [
      "Private garden terrace",
      "Separate kitchen",
      "Built-in wardrobes",
      "Guest cloakroom",
      "Secure courtyard parking",
      "24/7 security",
      "Standby generator",
      "Borehole water"
    ]
  },
  {
    id: "lwf-v014",
    title: "Four-Bedroom Villa with Pool",
    type: "Villa",
    status: "For Sale",
    price: 98000000,
    beds: 4,
    baths: 5,
    sqft: 6200,
    location: "Lavington",
    address: "Green Valley Road, Lavington",
    year: 2023,
    featuredProject: null,
    listed: "2026-09-02",
    images: [
      "assets/img/prop-villa-1.jpg",
      "assets/img/prop-villa-2.jpg",
      "assets/img/prop-villa-3.jpg",
      "assets/img/prop-villa-4.jpg"
    ],
    floorPlan: "assets/img/floorplan-villa.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "m.wanjiru",
    blurb:
      "A contemporary villa on a quarter-acre plot, arranged around a shaded courtyard and infinity pool.",
    description:
      "Designed by a Nairobi practice and completed in 2023, the villa is organised as two horizontal bars linked by a glazed courtyard. All four bedrooms are en-suite, with a self-contained staff wing and a separate guests' studio off the garden.\n\nConstruction is reinforced concrete with a standing-seam metal roof; interiors pair board-formed concrete with warm timber. The 12-metre pool sits beneath a pergola planted with jasmine.",
    amenities: [
      "12 m infinity pool",
      "Quarter-acre plot",
      "Guests' studio",
      "Staff quarters",
      "Board-formed concrete",
      "Solar water heating",
      "Automated gates",
      "CCTV & manned gate"
    ]
  },
  {
    id: "rgr-th021",
    title: "Courtyard Townhouse, Phase II",
    type: "Townhouse",
    status: "Off-Plan",
    price: 31500000,
    beds: 3,
    baths: 3,
    sqft: 2140,
    location: "Runda",
    address: "The Quarter, Runda Gate Road",
    year: 2027,
    featuredProject: "quarter",
    listed: "2026-09-20",
    images: [
      "assets/img/prop-town-1.jpg",
      "assets/img/prop-town-2.jpg",
      "assets/img/prop-town-3.jpg"
    ],
    floorPlan: "assets/img/floorplan-townhouse.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "a.kimani",
    blurb:
      "Three-storey townhouse around an internal courtyard — completing Q4 2027, staged payments to 60% on structure.",
    description:
      "The Quarter places twenty-eight townhouses along a single pedestrian spine, each opening through a private courtyard that mediates between street and interior. This corner unit gains an extra 18 m² of garden to the east.\n\nOff-plan purchasers select finishes at shell stage from a curated palette. Payment is staged: 30% deposit, 30% on structure, balance on completion.",
    amenities: [
      "Internal courtyard",
      "Three storeys",
      "Roof terrace",
      "Choice of finishes",
      "Gated community",
      "Play area & green buffer",
      "2 parking bays",
      "Staged payment plan"
    ]
  },
  {
    id: "kis-b1103",
    title: "Executive One Bedroom, City Views",
    type: "Apartment",
    status: "For Sale",
    price: 8900000,
    beds: 1,
    baths: 1,
    sqft: 720,
    location: "Kilimani",
    address: "Meridian Towers, Kiambu Road",
    year: 2022,
    featuredProject: null,
    listed: "2026-07-18",
    images: [
      "assets/img/prop-exec-1.jpg",
      "assets/img/prop-exec-2.jpg"
    ],
    floorPlan: "assets/img/floorplan-1bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "s.njoroge",
    blurb:
      "A tightly-detailed one bedroom on an upper floor — a pied-à-terre or a dependable rental yield asset.",
    description:
      "Meridian Towers holds its rental premium through location and management: walkable to two malls, with an in-house lettings desk. This unit sits on the eleventh floor facing north-east, catching sunrise over the ridge.\n\nThe fit-out includes a full-height mirrored wardrobe wall, quartz worktops, and a concealed utility balcony.",
    amenities: [
      "Floor 11, north-east aspect",
      "Concealed utility balcony",
      "Quartz worktops",
      "In-house lettings desk",
      "Gym & sauna",
      "Roof deck lounge",
      "1 parking bay",
      "Fibre-ready"
    ]
  },
  {
    id: "gem-b1508",
    title: "High-Flow Two Bedroom",
    type: "Apartment",
    status: "Sold",
    price: 17400000,
    beds: 2,
    baths: 2,
    sqft: 1240,
    location: "Westlands",
    address: "Gemini Residences, Park Lane, Westlands",
    year: 2025,
    featuredProject: "gemini",
    listed: "2026-06-11",
    images: [
      "assets/img/prop-sold-1.jpg",
      "assets/img/prop-sold-2.jpg"
    ],
    floorPlan: "assets/img/floorplan-2bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "d.otieno",
    blurb:
      "Sold below asking in eleven days. Register with the concierge for comparable releases at Gemini.",
    description:
      "Retained for reference. Comparable two-bedroom inventory at Gemini is released in tranches; registered clients receive allocation lists forty-eight hours before public release.",
    amenities: [
      "Sold — reference listing",
      "Comparable releases on request",
      "Podium garden access",
      "Lap pool & gymnasium"
    ]
  },
  {
    id: "ubr-v007",
    title: "Restored Bungalow on Half Acre",
    type: "Villa",
    status: "For Sale",
    price: 54000000,
    beds: 3,
    baths: 3,
    sqft: 3400,
    location: "Karen",
    address: "Kikuyu Road, Karen",
    year: 1974,
    featuredProject: null,
    listed: "2026-08-05",
    images: [
      "assets/img/prop-bungalow-1.jpg",
      "assets/img/prop-bungalow-2.jpg",
      "assets/img/prop-bungalow-3.jpg"
    ],
    floorPlan: "assets/img/floorplan-villa.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "a.kimani",
    blurb:
      "A 1974 brick bungalow sympathetically rebuilt — original character, entirely new services.",
    description:
      "The house keeps its pitched roof, shuttered sash windows, and verandah, behind which everything is new: rewired, replumbed, re-roofed in 2021, with a modern kitchen inserted into the former dining room. The half-acre is mature and fenced, with room for a second structure under Karen's low-density controls.",
    amenities: [
      "Half-acre mature plot",
      "Full service rebuild 2021",
      "Original verandah",
      "Room for second dwelling",
      "Borehole & water tanks",
      "Staff quarters",
      "Fireplace & library",
      "Sub-divided title ready"
    ]
  },
  {
    id: "dwl-p0402",
    title: "Duplex with Double-Height Living",
    type: "Penthouse",
    status: "For Sale",
    price: 42600000,
    beds: 3,
    baths: 3,
    sqft: 2680,
    location: "Down Town",
    address: "Anchor House, Kimathi Street",
    year: 2024,
    featuredProject: null,
    listed: "2026-09-08",
    images: [
      "assets/img/prop-duplex-1.jpg",
      "assets/img/prop-duplex-2.jpg",
      "assets/img/prop-duplex-3.jpg"
    ],
    floorPlan: "assets/img/floorplan-3bed.jpg",
    videoId: "aqz-KE-bpKQ",
    agent: "d.otieno",
    blurb:
      "A converted office penthouse in the CBD — loft volumes, restored terrazzo, and rooftop access.",
    description:
      "Anchor House was repositioned in 2024 as residential loft stock. This duplex retains the building's original terrazzo floors and exposes its concrete frame; the second bedroom mezzanine hangs over a six-metre living void. Residents share a rooftop terrace overlooking Kimathi Street's canopy.",
    amenities: [
      "6 m living void",
      "Restored terrazzo floors",
      "Mezzanine study",
      "Shared rooftop terrace",
      "Concierge desk",
      "Secure parking",
      "Backup power",
      "Pet friendly"
    ]
  }
];

MR.projects = {
  gemini: {
    name: "The Gemini Project",
    short: "Gemini",
    tagline: "Two towers. One standard.",
    location: "Brookside, Westlands",
    status: "Topping out — Q3 2026",
    units: 148,
    storeys: 21,
    completion: "Handover Q2 2027",
    hero: "assets/img/project-gemini-hero.jpg",
    gallery: [
      "assets/img/project-gemini-1.jpg",
      "assets/img/project-gemini-2.jpg",
      "assets/img/project-gemini-3.jpg",
      "assets/img/project-gemini-4.jpg"
    ],
    copy: [
      "Gemini rises on Park Lane at the edge of Brookside's parkland — a paired-tower scheme conceived for buyers who intend to hold. Twenty-one storeys per tower, 148 residences, and a podium garden that reads as a public square from the street.",
      "The structural logic is deliberately conservative: flat slabs, generous ceiling heights, and a fa\u00e7ade tested for acoustic performance against Park Lane traffic. Nothing in the specification is exotic. Everything is specified to age well."
    ],
    specs: [
      ["Residences", "148 units"],
      ["Typology", "1–4 bed & penthouses"],
      ["Tower height", "21 storeys"],
      ["Parking ratio", "1.2 bays / unit"],
      ["Ceiling height", "2.9–3.4 m"],
      ["Ownership", "Freehold / Leasehold 99y"]
    ]
  },
  quarter: {
    name: "The Quarter",
    short: "The Quarter",
    tagline: "Twenty-eight townhouses, one spine.",
    location: "Runda Gate Road",
    status: "Phase II — selling now",
    units: 28,
    storeys: 3,
    completion: "Q4 2027",
    hero: "assets/img/project-quarter-hero.jpg",
    gallery: [
      "assets/img/project-quarter-1.jpg",
      "assets/img/project-quarter-2.jpg"
    ],
    copy: [
      "A low-density townhouse enclave arranged along a pedestrian spine, each home entered through a private courtyard."
    ],
    specs: [
      ["Residences", "28 units"],
      ["Typology", "3–4 bed townhouses"],
      ["Plot sizes", "From 250 m\u00b2"],
      ["Completion", "Q4 2027"]
    ]
  }
};

MR.stats = [
  ["Delivered", "14", "projects handed over since 2012"],
  ["Total Units", "1,260", "residences placed with owners"],
  ["Active Projects", "3", "under development across Nairobi"],
  ["Years in Market", "13", "advising buyers and developers"]
];

MR.agents = [
  {
    id: "m.wanjiru",
    name: "Muthoni Wanjiru",
    role: "Principal Advisor",
    focus: "Prime residential & penthouses",
    phone: "+254 720 100 001",
    email: "muthoni@mrealty.co.ke",
    photo: "assets/img/agent-1.jpg",
    bio: "Fifteen years advising on high-value residential transactions in Westlands and Karen. Formerly head of residential at a regional brokerage."
  },
  {
    id: "d.otieno",
    name: "David Otieno",
    role: "Senior Sales Consultant",
    focus: "New developments & off-plan",
    phone: "+254 720 100 002",
    email: "david@mrealty.co.ke",
    photo: "assets/img/agent-2.jpg",
    bio: "Leads sales mandates for Gemini and The Quarter. Known for disciplined allocation processes and honest exit valuations."
  },
  {
    id: "s.njoroge",
    name: "Sarah Njoroge",
    role: "Lettings & Investment",
    focus: "Yield analysis & institutional lets",
    phone: "+254 720 100 003",
    email: "sarah@mrealty.co.ke",
    photo: "assets/img/agent-3.jpg",
    bio: "Manages a 90-unit rental book and prepares acquisition cases for diaspora and regional investors."
  },
  {
    id: "a.kimani",
    name: "Andrew Kimani",
    role: "Development Advisory",
    focus: "Feasibility, land & entitlements",
    phone: "+254 720 100 004",
    email: "andrew@mrealty.co.ke",
    photo: "assets/img/agent-4.jpg",
    bio: "Advises landowners on highest-and-best use. Ten feasibility studies approved for construction in the last four years."
  }
];

MR.neighbourhoods = [
  {
    name: "Westlands",
    image: "assets/img/nb-westlands.jpg",
    median: "KES 13.4M",
    yield: "5.8%",
    trend: "+7.2% y/y",
    note: "Nairobi's densest prime apartment market. Corporate demand keeps absorption high; Park Lane and Brookside command the top band."
  },
  {
    name: "Kilimani",
    image: "assets/img/nb-kilimani.jpg",
    median: "KES 11.9M",
    yield: "6.1%",
    trend: "+4.5% y/y",
    note: "The rental workhorse. Well-managed towers near Yaya sustain occupancy above 90%; older stock discounts sharply for lack of parking."
  },
  {
    name: "Lavington",
    image: "assets/img/nb-lavington.jpg",
    median: "KES 62M",
    yield: "3.9%",
    trend: "+2.1% y/y",
    note: "Low-density family territory. Values track plot size more than finish; quarter-acre freeholds rarely list twice in a decade."
  },
  {
    name: "Karen",
    image: "assets/img/nb-karen.jpg",
    median: "KES 78M",
    yield: "3.4%",
    trend: "+1.6% y/y",
    note: "Leafy, slow-moving, and resilient in downturns. Buyer pool is thin but committed; realistic pricing sells in under 90 days."
  },
  {
    name: "Runda",
    image: "assets/img/nb-runda.jpg",
    median: "KES 34M",
    yield: "4.2%",
    trend: "+5.0% y/y",
    note: "Gated townhouse product has re-rated the area since 2022, pulling upriver families who want security without a CBD commute."
  },
  {
    name: "Down Town",
    image: "assets/img/nb-downtown.jpg",
    median: "KES 9.2M",
    yield: "7.3%",
    trend: "+3.8% y/y",
    note: "Conversion stock. Office-to-residential schemes deliver the city's best headline yields, subject to servicing and parking diligence."
  }
];

MR.byAgent = (id) => MR.agents.find((a) => a.id === id) || MR.agents[0];
MR.byId = (id) => MR.properties.find((p) => p.id === id);
