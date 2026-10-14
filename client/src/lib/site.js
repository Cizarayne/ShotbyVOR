// ── Site-wide config ────────────────────────────────────────────────────────────
// Single place for brand + social links. Replace the "#" placeholders with
// the studio's real profile URLs and they update everywhere (navbar sidebar,
// footer, home hero).
//
// IMPORTANT — set `url` to the real production domain before deploying
// (e.g. "https://shotbyvor.com"). It powers the canonical link, Open Graph
// tags, sitemap.xml, and robots.txt — all absolute URLs search engines need.
export const site = {
  name: "SHOTBYVOR",
  tagline: "PHOTOGRAPHY & FILMS",
  url: "https://shotbyvor.vercel.app",
  description:
    "SHOTBYVOR is a creative photography and videography studio — portraits, events, weddings, concerts, commercials and cinematic reels.",
  locale: "en_US",
  social: {
    whatsapp: "https://wa.me/+2348106971871",
    instagram: "https://instagram.com/shotbyvor_",
    tiktok: "https://tiktok.com/@shotbyvor",
    youtube: "https://youtube.com/@shotbyvor",
    facebook: "https://facebook.com/shotbyvor",
  },
};

// External social URLs open in a new tab; placeholder "#" links stay in-page.
export function socialTarget(href) {
  return href && href.startsWith("http")
    ? { target: "_blank", rel: "noreferrer" }
    : {};
}
