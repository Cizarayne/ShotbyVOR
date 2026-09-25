import { useEffect } from "react";
import { site } from "./site";

// Sets <title> + meta description/canonical/Open Graph/Twitter tags per page.
// Call at the top of every public page: useSEO({ title, description, path }).
// JournalDetail passes its own fetched title/excerpt instead.
export function useSEO({ title, description, path = "/", image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
    const desc = description || site.description;
    const canonical = `${site.url}${path}`;

    document.title = fullTitle;

    const tags = [
      ["name", "description", desc],
      ["name", "robots", noindex ? "noindex, nofollow" : "index, follow"],
      ["property", "og:type", "website"],
      ["property", "og:site_name", site.name],
      ["property", "og:title", fullTitle],
      ["property", "og:description", desc],
      ["property", "og:url", canonical],
      ["property", "og:image", image || `${site.url}/shotbyvor-logo.png`],
      ["property", "og:locale", site.locale],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", fullTitle],
      ["name", "twitter:description", desc],
      ["name", "twitter:image", image || `${site.url}/shotbyvor-logo.png`],
    ];

    const created = [];
    for (const [attr, key, value] of tags) {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute("content", value);
    }

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
      created.push(link);
    }
    link.setAttribute("href", canonical);

    // Only the tags this hook created are removed on unmount; static tags
    // from index.html are left alone.
    return () => {
      created.forEach((el) => el.remove());
    };
  }, [title, description, path, image, noindex]);
}
