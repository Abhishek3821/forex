import { HeroAtmosphere, HeroGraphics } from '../components/HeroGraphics';
const sections = [
  ['Information we collect', 'We may collect information you provide directly, including your name, business email address, company details, and the contents of messages you send to us. We may also collect technical information such as your IP address, browser type, device information, and how you use our website.'],
  ['How we use information', 'We use information to respond to enquiries, provide and improve our products and services, maintain the security and performance of our website, communicate relevant business updates, and comply with legal obligations.'],
  ['Cookies and analytics', 'Our website may use essential cookies and similar technologies to operate correctly. Where permitted, we may also use analytics tools to understand site usage and improve the experience. You can control cookies through your browser settings.'],
  ['How we share information', 'We do not sell personal information. We may share information with trusted service providers that support our operations, with professional advisers, or with public authorities when required by law.'],
  ['Data retention and security', 'We retain personal information only for as long as reasonably necessary for the purposes described in this policy or as required by law. We use appropriate technical and organisational safeguards designed to protect information.'],
  ['Your rights', 'Depending on your location, you may have rights to access, correct, delete, restrict, or object to the processing of your personal information, or to request a portable copy.'],
  ['International transfers', 'VTX Prime operates with global partners and service providers. Your information may therefore be processed outside your country. Where required, we use appropriate safeguards for international data transfers.'],
  ['Changes to this policy', 'We may update this privacy policy to reflect changes to our practices, technology, or legal requirements. The revised version will be posted on this page with an updated effective date.'],
];

export default function PrivacyPolicy() {
  return (
    <article className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-radial-blue opacity-50" />
      <div className="container-page relative max-w-4xl">
        <header className="privacy-hero-enhanced hero-enhanced"><HeroAtmosphere /><p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-sm text-text-muted">Effective date: 27 October 2026</p>
        <HeroGraphics primary="security" secondary="layers" label="Privacy by design" /></header><p className="mt-8 max-w-3xl text-lg leading-8 text-text-secondary">
          VTX Prime respects your privacy. This policy explains what information we collect through our website, why we use it, and the choices available to you.
        </p>
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/10 p-6">
          <h2 className="font-display text-lg font-bold text-white">Our role</h2>
          <p className="mt-2 leading-7 text-text-secondary">
            VTX Prime is solely a technology provider. We provide software and technology infrastructure to businesses. We are not a broker, financial institution, investment adviser, custodian, or trading counterparty; we do not provide investment or financial advice, execute trades for end users, or hold client funds.
          </p>
        </div>
        <div className="mt-12 space-y-5">
          {sections.map(([title, body], index) => (
            <section key={title} className="glass-card rounded-xl p-6 sm:p-8">
              <div className="flex gap-4">
                <span className="font-mono text-sm font-semibold text-primary-light">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{title}</h2>
                  <p className="mt-3 leading-7 text-text-secondary">{body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-2xl font-bold text-white">Contact us</h2>
          <p className="mt-3 leading-7 text-text-secondary">For privacy questions or requests, email <a className="font-semibold text-primary-light hover:text-accent" href="mailto:sales@vtxprime.com">sales@vtxprime.com</a>.</p>
        </section>
      </div>
    </article>
  );
}
