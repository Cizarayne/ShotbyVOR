import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "./SocialIcons";
import { site, socialTarget } from "../lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080a0c]">

      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-8 lg:px-12">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/shotbyvor-logo.png"
                alt="ShotbyVor logo"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />

              <div>
                <span className="font-brand block text-[24px] leading-none tracking-wide">
                  SHOTBYVOR
                </span>

                <span className="mt-1 text-[9px] tracking-[0.2em] text-white/40">
                  PHOTOGRAPHY & FILMS
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
              Capturing authentic moments and transforming
              them into timeless visual stories through
              photography and film.
            </p>

            <div className="mt-6 flex gap-3">

              <SocialIcon
                icon={InstagramIcon}
                label="Instagram"
                href={site.social.instagram}
              />

              <SocialIcon
                icon={YoutubeIcon}
                label="YouTube"
                href={site.social.youtube}
              />

              <SocialIcon
                icon={FacebookIcon}
                label="Facebook"
                href={site.social.facebook}
              />

              <SocialIcon icon={TiktokIcon} label="TikTok" href={site.social.tiktok} />

            </div>

          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-sm font-semibold">
              Explore
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/45">

              <Link
                to="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/work"
                className="transition hover:text-white"
              >
                Work
              </Link>

              <Link
                to="/work/reels"
                className="transition hover:text-white"
              >
                Reels
              </Link>

              <Link
                to="/work/highlights"
                className="transition hover:text-white"
              >
                Highlights
              </Link>

              <Link
                to="/work/journals"
                className="transition hover:text-white"
              >
                Journals
              </Link>

            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-semibold">
              Studio
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/45">

              <Link
                to="/services"
                className="transition hover:text-white"
              >
                Services
              </Link>

              <Link
                to="/about-us"
                className="transition hover:text-white"
              >
                About Us
              </Link>

              <Link
                to="/contact-us"
                className="transition hover:text-white"
              >
                Contact Us
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center">

          <p>
            © {new Date().getFullYear()} SHOTBYVOR. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Back to top
              <ArrowUp
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}


/* Social Icon */

function SocialIcon({ icon: Icon, label, href = "#" }) {
  return (
    <a
      href={href}
      aria-label={label}
      {...socialTarget(href)}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/4 text-white/50 transition hover:bg-white/10 hover:text-white"
    >
      <Icon size={17} className="text-current" />
    </a>
  );
}