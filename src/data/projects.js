import aidz from '../assets/clients/Aidz.webp'
import urban from '../assets/clients/Urban.webp'
import bharat from '../assets/clients/Bharat.webp'
import bamboo from '../assets/clients/Bamboo.webp'
import omsai from '../assets/clients/Omsai.webp'
import palm from '../assets/clients/Palm.webp'
import astrelle from '../assets/clients/Astrelle.webp'
import soham from '../assets/clients/Soham.webp'
import datel from '../assets/clients/Datal.webp'

export const FILTERS = ['All Work', 'Branding', 'Real Estate', 'FMCG & Industry']

export const PROJECTS = [
  {
    slug: 'didiz',
    cats: ['branding'], logo: aidz, name: 'Didiz',
    desc: 'A precision measuring-tools brand with a mark that reads instantly at any size — from packaging to storefront signage.',
    tag: 'Branding & Identity',
    challenge: 'Didiz needed an identity that felt precise and trustworthy on a factory floor, yet still read clearly on a shelf label the size of a thumbnail.',
    approach: 'We built a geometric mark with a tight construction grid, then stress-tested it across packaging, signage and embossed tooling to make sure it never lost clarity.',
    result: 'A single, scalable identity now runs across the full product range, cutting packaging design turnaround from weeks to days.',
  },
  {
    slug: 'urban-aura-realty',
    cats: ['branding', 'real'], logo: urban, name: 'Urban Aura Realty',
    desc: 'Full identity plus lead-generation campaigns for a modern urban real estate brand.',
    tag: 'Branding + Performance Marketing',
    challenge: 'Urban Aura needed to stand out in a crowded real estate market and turn ad spend into qualified site visits, not just impressions.',
    approach: 'We paired a confident new identity with tightly targeted Meta and Google campaigns, feeding every lead directly into a CRM pipeline with automated follow-up.',
    result: 'Qualified leads scaled month over month with a lower cost-per-lead than the brand\u2019s previous two agencies combined.',
  },
  {
    slug: 'bharat-park',
    cats: ['branding', 'real'], logo: bharat, name: 'Bharat Park',
    desc: 'A civic-scale identity built around a mark that had to work on wayfinding, print and digital in equal measure.',
    tag: 'Branding & Identity',
    challenge: 'A civic-scale development needed an identity flexible enough for wayfinding signage, brochures and a digital presence — all built by different vendors.',
    approach: 'We developed a modular identity system with strict usage guidelines, so the mark stayed consistent no matter who implemented it.',
    result: 'A cohesive brand presence across every physical and digital touchpoint on the development.',
  },
  {
    slug: 'bam-and-boo',
    cats: ['branding', 'fmcg'], logo: bamboo, name: 'Bam&Boo',
    desc: 'Packaging-first identity for a natural baby-care brand, built to feel gentle on shelf and trustworthy at a glance.',
    tag: 'Branding & Identity',
    challenge: 'A natural baby-care line needed to feel gentle and safe at a glance, in a category crowded with similar pastel packaging.',
    approach: 'We built a soft, distinctive palette and typography system anchored around a custom illustrated mark, tested across shelf mockups.',
    result: 'A packaging system that stands out on shelf while still signalling the gentleness the category demands.',
  },
  {
    slug: 'om-sai-industries',
    cats: ['branding', 'fmcg'], logo: omsai, name: 'Om Sai Industries',
    desc: 'An industrial-manufacturing identity built for credibility across every touchpoint, from letterheads to plant signage.',
    tag: 'Branding & Identity',
    challenge: 'A manufacturing business needed an identity that signalled credibility to enterprise buyers, not just a logo refresh.',
    approach: 'We built a disciplined, confident visual system extended across stationery, plant signage and a new sales deck template.',
    result: 'A consistent, credible brand presence across every buyer touchpoint, from first email to plant visit.',
  },
  {
    slug: 'sg-rebel-rise-global',
    cats: ['branding', 'fmcg'], logo: palm, name: 'SG Rebel Rise Global',
    desc: 'A 100% palm oil brand mark designed for shelf standout and food-safe trust, from label to export packaging.',
    tag: 'Branding & Identity',
    challenge: 'An export-focused palm oil brand needed packaging that read as food-safe and premium across very different international shelves.',
    approach: 'We designed a mark and label system built around clarity and trust cues, tested across export and domestic packaging formats.',
    result: 'A single packaging system now ships across both domestic and export markets without redesign.',
  },
  {
    slug: 'astrelle',
    cats: ['branding', 'fmcg'], logo: astrelle, name: 'Astrelle',
    desc: 'A soft-luxury sleepwear identity — a mark and palette designed to feel like a slow, sunlit morning.',
    tag: 'Branding & Identity',
    challenge: 'A new sleepwear label needed a soft-luxury identity that could compete visually with established D2C brands from day one.',
    approach: 'We built a restrained, warm visual language — typography, palette and photography direction — designed to feel considered rather than loud.',
    result: 'A launch-ready brand system that reads premium across packaging, product photography and social.',
  },
  {
    slug: 'soham-enterprises',
    cats: ['branding', 'fmcg'], logo: soham, name: 'Soham Enterprises',
    desc: 'A clean, trustworthy enterprise mark built to travel across invoices, signage and digital alike.',
    tag: 'Branding & Identity',
    challenge: 'Soham Enterprises needed one consistent mark that worked equally well on an invoice, a storefront and a WhatsApp profile photo.',
    approach: 'We simplified an existing mark into a cleaner, more legible form and built a lightweight brand guideline for consistent use.',
    result: 'A consistent brand presence across every customer-facing document and surface.',
  },
  {
    slug: 'datel-enterprises',
    cats: ['branding', 'fmcg'], logo: datel, name: 'Datel Enterprises',
    desc: 'A sharp, high-contrast enterprise mark built for instant recognition across product lines and paperwork alike.',
    tag: 'Branding & Identity',
    challenge: 'Datel needed a mark that stayed instantly recognizable across a wide, growing product line and heavy day-to-day paperwork.',
    approach: 'We built a high-contrast, geometric mark designed to reproduce cleanly at small sizes across print and digital.',
    result: 'A unified identity now anchors the full product line and every piece of company paperwork.',
  },
]

export const getProjectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug)

export const filterKey = (f) => {
  if (f === 'Real Estate') return 'real'
  if (f === 'FMCG & Industry') return 'fmcg'
  return f.toLowerCase()
}
