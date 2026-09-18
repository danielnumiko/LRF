/* ==========================================================================
   Content for the Stories index.
   In production this is what the Drupal view would hand the template; it is
   kept in one module so swapping it for a real endpoint is a one-line change.
   ========================================================================== */

export const THEMES = [
  { key: "maritime",       label: "Safer Maritime Systems",             swatch: "rgba(var(--accent-maritime) / 1)" },
  { key: "infrastructure", label: "Safer Sustainable Infrastructure",   swatch: "rgba(var(--accent-infrastructure) / 1)" },
  { key: "skills",         label: "Skilled People for Safer Engineering", swatch: "rgba(var(--accent-skills) / 1)" },
  { key: "evidence",       label: "Global Safety Evidence Centre",      swatch: "rgba(var(--accent-evidence) / 1)" },
  { key: "heritage",       label: "Heritage Centre",                    swatch: "rgba(var(--accent-heritage) / 1)" }
];

export const NAV = [
  { title: "Our priorities", children: ["Safer maritime systems", "Safer sustainable infrastructure", "Skilled people for safer engineering", "Global Safety Evidence Centre", "Heritage Centre"] },
  { title: "Regions", children: ["Africa", "Americas", "Asia", "Oceania", "Europe", "Middle East"] },
  { title: "World Risk Poll", children: ["About the Poll", "Themes and Reports", "Data", "Contact the World Risk Poll team"] },
  { title: "Partnerships and funding", children: ["Partnerships", "Programmes", "Grant funding", "NEST"] },
  { title: "News", children: ["Events", "Publications"] },
  { title: "About us", children: ["Our strategy", "Our people", "Diversity and inclusion", "Our history", "Our purpose"] }
];

// Images are real LRF media, lifted with their live derivative URLs and their
// own alt text from the /news/publications markup. Swap for story-specific
// photography before this goes anywhere near production.
const MEDIA = "https://www.lrfoundation.org.uk/sites/default/files/styles/16_9_media_md/public/";

