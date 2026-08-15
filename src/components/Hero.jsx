import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import heroVideo from "../assets/videos/hero.mp4";

// The hero sits inside a taller "stage" than the viewport (190vh desktop /
// 150vh mobile) with the actual visible section pinned via position:sticky
// for that whole distance. Home.jsx pulls the Engine section up over the
// last portion of that stage with a negative margin, so the pinned hero is
// physically covered rather than simply scrolled past. Everything here is
// driven by scroll position (useScroll/useTransform + CSS sticky) — no
// wheel/touch interception, no scroll locking. Under prefers-reduced-motion
// the stage collapses back to a plain 100vh section with no sticky/scroll
// transforms — the Hero itself never disappears either way.
export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });

  // The transform range [0.5, 1] roughly lines up with when the Engine
  // section's rounded top edge starts sliding over the pinned hero (see
  // the matching negative margin in Home.jsx) — restrained scale/opacity,
  // not a dramatic zoom.
  const videoScale = useTransform(scrollYProgress, [0.5, 1], [1, 1.04]);
  const videoOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0.75]);
  const contentOpacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0.45, 0.95], [0, -40]);

  const heroSection = (
    <section
      id="top"
      className={`${reduced ? "" : "sticky top-0"} min-h-[100svh] md:h-screen w-full overflow-hidden bg-[#101210]`}
    >
      {/* Background Video — the primary visual; overlay only grades it for
          text legibility, never washes it pale. */}
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
        style={reduced ? undefined : { scale: videoScale, opacity: videoOpacity }}
        className={`absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-center scale-[1.02] transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={heroVideo} type="video/mp4" />
      </motion.video>

      {/* Cinematic legibility overlay — deep charcoal grade, left-weighted
          where the copy sits, never a pale wash over the video. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(13,15,13,0.88) 0%,
              rgba(13,15,13,0.62) 32%,
              rgba(13,15,13,0.28) 58%,
              rgba(13,15,13,0.08) 100%
            )
          `,
        }}
      />
      {/* Continuation fade — matches the dark cinematic base of the section
          below, so scrolling past the hero is never a hard cut. */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#101210] via-[#101210]/70 to-transparent pointer-events-none" />

      {/* Hero Content — pulled back up from the previous version, with
          mobile clearance so it never sits under the fixed nav */}
      <motion.div
        style={reduced ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex h-full min-h-[100svh] md:min-h-0 items-end pt-28 md:pt-0 pb-14 md:pb-20"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.16, 0.84, 0.44, 1],
            }}
            className="max-w-[680px]"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 sm:gap-4 uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[10px] sm:text-[11px] text-[#C58A2A] mb-7 flex-wrap">
              <span className="w-8 h-px bg-[#C58A2A] shrink-0" />
              <span className="whitespace-nowrap">Nirmora Creative</span>
              <span className="text-[#F5F1E8]/30 hidden sm:inline">•</span>
              <span className="whitespace-nowrap">Digital Experience Studio</span>
            </div>
            {/* Heading — controlled editorial scale, never oversized */}
            <h1 className="font-display font-bold leading-[0.97] tracking-tight text-[#F5F1E8] text-[40px] sm:text-[50px] md:text-[64px] lg:text-[78px]">
              Everything
              <br />
              <span className="text-[#C58A2A]">Begins</span>
              <br />
              With An Idea.
            </h1>
            {/* Paragraph */}
            <p className="mt-8 max-w-[560px] text-[16px] md:text-[18px] leading-[1.8] text-[#B8B6AF]">
              Every remarkable brand starts with a vision. We transform ideas
              into digital experiences that inspire, connect, and grow with
              purpose.
            </p>
            {/* Buttons */}
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full pl-8 pr-2 py-2 font-body font-semibold text-[14px] tracking-[0.01em] transition-all duration-300 whitespace-nowrap bg-[#C58A2A] text-[#171717] shadow-[0_14px_30px_-12px_rgba(197,138,42,0.5)] hover:-translate-y-0.5 hover:bg-[#D9A441] hover:shadow-[0_18px_40px_-12px_rgba(197,138,42,0.6)]"
              >
                <span className="transition-[letter-spacing] duration-300 group-hover:tracking-wide">
                  Start Project
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717]/10">
                  <ArrowRight size={15} className="text-[#171717] transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                to="/#work"
                className="inline-flex items-center gap-3 rounded-full border border-[#F5F1E8]/18 bg-[#F5F1E8]/[0.04] backdrop-blur-md px-8 py-4 text-[#F5F1E8] transition duration-300 hover:bg-[#F5F1E8]/[0.08] hover:border-[#C58A2A]/40"
              >
                View Work
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="h-12 w-px bg-gradient-to-b from-[#C58A2A] to-transparent" />
      </motion.div>
    </section>
  );

  // Reduced motion: no tall scroll stage, no sticky pin — just the hero
  // section in normal document flow, exactly like before this change.
  if (reduced) {
    return heroSection;
  }

  return (
    <div ref={stageRef} className="relative h-[150vh] md:h-[190vh]">
      {heroSection}
    </div>
  );
}
