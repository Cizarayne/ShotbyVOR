import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Film,
  Images,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();

  /* Close dropdown when route changes */
  useEffect(() => {
    setWorkOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setWorkOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isWorkActive = location.pathname.startsWith("/work");

  const navLinkClass = ({ isActive }) =>
    `relative text-sm transition-colors duration-300 ${
      isActive
        ? "text-white"
        : "text-white/60 hover:text-white"
    }`;

  return (
    <header className="absolute left-0 right-0 top-0 z-50">

      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <img
            src="/shotbyvor-logo.png"
            alt="ShotbyVor logo"
            className="h-11 w-11 shrink-0 rounded-full object-cover transition-transform duration-300 group-hover:rotate-12"
          />

          <div>
            <span className="font-brand block text-[26px] leading-none tracking-wide text-white">
              SHOTBYVOR
            </span>

            <span className="mt-1 block text-[8px] tracking-[0.2em] text-white/50">
              PHOTOGRAPHY & FILMS
            </span>
          </div>
        </Link>

        {/* ==================================================
            DESKTOP NAV
        ================================================== */}

        <div className="hidden items-center gap-8 lg:flex">

          <NavLink
            to="/"
            end
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Home

                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                  />
                )}
              </>
            )}
          </NavLink>

          {/* ================= WORK DROPDOWN ================= */}

          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              onClick={() => setWorkOpen((prev) => !prev)}
              className={`group flex items-center gap-1.5 text-sm transition-colors duration-300 ${
                isWorkActive
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Work

              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  workOpen ? "rotate-180" : ""
                }`}
              />

              {isWorkActive && (
                <span className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {workOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-9 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#111416]/90 p-2 shadow-2xl backdrop-blur-2xl"
                >

                  {/* Glass highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent" />

                  <div className="relative">

                    {/* Work */}
                    <DropdownItem
                      to="/work"
                      icon={Images}
                      title="Work"
                      description="Explore our complete portfolio"
                    />

                    {/* Reels */}
                    <DropdownItem
                      to="/work/reels"
                      icon={Film}
                      title="Reels"
                      description="Short films & cinematic moments"
                    />

                    {/* Highlights */}
                    <DropdownItem
                      to="/work/highlights"
                      icon={Images}
                      title="Highlights"
                      description="Our favorite captured moments"
                    />

                    {/* Journals */}
                    <DropdownItem
                      to="/work/journals"
                      icon={BookOpen}
                      title="Journals"
                      description="Stories behind the visuals"
                    />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Services */}
          <NavLink
            to="/services"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Services

                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                )}
              </>
            )}
          </NavLink>

          {/* About */}
          <NavLink
            to="/about-us"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                About

                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                )}
              </>
            )}
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact-us"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Contact

                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                )}
              </>
            )}
          </NavLink>

        </div>

        {/* ==================================================
            BOOKING BUTTON
        ================================================== */}

        <Link
          to="/contact-us"
          className="group hidden items-center gap-3 rounded-xl border border-white/20 bg-white/[0.07] px-5 py-3.5 text-sm backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/[0.14] lg:flex"
        >
          Book a Session

          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/6 backdrop-blur-xl lg:hidden"
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>

      </nav>

      {/* ====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="mx-4 overflow-hidden rounded-2xl border border-white/10 bg-[#101315]/95 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col p-4">

              <MobileLink to="/" label="Home" />

              {/* Mobile Work */}
              <button
                onClick={() => setWorkOpen((prev) => !prev)}
                className="flex items-center justify-between border-b border-white/5 px-3 py-4 text-left text-sm text-white/70"
              >
                <span>Work</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    workOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {workOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden pl-4"
                  >
                    <MobileLink
                      to="/work"
                      label="Work"
                    />

                    <MobileLink
                      to="/work/reels"
                      label="Reels"
                    />

                    <MobileLink
                      to="/work/highlights"
                      label="Highlights"
                    />

                    <MobileLink
                      to="/work/journals"
                      label="Journals"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <MobileLink
                to="/services"
                label="Services"
              />

              <MobileLink
                to="/about-us"
                label="About"
              />

              <MobileLink
                to="/contact-us"
                label="Contact"
              />

              <Link
                to="/contact-us"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black"
              >
                <span style={{ color: "#000000" }}>Book a Shoot</span>
                <ArrowRight size={17} />
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}


/* ==========================================================
   DROPDOWN ITEM
========================================================== */

function DropdownItem({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-white/8"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors group-hover:bg-white/10">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            {title}
          </h3>

          <ArrowRight
            size={13}
            className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
          />
        </div>

        <p className="mt-0.5 text-[11px] leading-4 text-white/40">
          {description}
        </p>
      </div>
    </Link>
  );
}


/* ==========================================================
   MOBILE LINK
========================================================== */

function MobileLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `block border-b border-white/5 px-3 py-4 text-sm transition-colors ${
          isActive
            ? "text-white"
            : "text-white/65 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}