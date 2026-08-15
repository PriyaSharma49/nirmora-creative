import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { FAQS } from '../data/faqs.js'

function FaqItem({ item, open, onClick }) {
  return (
    <div className="border-b border-[#20221F]/[0.14]">
      <button onClick={onClick} className="w-full text-left py-7 flex justify-between items-center gap-5 font-display font-semibold text-[17px] md:text-[19px] text-[#20221F]">
        {item.q}
        <Plus size={18} className={`flex-none text-[#C58A2A] transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
      </button>
      <div className="grid transition-all duration-400" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="pb-7 text-[15px] leading-relaxed text-[#66665F] max-w-[680px]">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <>
      <PageHero
        breadcrumb="FAQ"
        eyebrow="FAQ"
        title="Questions we get asked most."
        subtitle="Everything you need to know before starting a project with Nirmora. Can't find your answer? Reach out directly."
      />

      <section className="section-light pb-24 md:pb-32">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          <Reveal>
            <div className="glass-card px-7 md:px-12 py-3">
              {FAQS.map((item, i) => (
                <FaqItem key={item.q} item={item} open={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-card mt-8 px-8 py-12 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-7 text-center md:text-left">
              <div>
                <h3 className="font-display text-[22px] md:text-[26px] font-semibold text-[#20221F] mb-1.5">
                  Still have a question?
                </h3>
                <p className="text-[14.5px] text-[#66665F]">We'll get back to you within one business day.</p>
              </div>
              <Link to="/contact" className="btn-gold-solid flex-none">
                Contact Us <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
