import LegalPage from '../components/legal/LegalPage.jsx'

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: 'When you contact us or submit a project enquiry, we collect the details you provide directly — name, email, company and project information. We also collect standard analytics data (pages viewed, approximate location, device type) to understand how the site is used.',
  },
  {
    id: 'how-we-use-your-information',
    title: 'How We Use Your Information',
    body: 'We use the information you share to respond to enquiries, scope proposals and deliver the services you engage us for. We never sell your data, and we only share it with third-party tools (such as email or CRM providers) required to run our business.',
  },
  {
    id: 'cookies-analytics',
    title: 'Cookies & Analytics',
    body: 'We use essential cookies to keep the site functioning and lightweight analytics to understand aggregate traffic patterns. You can disable cookies in your browser at any time without losing access to the site.',
  },
  {
    id: 'data-retention-your-rights',
    title: 'Data Retention & Your Rights',
    body: 'We retain enquiry and project data only as long as needed for the relationship or as required by law. You can request access to, correction of, or deletion of your data at any time by emailing hello@nirmoracreative.com.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      docTitle="Nirmora Creative — Privacy Policy"
      pageIndex="02 / LEGAL"
      eyebrowLines={['Nirmora Creative', 'Legal']}
      titleLines={['Privacy', 'Policy']}
      description="How Nirmora Creative collects, uses and protects the information you share with us."
      lastUpdated="August 2026"
      sections={SECTIONS}
      contactPrefix="Questions about this policy?"
      contactEmail="hello@nirmoracreative.com"
    />
  )
}