export const STORIES = [
  { name: "Maria", themes: ["maritime"],
    summary: "A second officer on a container route who turned scattered near-miss reports into a bridge-team routine now used fleet-wide.",
    img: MEDIA + "2025-11/gettyimages-1465444767.jpg?h=6ecb0363&itok=J2KdeNhW",
    alt: "Worker in hard hat and safety gear checking cargo containers at shipping yard." },
  { name: "Kofi", themes: ["skills"],
    summary: "An apprenticeship mentor in Accra training a new generation of welders to inspect their own work before anyone else does.",
    img: MEDIA + "2026-01/gettyimages-1400785656.jpg?h=3903a1b0&itok=fzYFiUqd",
    alt: "Two engineers in hard hats examining industrial robotic equipment, one wearing orange and one in high-visibility yellow." },
  { name: "Priya", themes: ["infrastructure"],
    summary: "A structural engineer stress-testing monsoon-resilient housing so families in flood-exposed districts can stay where they live.",
    img: MEDIA + "2025-04/worker.jpeg?h=a92f03cd&itok=Ti9HnuL0",
    alt: "Female worker in blue protective uniform." },
  { name: "John", themes: ["maritime"],
    summary: "A retired fishing skipper whose lifejacket campaign changed the habits of an entire Cornish harbour.",
    img: MEDIA + "2026-06/shutterstock_2082770398.jpg?h=fa1c963e&itok=ZIMmGGMx",
    alt: "Photograph of fishermen hauling a large net onto a sandy beach under dramatic stormy skies." },
  { name: "Amara", themes: ["evidence"],
    summary: "A data scientist who mapped World Risk Poll responses onto local hazard records to show where harm is really concentrated.",
    img: MEDIA + "2025-12/engineer-research.jpeg?h=a92f03cd&itok=OBlrmrG7",
    alt: "Engineer in lab coat carefully adjusting laboratory equipment with tubes and wires connected to a testing apparatus." },
  { name: "Chen", themes: ["infrastructure"],
    summary: "A site safety lead using wind sensor data to pull crews off scaffolding before the weather makes the decision for him.",
    img: MEDIA + "2025-07/gettyimages-1149247392-min.jpg?h=b2774bcf&itok=F4rUpjBp",
    alt: "Silhouette of construction workers on scaffolding at sunset, with crane visible against blue-orange sky." },
  { name: "Sofia", themes: ["heritage", "maritime"],
    summary: "An archivist reading nineteenth-century survey reports for the patterns that still predict how modern hulls fail.",
    img: MEDIA + "2025-10/paperwork.png?h=d1cb525d&itok=H7Y2yf-W",
    alt: "Professional in dark suit writing in notebook at desk with laptop and business documents." },
  { name: "Daniel", themes: ["skills"],
    summary: "A lecturer rebuilding an engineering curriculum around the question his students were never asked: who gets hurt?",
    img: MEDIA + "2025-05/what-osh-practitioners-need-banner.jpg?h=a92f03cd&itok=FohQU656",
    alt: "Two workers doing climbing training." },
  { name: "Fatima", themes: ["evidence"],
    summary: "A field researcher collecting first-hand accounts of workplace harm in places national statistics never reach.",
    img: MEDIA + "2024-06/DSC04083-138.jpg?h=5e08a8b6&itok=Its1PErO",
    alt: "Woman wearing boots standing in flooded area." },
  { name: "Lars", themes: ["maritime"],
    summary: "A chief engineer testing methanol fuel systems so the crews running them know exactly what to do when something leaks.",
    img: MEDIA + "2025-06/offshore-boat-crew.jpeg?h=a92f03cd&itok=OlTDPydQ",
    alt: "Offshore crew working at sea." },
  { name: "Nadia", themes: ["infrastructure", "skills"],
    summary: "A water engineer training village technicians to maintain the pumps long after the funding cycle ends.",
    img: MEDIA + "2024-04/Focus%20on%20violence%20and%20harassment.png?h=5ebb817e&itok=aSfmuCfk",
    alt: "A woman wearing a hi vis jacket, she is seen kneeling down with a man behind her." },
  { name: "Tom", themes: ["heritage"],
    summary: "A conservator digitising ship plans so the lessons drawn in 1912 stay searchable for the engineers of 2030.",
    img: MEDIA + "2024-04/lrf-worldriskpoll-2021-miners.jpg?h=06ac0d8c&itok=yQgmb_os",
    alt: "A group of miners working, their uniforms are dirty. They can be seen operating heavy machinery." },
  { name: "Ines", themes: ["infrastructure"],
    summary: "A grid engineer who models where the network fails first, so the repairs happen before the outage does.",
    img: MEDIA + "2026-02/gettyimages-2244141751.jpg?h=38ee85f3&itok=8Q46m3Pb",
    alt: "Engineer with hard hat viewing digital overlay of power grid infrastructure at dusk with transmission towers." },
  { name: "Yusuf", themes: ["evidence"],
    summary: "A risk analyst asking farmers what they fear most, then checking it against what actually harms them.",
    img: MEDIA + "2026-06/gettyimages-161057897.jpg?h=2c11fb9e&itok=0JeHWTnn",
    alt: "A man in a white t-shirt watches a massive bushfire sending dark smoke clouds over dry farmland." },
  { name: "Grace", themes: ["skills"],
    summary: "A lineworker turned trainer teaching crews when the safest call is to stop work and walk away.",
    img: MEDIA + "2025-07/worker-in-storm.jpeg?h=a92f03cd&itok=kmO71utc",
    alt: "Worker using electrical tool in cloudy, storm-like weather." },
  { name: "Mateo", themes: ["infrastructure", "skills"],
    summary: "An agronomist rewriting machinery guidance for the smallholders who were never its intended readers.",
    img: MEDIA + "2025-05/osh-interventions-the-state-of-the-evidence-banner.jpg?h=2e9e29e4&itok=rudQ2K4Y",
    alt: "Two agricultural workers at work in a field." },
  { name: "Aiko", themes: ["maritime"],
    summary: "A port operations manager redesigning night shifts around when accidents actually happen.",
    img: MEDIA + "2026-05/focus-on-migration-in-a-warming-world-m.jpg?h=119335f7&itok=sU8sCEIE",
    alt: "People walking in line across world map, painted on asphalt, front person walking left." },
  { name: "Elena", themes: ["evidence", "heritage"],
    summary: "A seismologist reading century-old damage records to predict which streets will need help first.",
    img: MEDIA + "2024-04/Focus%20on%20Quito%2C%20Ecuador.png?h=e1d1bd0e&itok=evGmypxh",
    alt: "People in Quito, Ecuador standing in a line helping to carry vital goods such as food following an earthquake." },
  { name: "Samuel", themes: ["skills"],
    summary: "A wildfire crew chief building the training that keeps volunteers from becoming casualties.",
    img: MEDIA + "2024-04/Focus%20on%20climate.png?h=d80171be&itok=gAmofiQs",
    alt: "A lone firefighter seen with a hose, firing water towards burning trees." },
  { name: "Hana", themes: ["heritage", "infrastructure"],
    summary: "An architectural historian showing how a façade detail from 1930 still governs how the building fails.",
    img: MEDIA + "2025-06/business-man-signing-documents_0.jpeg?h=dbf711c8&itok=Fsv2SFyw",
    alt: "Businessman signing documents." },
  { name: "Ravi", themes: ["evidence"],
    summary: "An analyst turning incident reports nobody reads into the evidence that changes a standard.",
    img: MEDIA + "2025-10/tech-at-work-2.jpeg?h=d1cb525d&itok=83UZ5ZOR",
    alt: "Hands typing on laptop keyboard in collaborative workspace, focus on detailed finger placement." }
];
