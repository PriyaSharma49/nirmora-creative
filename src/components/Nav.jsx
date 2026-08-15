import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

import logo from "../assets/brand/blackbg-logo.png";
import logoOnLight from "../assets/brand/whitebg-logo.png";

// "to" targets use full paths so navigation works correctly from ANY page
// (e.g. clicking "Home" while on a Service Detail page like Web Development
// now routes back to "/" and scrolls to the hero, instead of just appending
// a hash to the current URL). Home is deliberately a plain "/" — not "/#top"
// — because ScrollToTop.jsx already scrolls to 0 on every route change with
// no hash; giving Home a hash was what routed it through HashScrollHandler's
// 80ms-timeout/getBoundingClientRect logic instead, which is unreliable
// against PageTransition's 550ms exit animation and Hero's sticky
// positioning. Services/Work keep their hashes since those genuinely need
// to scroll to a specific section rather than the top.
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/#services", label: "Services" },
  { to: "/#work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [deepScrolled, setDeepScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // "scrolled" compacts the pill almost immediately (a shape change).
    // "deepScrolled" waits until roughly the hero's own reveal window has
    // passed, so on pages with a full-height dark hero (Home, Service
    // Detail) the navbar's light/dark flip stays in step with the ivory
    // content actually arriving underneath it instead of switching color
    // while the dark hero art is still mostly in view.
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setDeepScrolled(window.scrollY > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on every route change — not just on Link click —
  // so browser back/forward or programmatic navigation can't leave it stuck open.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Home and Service Detail pages open on a full-height dark hero (video or
  // cinematic art) before their ivory body content arrives; every other
  // page (About, FAQ, Contact, Privacy, Terms, Work) is ivory from the very
  // top, so the navbar should read charcoal-on-light immediately there.
  const onDarkHeroPage = location.pathname === "/" || location.pathname.startsWith("/services/");
  const overDarkHero = onDarkHeroPage && !deepScrolled;

  // Derived from the real route/hash so the underline stays correct after
  // browser back/forward or a direct URL load — not just after a click.
  const currentPath = `${location.pathname}${location.hash}`;
  const active =
    location.pathname === "/"
      ? location.hash === "#services"
        ? "/#services"
        : location.hash === "#work"
        ? "/#work"
        : "/"
      : LINKS.find((l) => l.to === location.pathname)?.to ?? currentPath;

  // Clicking Home while already on "/" with no hash is a no-op navigation —
  // the location object doesn't change, so neither ScrollToTop.jsx nor any
  // route-change effect fires. This covers exactly that one case; every
  // other Home click (from a different route, or from a hash) genuinely
  // changes the location and is already handled correctly by ScrollToTop.
  function handleHomeClick() {
    if (location.pathname === "/" && !location.hash) {
      // 'instant' bypasses the global scroll-behavior:smooth (index.css) —
      // see ScrollToTop.jsx for the full reasoning.
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 md:px-6 pointer-events-none">
      <div
        className={`
          pointer-events-auto w-full transition-all duration-500 ease-out border
          ${
            !scrolled
              ? "mt-0 max-w-[1400px] rounded-none bg-transparent border-transparent px-2 md:px-6"
              : overDarkHero
              ? "mt-3 md:mt-4 max-w-[1160px] rounded-full backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] bg-[#171916]/70 border-[#FBF7EF]/10 px-4 md:px-6"
              : "mt-3 md:mt-4 max-w-[1160px] rounded-full backdrop-blur-xl shadow-[0_8px_24px_rgba(32,34,31,0.10)] bg-[#FBF7EF]/85 border-[#20221F]/10 px-4 md:px-6"
          }
        `}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[56px] md:h-[68px]" : "h-[64px] md:h-[92px]"
          }`}
        >
          {/* Logo */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 shrink-0">
            <img
              src={overDarkHero ? logo : logoOnLight}
              alt="Nirmora"
              className={`w-auto object-contain transition-all duration-500 ${
                scrolled ? "h-[26px] md:h-[34px]" : "h-[28px] md:h-[40px]"
              }`}
            />
            <div className="leading-tight hidden sm:block">
              <p
                className={`font-display font-bold leading-none tracking-tight transition-colors duration-500 ${
                  overDarkHero ? "text-[#FBF7EF]" : "text-[#20221F]"
                } ${scrolled ? "text-[16px] md:text-[17px]" : "text-[17px] md:text-[19px]"}`}
              >
                Nirmora
              </p>
              <p className="uppercase tracking-[0.32em] text-[9px] text-[#C58A2A] mt-1">
                Creative
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-9">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={link.to === "/" ? handleHomeClick : undefined}
                className={`group relative py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-300 ${
                  overDarkHero
                    ? active === link.to
                      ? "text-[#FBF7EF]"
                      : "text-[#FBF7EF]/60 hover:text-[#FBF7EF]"
                    : active === link.to
                    ? "text-[#20221F]"
                    : "text-[#20221F]/55 hover:text-[#20221F]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-[#C58A2A] transition-all duration-300 ease-out ${
                    active === link.to ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/contact"
              className={`
                group relative hidden lg:inline-flex items-center gap-2.5
                overflow-hidden rounded-full pr-1.5
                text-[12.5px] font-semibold tracking-wide text-[#171717]
                transition-all duration-300 hover:scale-[1.02]
                bg-[#C58A2A] hover:bg-[#D9A441]
                hover:shadow-[0_6px_20px_rgba(197,138,42,0.45)]
                ${scrolled ? "py-1.5 pl-6" : "py-2 pl-7"}
              `}
            >
              <span className="relative z-10">Start Project</span>
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#171717]/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={13} className="text-[#171717]" />
              </span>
            </Link>

            <button
              className={`lg:hidden p-2 -mr-1 rounded-full transition ${
                overDarkHero ? "text-[#FBF7EF] hover:bg-[#FBF7EF]/10" : "text-[#20221F] hover:bg-[#20221F]/5"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-[#20221F]/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Slide-in panel */}
        <div
          className={`
            absolute top-0 right-0 h-full w-[78%] max-w-[320px]
            bg-[#FAF9F5] shadow-[-8px_0_30px_rgba(32,34,31,0.18)]
            transition-transform duration-400 ease-out
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="h-[64px] px-5 flex items-center justify-between border-b border-[#20221F]/10">
            <div className="flex items-center gap-2">
              <img src={logoOnLight} alt="Nirmora" className="h-[24px] w-auto object-contain" />
              <p className="font-display text-[15px] font-bold text-[#20221F]">Nirmora</p>
            </div>
            <button
              className="p-1.5 rounded-full text-[#20221F] hover:bg-[#20221F]/5 transition"
              onClick={() => setMobileOpen(false)}
              aria-label="Close Menu"
            >
              <X size={19} />
            </button>
          </div>

          <nav className="flex flex-col px-5 pt-4">
            {LINKS.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  setMobileOpen(false);
                  if (link.to === "/") handleHomeClick();
                }}
                style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
                className={`
                  font-display text-[18px] font-medium text-[#20221F]
                  py-3 border-b border-[#20221F]/[0.08]
                  transition-all duration-300 ease-out
                  hover:text-[#C58A2A]
                  ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}
                `}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="
                group relative mt-6 inline-flex items-center justify-between gap-2 overflow-hidden
                rounded-full text-[#171717]
                bg-[#C58A2A] active:bg-[#D9A441]
                pl-6 pr-1.5 py-1.5
                text-[13px] font-semibold
                transition-all duration-300
              "
            >
              <span className="relative z-10">Start Project</span>
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#171717]/10">
                <ArrowRight size={14} className="text-[#171717]" />
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
