import {
  Camera,
  Clapperboard,
  Heart,
  Megaphone,
  Music,
  SlidersHorizontal,
  Video,
} from "lucide-react";

export const services = [
  {
    number: "01",
    title: "Brands & Commercials",
    tagline: "Made to sell without feeling like an ad.",
    description:
      "Visual campaigns, branded content, advertisements, and commercial storytelling.",
    image: "/images/services_illustrations/Brands & Commercials.png",
    category: "COMMERCIAL",
    Icon: Megaphone,
    deliverables: ["Brand films", "Ad creatives", "Product stories"],
    meta: "120+ campaigns delivered",
  },
  {
    number: "02",
    title: "Concerts & Nightlife",
    tagline: "Loud rooms, sharp focus.",
    description:
      "High-energy coverage of concerts, nightlife, parties, performances, and live events.",
    image: "/images/services_illustrations/Concerts & Nightlife.png",
    category: "NIGHTLIFE",
    Icon: Music,
    deliverables: ["Aftermovies", "Recaps", "Artist coverage"],
    meta: "100+ shows shot",
    focus: "68% 28%",
  },
  {
    number: "03",
    title: "Photography",
    tagline: "Still frames with motion in them.",
    description:
      "Professional portraits, lifestyle, editorial, event, and creative photography.",
    image: "/images/services_illustrations/Photography.png",
    category: "PHOTOGRAPHY",
    Icon: Camera,
    deliverables: ["Portraits", "Editorial", "Event galleries"],
    meta: "Private online gallery",
  },
  {
    number: "04",
    title: "Videography",
    tagline: "Coverage that feels like cinema.",
    description:
      "Cinematic event coverage, short films, music visuals, lifestyle films, and promotional videos.",
    image: "/images/services_illustrations/Videography.png",
    category: "VIDEOGRAPHY",
    Icon: Video,
    deliverables: ["Event films", "Music visuals", "Promo videos"],
    meta: "Shot in 4K + social cuts",
  },
  {
    number: "05",
    title: "Editing & Grading",
    tagline: "Where good footage becomes unforgettable.",
    description:
      "Professional video editing, cinematic color grading, visual refinement, and post-production.",
    image: "/images/services_illustrations/Editing & Grading.png",
    category: "POST-PRODUCTION",
    Icon: SlidersHorizontal,
    deliverables: ["Cuts & pacing", "Color grade", "Sound polish"],
    meta: "Review rounds included",
  },
  {
    number: "06",
    title: "Weddings & Celebrations",
    tagline: "Quiet moments, caught honestly.",
    description:
      "Intimate wedding films and celebration coverage — vows, chaos, dance floors and all.",
    image: "/images/services_illustrations/Weddings & Celebrations.png",
    category: "WEDDINGS",
    Icon: Heart,
    deliverables: ["Highlight film", "Full-length cut", "Photo + film bundles"],
    meta: "Limited dates per season",
  },
];

export { Clapperboard };

