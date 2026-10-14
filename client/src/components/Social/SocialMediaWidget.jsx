import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "../SocialBrandIcons";
import { site, socialTarget } from "../../lib/site";

const socials = [
  { icon: WhatsappIcon, label: "WhatsApp", href: site.social.whatsapp },
  { icon: InstagramIcon, label: "Instagram", href: site.social.instagram },
  { icon: TiktokIcon, label: "TikTok", href: site.social.tiktok },
  { icon: YoutubeIcon, label: "YouTube", href: site.social.youtube },
  { icon: FacebookIcon, label: "Facebook", href: site.social.facebook },
];

export default function SocialMediaWidget() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-white/40">
        Follow Us
      </p>

      <div className="flex gap-3">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            {...socialTarget(href)}
            aria-label={label}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/4 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <Icon className="h-5 w-5 text-current" />
          </a>
        ))}
      </div>
    </div>
  );
}
