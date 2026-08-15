import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PageHero({ eyebrow, title, subtitle, breadcrumb }) {
  return (
    <section className="relative bg-[#FBF7EF] pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full blur-[140px] bg-[radial-gradient(circle,rgba(197,138,42,0.10)_0%,rgba(197,138,42,0)_70%)]" />
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#20221F]/10 to-transparent" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8">
        {breadcrumb && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
            className="flex items-center gap-2 text-[12.5px] text-[#20221F]/45 mb-8"
          >
            <Link to="/" className="text-[#20221F]/45 hover:text-[#C58A2A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#20221F]/70">{breadcrumb}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 0.84, 0.44, 1] }}
          className="max-w-[820px]"
        >
          {eyebrow && (
            <div className="eyebrow">{eyebrow}</div>
          )}
          <h1 className="font-display font-bold leading-[1.05] tracking-tight text-[#20221F] text-[36px] sm:text-[46px] md:text-[60px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-[620px] text-[16px] md:text-[18px] leading-[1.75] text-[#66665F]">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
