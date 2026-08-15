import { useMemo, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PROJECTS, getProjectBySlug } from '../data/projects.js'

// =============================================================================
// PROJECT DETAIL — the same system as the homepage Work archive, given its
// own page: the project's logo on a lit stage, its name in large serif
// type, fixed-label/turning-value detail rows, and an index into the rest
// of the archive at the close. Deliberately not a 3-card grid.
// =============================================================================

const EASE = [0.22, 1, 0.36, 1]
const SAGE = '#C58A2A'
const SAGE_RGB = '197,138,42'

function hashSlug(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function AmbientField({ slug }) {
  const h = hashSlug(slug)
  const x1 = 10 + (h % 30)
  const y1 = 5 + ((h >> 3) % 25)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute rounded-full blur-[120px]"
        style={{ left: `${x1}%`, top: `${y1}%`, width: '50vw', height: '50vw', background: `radial-gradient(circle, rgba(${SAGE_RGB},0.16), transparent 70%)` }}
      />
      <div
        className="absolute right-[12%] bottom-[10%] w-[36vw] h-[36vw] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(184,190,199,0.10), transparent 70%)' }}
      />
    </div>
  )
}

function DetailRow({ label, value, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className="border-t border-[#20221F]/10 py-6 md:py-7 grid grid-cols-1 md:grid-cols-[130px_1fr] gap-2.5 md:gap-10 text-left"
    >
      <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#C58A2A]/85 pt-0.5">{label}</div>
      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#66665F]">{value}</p>
    </motion.div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <Navigate to="/" replace />

  const others = useMemo(() => PROJECTS.filter((p) => p.slug !== slug).slice(0, 4), [slug])
  const index = PROJECTS.findIndex((p) => p.slug === slug) + 1

  return (
    <div className="bg-[#FBF7EF]">
      {/* ---------------------------------------------------------------- */}
      {/* Stage — logo, name, tag, description                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[86vh] flex flex-col justify-center overflow-hidden pt-32 pb-20">
        <AmbientField slug={slug} />

        <div className="relative max-w-[880px] mx-auto w-full px-6 md:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-2 text-[12.5px] text-[#20221F]/40 mb-8"
          >
            <Link to="/#work" className="text-[#20221F]/40 hover:text-[#C58A2A] transition-colors">Work</Link>
            <span>/</span>
            <span className="text-[#20221F]/70">{project.name}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex items-center gap-3 font-mono text-[11px] text-[#20221F]/35 mb-9"
          >
            <span>{String(index).padStart(2, '0')}</span>
            <span className="w-8 h-px bg-[#20221F]/20" />
            <span>{String(PROJECTS.length).padStart(2, '0')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="relative w-36 h-36 md:w-52 md:h-52 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, rgba(${SAGE_RGB},0.14) 0%, rgba(${SAGE_RGB},0) 70%)`,
              border: '1px solid rgba(32,34,31,0.14)',
            }}
          >
            <img src={project.logo} alt={`${project.name} logo`} className="max-h-16 md:max-h-20 w-auto object-contain" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="mt-7 md:mt-9 font-display text-[38px] md:text-[64px] leading-[1.03] text-[#20221F]"
          >
            {project.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C58A2A]/80"
          >
            {project.tag}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="mt-6 max-w-[540px] text-[15px] md:text-[17px] leading-relaxed text-[#66665F]"
          >
            {project.desc}
          </motion.p>

          <div className="w-full max-w-[680px] mt-12 md:mt-14">
            <DetailRow label="Challenge" value={project.challenge} delay={0.1} />
            <DetailRow label="Strategy" value={project.approach} delay={0.18} />
            <DetailRow label="Result" value={project.result} delay={0.26} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* More from the archive                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative py-24 md:py-32 bg-[#E9E5DA]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="eyebrow">More From The Archive</div>
          <h2 className="font-display font-semibold text-[#20221F] leading-[1.1]" style={{ fontSize: 'clamp(24px, 3.2vw, 40px)' }}>
            Continue through the work.
          </h2>

          <div className="mt-10 md:mt-12 h-px w-full bg-[#20221F]/10" />
          {others.map((p) => (
            <Link
              key={p.slug}
              to={`/work/${p.slug}`}
              className="group relative flex items-center justify-between gap-6 py-6 md:py-7 border-b border-[#20221F]/10"
            >
              <div className="flex items-center gap-6 md:gap-10 min-w-0">
                <img src={p.logo} alt="" className="h-9 w-9 md:h-11 md:w-11 rounded-full object-contain flex-none bg-[#20221F]/[0.03] p-1.5" />
                <div className="min-w-0">
                  <span className="font-display font-semibold text-[#20221F] transition-colors duration-300 group-hover:text-[#C58A2A] block truncate" style={{ fontSize: 'clamp(18px, 2.6vw, 28px)' }}>
                    {p.name}
                  </span>
                  <span className="text-[12.5px] text-[#20221F]/40">{p.tag}</span>
                </div>
              </div>
              <ArrowUpRight size={20} className="flex-none text-[#20221F]/30 transition-all duration-300 group-hover:text-[#C58A2A] group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative py-24 md:py-32 bg-[#FBF7EF]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="glass-card px-8 py-14 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <h3 className="font-display font-bold text-[24px] md:text-[32px] leading-tight max-w-[560px] text-[#20221F]">
              Want a result like this for your brand?
            </h3>
            <Link to="/contact" className="btn-gold-solid flex-none">
              Start Project <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
