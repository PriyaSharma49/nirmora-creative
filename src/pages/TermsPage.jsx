import LegalPage from '../components/legal/LegalPage.jsx'

const SECTIONS = [
  {
    id: 'engagement-scope',
    title: 'Engagement & Scope',
    body: 'Every project begins with a written proposal outlining deliverables, timeline and cost. Work begins once that scope is agreed — changes to scope after kickoff are handled through a simple change request, not silently absorbed or ignored.',
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    body: 'Projects are billed per the schedule in your proposal, typically a deposit to begin plus milestone or monthly payments. Retainer services are billed monthly in advance. Late payments may pause active work until resolved.',
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: 'Once a project is paid in full, ownership of the final deliverables (designs, code, campaign assets) transfers to you. Nirmora retains the right to showcase completed work in our portfolio unless otherwise agreed in writing.',
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    body: 'We work to the best of our ability using industry-standard practices, but we cannot guarantee specific business outcomes (traffic, rankings, conversions) as these depend on factors outside our control. Our liability is limited to fees paid for the relevant service.',
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      docTitle="Nirmora Creative — Terms & Conditions"
      pageIndex="01 / LEGAL"
      eyebrowLines={['Nirmora Creative', 'Legal']}
      titleLines={['Terms &', 'Conditions']}
      description="The terms that govern working with Nirmora Creative on a project or retainer."
      lastUpdated="August 2026"
      sections={SECTIONS}
      contactPrefix="Questions about these terms?"
      contactEmail="hello@nirmoracreative.com"
    />
  )
}
