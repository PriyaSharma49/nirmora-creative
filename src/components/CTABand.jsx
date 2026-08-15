import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal.jsx'

export default function CTABand() {
  return (
    <section className="relative bg-[#171916] py-20 md:py-28 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[900px] rounded-full blur-[140px] bg-[radial-gradient(circle,rgba(197,138,42,0.14)_0%,rgba(197,138,42,0)_70%)]" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8">
        <Reveal>
          <div
            className="rounded-[24px] px-8 py-16 md:px-16 md:py-20 flex flex-col items-center text-center"
            style={{ background: '#20221F', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <div className="eyebrow justify-center" style={{ color: '#C58A2A' }}>Let&apos;s Begin</div>
            <h3 className="font-display font-bold text-[32px] md:text-[52px] leading-[1.08] max-w-[760px] text-[#F5F1E8]">
              What comes next is worth building.
            </h3>
            <p className="mt-5 max-w-[480px] text-[16px] text-[#B8B6AF]">
              Tell us where your brand is today. We&apos;ll come back with a clear plan — not a generic proposal.
            </p>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full pl-8 pr-2 py-2 font-body font-semibold text-[14px] tracking-[0.01em] transition-all duration-300 whitespace-nowrap mt-10 hover:-translate-y-0.5 bg-[#C58A2A] hover:bg-[#D9A441]"
              style={{ color: '#171717' }}
            >
              <span>Start Your Project</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717]/10">
                <ArrowRight size={15} className="text-[#171717] transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
