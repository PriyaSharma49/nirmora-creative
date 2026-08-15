import imgInfluence from '../assets/services/InfluenceMarketing.webp'
import imgWeb from '../assets/services/WebDevelopment.webp'
import imgPerformance from '../assets/services/PerformanceMarketing.webp'
import imgCRM from '../assets/services/CustomerRelationship.webp'
import imgSocial from '../assets/services/SocialmediaMarketing.webp'

export const SERVICES = [
  {
    idx: '01',
    slug: 'website-development',
    img: imgWeb,
    title: 'Website Development',
    short: 'Modern, responsive, SEO-friendly websites and web apps engineered for performance, speed and a user experience that holds attention.',
    hero: 'Websites engineered to convert, not just look good.',
    intro:
      'A website is the one asset every channel points back to. We design and build fast, conversion-focused websites and web applications that feel premium, load instantly, and turn traffic into pipeline.',
    approach: [
      { title: 'Discover & Map', desc: 'We audit your current site, funnel and goals, then map the information architecture around how your buyers actually decide.' },
      { title: 'Design System', desc: 'A custom visual system — typography, layout grid, motion — built for your brand, not a template.' },
      { title: 'Build & Integrate', desc: 'Pixel-accurate, SEO-clean development with CRM, analytics and payment integrations wired in from day one.' },
      { title: 'Launch & Optimize', desc: 'We ship in sprints, then use real user data to keep improving speed, UX and conversion after launch.' },
    ],
    deliverables: [
      'Custom-designed, fully responsive website',
      'SEO-ready structure & technical performance tuning',
      'CMS or headless setup for easy content updates',
      'Analytics, CRM & form integrations',
      'Post-launch performance monitoring',
    ],
    stat: { value: '2.4x', label: 'Average lift in lead-form conversion after redesign' },
    features: [
      { title: 'Built for Speed', desc: 'Sub-second load times through image pipelines, code splitting and CDN delivery, not just a good Lighthouse score.' },
      { title: 'Structured for Search', desc: 'Semantic markup, clean URLs and schema baked in from the first commit, not bolted on after launch.' },
      { title: 'Content You Can Own', desc: 'A CMS or headless setup your team can actually update, without waiting on a developer for every change.' },
      { title: 'Designed to Convert', desc: 'Every page built around one clear next step, tested against how real visitors actually scroll and click.' },
      { title: 'Secure by Default', desc: 'SSL, hardened hosting and regular dependency updates, so the site stays safe as it grows.' },
      { title: 'Tracked From Day One', desc: 'Analytics and event tracking wired in at launch, so decisions are based on data, not guesses.' },
    ],
    caseStudy: {
      industry: 'Real Estate Developer',
      challenge: 'A dated site was leaking traffic — high bounce rate, no clear path to enquiry, and a form that barely anyone finished.',
      solution: 'Full rebuild with a faster stack, a shorter enquiry flow, and content restructured around what buyers actually ask first.',
      result: '312% increase in qualified enquiries within the first quarter post-launch.',
      timeline: '7 weeks',
      tech: ['React', 'Next.js', 'Tailwind CSS', 'Sanity CMS'],
    },
    faq: [
      { q: 'How long does a typical website project take?', a: 'Most projects run 4 to 8 weeks from kickoff to launch, depending on page count and how much custom functionality is involved. We share a fixed timeline before work begins.' },
      { q: 'Will I be able to update the site myself afterward?', a: 'Yes. We build on a CMS your team can use without touching code — updating text, images and blog content is a normal part of the handover.' },
      { q: 'Do you handle hosting and domains?', a: 'We can set up and manage hosting, or work with infrastructure you already have. Either way, you retain full ownership of the domain and codebase.' },
      { q: 'What happens after the site goes live?', a: 'We monitor performance and uptime, and offer ongoing optimization retainers for teams who want continuous improvement rather than a one-time build.' },
    ],
  },
  {
    idx: '02',
    slug: 'performance-marketing',
    img: imgPerformance,
    title: 'Performance Marketing',
    short: 'ROI-focused paid campaigns across Google, Meta and LinkedIn — built around measurable growth, not impressions.',
    hero: 'Paid media built around ROI, not vanity metrics.',
    intro:
      'We plan, launch and optimize paid campaigns across Google, Meta and LinkedIn with one goal: a lower, more predictable cost per qualified lead — reported honestly, every week.',
    approach: [
      { title: 'Audit & Benchmark', desc: 'We review past spend and set realistic, channel-specific CPL and ROAS targets before a rupee is spent.' },
      { title: 'Creative & Copy', desc: 'Scroll-stopping ad creative and copy, tested in small batches before scaling budget.' },
      { title: 'Launch & Scale', desc: 'Structured campaign builds across Search, Meta and LinkedIn, scaled only once the numbers hold.' },
      { title: 'Report & Refine', desc: 'A weekly dashboard with real numbers, and fast cuts to anything that isn\u2019t converting.' },
    ],
    deliverables: [
      'Channel strategy across Google, Meta & LinkedIn',
      'Ad creative, copy & landing page alignment',
      'Conversion tracking & attribution setup',
      'Weekly performance reporting',
      'Ongoing budget & bid optimization',
    ],
    stat: { value: '500+', label: 'Qualified leads generated per active campaign, on average' },
    features: [
      { title: 'Channel-Specific Strategy', desc: 'Search, Meta and LinkedIn each get their own targeting and creative logic, not one campaign copy-pasted three times.' },
      { title: 'Tested Before Scaled', desc: 'New creative and audiences run in small budgets first — scale only follows proof, never guesswork.' },
      { title: 'Attribution That Holds Up', desc: 'Conversion tracking built to survive iOS privacy changes and platform reporting gaps.' },
      { title: 'Landing Pages Included', desc: 'Ad and landing page built together, so the message stays consistent from click to conversion.' },
      { title: 'Weekly Transparency', desc: 'A plain-language report every week — spend, CPL, ROAS, and what we\u2019re changing next.' },
      { title: 'Fast to Cut Losses', desc: 'Underperforming ads and audiences get paused within days, not left running out of inertia.' },
    ],
    caseStudy: {
      industry: 'D2C Skincare Brand',
      challenge: 'Ad spend was rising month over month while cost per acquisition kept climbing in the wrong direction.',
      solution: 'Rebuilt campaign structure around three tested creative angles, with budget reallocated weekly based on ROAS.',
      result: 'Cost per acquisition cut by 41% while overall monthly revenue grew.',
      timeline: '10 weeks',
      tech: ['Google Ads', 'Meta Ads Manager', 'GA4', 'Looker Studio'],
    },
    faq: [
      { q: 'What\u2019s the minimum ad budget you work with?', a: 'We typically recommend a monthly media budget of at least \u20b950,000–75,000 per active channel, so there\u2019s enough data volume to optimize properly.' },
      { q: 'How soon will we see results?', a: 'Search campaigns often show early signal within 2–3 weeks. Meta and LinkedIn usually need 4–6 weeks to move past the learning phase before performance stabilizes.' },
      { q: 'Do you create the ad creative too?', a: 'Yes — copy, static creative and short-form video are part of the service, built specifically for each platform rather than reused across all of them.' },
      { q: 'How is reporting handled?', a: 'You get a weekly report with actual numbers — spend, cost per lead, ROAS — plus a short note on what we\u2019re changing and why.' },
    ],
  },
  {
    idx: '03',
    slug: 'social-media-marketing',
    img: imgSocial,
    title: 'Social Media Marketing',
    short: 'Creative content, strategy and community management that builds a brand presence people actually want to follow.',
    hero: 'A social presence people actually want to follow.',
    intro:
      'We plan, design and publish content that builds an audience — not just a posting schedule. Strategy, creative direction and community management, working as one system.',
    approach: [
      { title: 'Audience Research', desc: 'We study who your audience is, what they engage with, and where the gaps are versus competitors.' },
      { title: 'Content Strategy', desc: 'A monthly content calendar built around formats and topics proven to hold attention in your category.' },
      { title: 'Creative Production', desc: 'Design, video and copy produced in-house, on-brand, ready to publish.' },
      { title: 'Community & Growth', desc: 'Active engagement and reporting on what\u2019s actually driving followers, saves and leads.' },
    ],
    deliverables: [
      'Monthly content calendar & strategy',
      'Static, carousel & video content production',
      'Community management & engagement',
      'Hashtag & discovery strategy',
      'Monthly growth & engagement reporting',
    ],
    stat: { value: '218K+', label: 'Content views generated across a single client account' },
    features: [
      { title: 'Strategy Before Content', desc: 'Every post ties back to a monthly plan built on what your audience already engages with, not a random idea calendar.' },
      { title: 'In-House Production', desc: 'Design, video and copy handled by one team, so tone and visual identity stay consistent across every post.' },
      { title: 'Real Community Management', desc: 'Comments and DMs handled promptly and on-brand — the platform rewards accounts that actually engage back.' },
      { title: 'Format-Aware Creative', desc: 'Reels, carousels and static posts each built for how that specific format is actually consumed.' },
      { title: 'Discovery Strategy', desc: 'Hashtag, caption and posting-time strategy built around current platform behavior, revisited monthly.' },
      { title: 'Reporting That Means Something', desc: 'Growth and engagement reporting focused on followers, saves and shares that translate to real interest.' },
    ],
    caseStudy: {
      industry: 'Boutique Hospitality Brand',
      challenge: 'Inconsistent posting and generic content meant the account wasn\u2019t converting followers into bookings.',
      solution: 'A rebuilt content system with a clear visual identity, weekly reels, and active community management.',
      result: 'Follower growth of 4.2x in six months, with direct bookings attributed to Instagram inquiries.',
      timeline: 'Ongoing, 6-month retainer',
      tech: ['Meta Business Suite', 'CapCut', 'Later', 'Canva'],
    },
    faq: [
      { q: 'How many posts do you publish per month?', a: 'Typically 12–20 pieces of content across reels, carousels and stories, depending on the plan — always built around quality and a clear calendar rather than a fixed quota.' },
      { q: 'Do you handle comments and messages?', a: 'Yes, day-to-day community management is included — replying to comments and DMs in your brand voice, and flagging anything that needs your input directly.' },
      { q: 'Can you work with our existing content, if we have some?', a: 'Absolutely. We\u2019ll audit what\u2019s already working and build the new strategy around it rather than starting from zero.' },
      { q: 'How do you measure success here?', a: 'We track follower quality, engagement rate, saves and shares — and tie it back to inquiries or sales wherever that\u2019s trackable, not just vanity growth.' },
    ],
  },
  {
    idx: '04',
    slug: 'crm-systems',
    img: imgCRM,
    title: 'CRM Systems',
    short: 'We implement CRM workflows that automate lead management, streamline follow-ups and strengthen every customer relationship.',
    hero: 'Every lead followed up, automatically.',
    intro:
      'We design and implement CRM systems that make sure no lead falls through the cracks — automated capture, routing, follow-up sequences and reporting, all in one place.',
    approach: [
      { title: 'Map the Funnel', desc: 'We chart every stage from first touch to closed deal, and where leads are currently getting lost.' },
      { title: 'Build the System', desc: 'CRM setup with custom pipelines, lead scoring and automated follow-up sequences.' },
      { title: 'Connect Every Source', desc: 'Ads, website forms, WhatsApp and calls routed into one system automatically.' },
      { title: 'Train & Optimize', desc: 'We train your team on the system, then refine workflows based on real usage.' },
    ],
    deliverables: [
      'CRM setup & pipeline configuration',
      'Automated lead capture & routing',
      'Follow-up sequences & reminders',
      'Team onboarding & training',
      'Monthly pipeline health reporting',
    ],
    stat: { value: '0', label: 'Leads left unassigned once workflows go live' },
    features: [
      { title: 'One Pipeline, Every Source', desc: 'Ads, website forms, WhatsApp and calls all route into a single pipeline, so nothing gets tracked in three different spreadsheets.' },
      { title: 'Automated Follow-Up', desc: 'Sequenced reminders and messages fire automatically, so a lead never goes cold from someone forgetting to follow up.' },
      { title: 'Lead Scoring Built In', desc: 'Leads are ranked by fit and intent, so your team spends time on the ones actually likely to close.' },
      { title: 'Built Around Your Team', desc: 'Workflows designed around how your sales team actually works, not a generic out-of-the-box template.' },
      { title: 'Clear Pipeline Visibility', desc: 'A live view of every deal stage, so forecasting stops being a guessing game.' },
      { title: 'Ongoing Optimization', desc: 'Monthly review of what\u2019s stalling in the pipeline, with workflow adjustments based on real usage data.' },
    ],
    caseStudy: {
      industry: 'B2B Manufacturing Firm',
      challenge: 'Leads from three different sources were tracked manually, and follow-ups were inconsistent across the sales team.',
      solution: 'Unified CRM setup with automated routing, lead scoring, and follow-up sequences tailored to their sales cycle.',
      result: 'Average follow-up time dropped from 3 days to under 2 hours, with zero leads left unassigned.',
      timeline: '5 weeks',
      tech: ['HubSpot', 'WhatsApp Business API', 'Zapier', 'Google Sheets'],
    },
    faq: [
      { q: 'Which CRM platforms do you work with?', a: 'We most often implement HubSpot or Zoho, but the right platform depends on your budget, team size and existing tools — we\u2019ll recommend based on your specific setup.' },
      { q: 'Can it connect to WhatsApp and our ad accounts?', a: 'Yes. Lead capture from Meta and Google ads, WhatsApp Business, and web forms can all be routed automatically into a single pipeline.' },
      { q: 'Will our sales team need training?', a: 'We run hands-on onboarding sessions with your team and provide simple documentation, so the system gets used rather than ignored.' },
      { q: 'What if our sales process changes later?', a: 'Workflows are built to be adjusted — as your process evolves, we update pipelines and automations rather than rebuilding from scratch.' },
    ],
  },
  {
    idx: '05',
    slug: 'influencer-marketing',
    img: imgInfluence,
    title: 'Influencer Marketing',
    short: 'We connect brands with the right creators — not the biggest ones — to build reach, trust and engagement that converts into real sales.',
    hero: 'The right creators, not the biggest ones.',
    intro:
      'We identify, vet and manage creator partnerships built around trust and conversion — not follower count. Every collaboration is tracked back to real business impact.',
    approach: [
      { title: 'Creator Fit', desc: 'We shortlist creators whose audience actually overlaps with your buyer, verified for real engagement.' },
      { title: 'Brief & Negotiate', desc: 'Clear creative briefs and commercial terms that protect brand voice and budget.' },
      { title: 'Manage the Campaign', desc: 'End-to-end coordination — content approvals, posting schedule, usage rights.' },
      { title: 'Track the Impact', desc: 'Reach, engagement and conversion tracked per creator, so budget moves toward what works.' },
    ],
    deliverables: [
      'Creator shortlisting & vetting',
      'Briefing, negotiation & contracting',
      'Content approvals & campaign management',
      'Usage rights & repurposing for paid media',
      'Performance reporting per creator',
    ],
    stat: { value: '30+', label: 'Brand-creator partnerships managed to date' },
    features: [
      { title: 'Fit Over Follower Count', desc: 'Creators are shortlisted for genuine audience overlap and engagement quality, verified before any outreach happens.' },
      { title: 'Contracts That Protect You', desc: 'Clear briefs and usage rights agreed upfront, so there\u2019s no ambiguity about how content can be reused.' },
      { title: 'End-to-End Management', desc: 'From outreach to content approval to posting schedule — coordinated so you\u2019re not chasing creators directly.' },
      { title: 'Content Built for Repurposing', desc: 'Usage rights negotiated so top-performing creator content can be repurposed into paid media.' },
      { title: 'Per-Creator Reporting', desc: 'Reach, engagement and conversion tracked individually, so future budget goes to what actually worked.' },
      { title: 'Category-Aware Sourcing', desc: 'Creator research grounded in your specific category, not a generic influencer database search.' },
    ],
    caseStudy: {
      industry: 'D2C Beauty Brand',
      challenge: 'Previous influencer spend was concentrated on high-follower accounts with poor engagement and unclear ROI.',
      solution: 'Shifted budget toward 18 mid-tier creators with verified audience overlap, with usage rights for paid repurposing.',
      result: 'Engagement rate nearly tripled versus the prior campaign, at a lower total cost.',
      timeline: '8 weeks',
      tech: ['Creator databases', 'Meta Ads (whitelisting)', 'Google Sheets', 'Notion'],
    },
    faq: [
      { q: 'How do you find and vet creators?', a: 'We combine creator discovery tools with manual review of engagement quality and audience authenticity — follower count alone is never the deciding factor.' },
      { q: 'Do you negotiate rates and contracts?', a: 'Yes, we handle outreach, rate negotiation and contracting, including usage rights, so everything is clear before content goes live.' },
      { q: 'Can we reuse creator content in our own ads?', a: 'When usage rights are negotiated upfront — which we recommend — top-performing organic content can be whitelisted or repurposed into paid media.' },
      { q: 'How is campaign success measured?', a: 'We track reach, engagement rate and, where possible, attributed conversions per creator, so you can see which partnerships are actually worth repeating.' },
    ],
  },
]

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.slug === slug)

// Shared, cross-service content — not tied to any single service page
export const TECH_STACK = [
  'React', 'Next.js', 'Node.js', 'WordPress', 'Shopify', 'Firebase', 'MongoDB', 'AWS', 'Cloudflare', 'Framer Motion',
]

export const TESTIMONIALS = [
  {
    quote: 'Nirmora didn\u2019t just redesign our site — they rebuilt how leads move through our business. The difference showed up in the pipeline within weeks.',
    name: 'Aditi Rao',
    role: 'Founder',
    company: 'Real Estate Developer',
  },
  {
    quote: 'What stood out was how honest the reporting was. No inflated numbers, just a clear weekly view of what was working and what wasn\u2019t.',
    name: 'Karan Mehta',
    role: 'Marketing Lead',
    company: 'D2C Skincare Brand',
  },
  {
    quote: 'Our CRM used to be three spreadsheets and a lot of hope. Now every lead is tracked automatically, and our team actually trusts the pipeline.',
    name: 'Priyanka Shah',
    role: 'Operations Director',
    company: 'B2B Manufacturing Firm',
  },
]