import { HeroAtmosphere, HeroGraphics } from '../components/HeroGraphics';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Check, CheckCircle2, ChevronDown, Copy, Globe2, Mail, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import './contact.css';

const regionCodes = 'AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW'.split(' ');
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const countries = regionCodes.map(code => ({ code, name: regionNames.of(code) || code })).sort((a, b) => a.name.localeCompare(b.name));
const services = ['Trading Platform', 'Forex Brokerage Setup', 'Prop Firm Technology', 'White Label Solution', 'CRM & Back Office', 'Copy Trading', 'Liquidity Connectivity', 'API & Integrations', 'Technical Support', 'Partnership', 'Other'];
const fieldClass = 'contact-input';

interface EnquiryDraft { body: string; href: string }

export default function ContactUs() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get('service') || '';
  const initialService = services.includes(requestedService) ? requestedService : '';
  const [selectedService, setSelectedService] = useState(initialService);
  const [existingClient, setExistingClient] = useState('');
  const [requirements, setRequirements] = useState('');
  const [draft, setDraft] = useState<EnquiryDraft | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const oldTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const oldDescription = description?.getAttribute('content') || '';
    document.title = 'Contact Us | VTX Prime';
    description?.setAttribute('content', 'Discuss your trading technology requirements with VTX Prime. Enquire about platforms, white label solutions, integrations and brokerage infrastructure.');
    return () => { document.title = oldTitle; description?.setAttribute('content', oldDescription); };
  }, []);

  useEffect(() => { if (draft) resultRef.current?.focus(); }, [draft]);

  useEffect(() => { setSelectedService(initialService); setDraft(null); }, [initialService]);

  function prepareEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const country = countries.find(item => item.code === values.get('country'))?.name || '';
    const body = [
      'Hello VTX Prime,', '', 'I would like to discuss the following enquiry:', '',
      `Existing client: ${existingClient}`, `First name: ${String(values.get('firstName')).trim()}`,
      `Last name: ${String(values.get('lastName')).trim()}`, `Country: ${country}`,
      `Phone: ${String(values.get('callingCode')).trim()} ${String(values.get('phone')).trim()}`,
      `Email: ${String(values.get('email')).trim()}`, `Service: ${values.get('service')}`, '',
      'Additional requirements:', requirements.trim() || 'No additional requirements supplied.', '',
      `Marketing communications: ${values.get('marketing') ? 'Opted in' : 'Not opted in'}`,
      'Privacy Policy: Acknowledged', '', `Regards,\n${String(values.get('firstName')).trim()} ${String(values.get('lastName')).trim()}`,
    ].join('\n');
    setDraft({ body, href: `mailto:sales@vtxprime.com?subject=${encodeURIComponent(`VTX Prime enquiry — ${values.get('service')}`)}&body=${encodeURIComponent(body)}` });
    setCopyStatus('');
  }

  async function copyMessage() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft.body); setCopyStatus('Message copied. Paste it into an email to sales@vtxprime.com.'); }
    catch { setCopyStatus('Copy is unavailable. Expand the message preview below and select the text manually.'); }
  }

  return (
    <section className="contact-page">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container-page relative">
        <div className="contact-heading hero-enhanced"><HeroAtmosphere />
          <span className="contact-kicker"><span aria-hidden="true" /> CONTACT VTX PRIME</span>
          <h1>Let’s Build <span>Together.</span></h1>
          <p>Tell us what you have in mind. We’ll help you find the right<br className="hidden sm:block" /> technology for your next chapter.</p>
        <HeroGraphics primary="globe" secondary="network" label="Your next connection starts here" /></div>

        <div className="contact-shell">
          <div className="contact-form-intro"><span className="contact-intro-icon"><MessageSquare size={19} aria-hidden="true" /></span><div><h2>Start a conversation</h2><p>A few details. A clearer way forward.</p></div><span className="contact-step">01 / LET’S CONNECT</span></div>
          <form onSubmit={prepareEnquiry} onChange={() => { setDraft(null); setCopyStatus(''); }}>
            <fieldset className="contact-client-row">
              <legend className="sr-only">Are you an existing client? Required</legend>
              <p aria-hidden="true">Are you an existing client? <span className="contact-required">*</span></p>
              <div className="contact-client-options">{['Yes', 'No'].map(option => <label key={option} className="contact-radio-label"><input type="radio" name="existingClient" value={option} required checked={existingClient === option} onChange={event => setExistingClient(event.target.value)} /><span>{existingClient === option && <Check size={13} aria-hidden="true" />}{option}</span></label>)}</div>
            </fieldset>

            <div className="contact-fields">
              <label className="contact-label" htmlFor="contact-first-name">First Name <span className="contact-required">*</span><input id="contact-first-name" className={fieldClass} name="firstName" placeholder="John" autoComplete="given-name" required maxLength={80} pattern=".*\S.*" /></label>
              <label className="contact-label" htmlFor="contact-last-name">Last Name <span className="contact-required">*</span><input id="contact-last-name" className={fieldClass} name="lastName" placeholder="Doe" autoComplete="family-name" required maxLength={80} pattern=".*\S.*" /></label>
              <label className="contact-label" htmlFor="contact-country">Country <span className="contact-required">*</span><span className="contact-select-wrap"><select id="contact-country" className={fieldClass} name="country" autoComplete="country" defaultValue="" required><option value="" disabled>Select your country</option>{countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
              <div><label className="contact-label" htmlFor="contact-phone">Phone Number <span className="contact-required">*</span></label><div className="contact-phone"><input type="tel" name="callingCode" aria-label="Country calling code" autoComplete="tel-country-code" placeholder="+91" required pattern="\+[1-9][0-9]{0,3}" maxLength={5} title="Enter a calling code beginning with +, for example +91" /><input id="contact-phone" name="phone" type="tel" autoComplete="tel-national" placeholder="555 000 0000" required pattern="[0-9][0-9 \-]{5,23}" maxLength={24} title="Enter your phone number using digits, spaces or hyphens" /></div></div>
              <label className="contact-label" htmlFor="contact-email">Email Address <span className="contact-required">*</span><input id="contact-email" className={fieldClass} name="email" type="email" autoComplete="email" placeholder="john@company.com" required maxLength={200} /></label>
              <label className="contact-label" htmlFor="contact-service">Select Service <span className="contact-required">*</span><span className="contact-select-wrap"><select id="contact-service" className={fieldClass} name="service" value={selectedService} onChange={event => setSelectedService(event.target.value)} required><option value="" disabled>Choose a service</option>{services.map(service => <option key={service}>{service}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
            </div>

            <div className="contact-requirements"><div className="contact-textarea-label"><label className="contact-label" htmlFor="contact-requirements">Additional Requirements <span className="contact-optional">(optional)</span></label><span id="requirements-count">{requirements.length}/500</span></div><textarea id="contact-requirements" className={fieldClass} name="requirements" placeholder="Tell us briefly about your needs, your current setup, or what you’d like to build…" maxLength={500} rows={4} value={requirements} onChange={event => setRequirements(event.target.value)} aria-describedby="requirements-count" /></div>

            <div className="contact-consents">
              <label className="contact-checkbox"><input type="checkbox" name="marketing" /><span>I’d like to receive product updates and relevant communications from VTX Prime by email or phone. I can withdraw my consent at any time. <span className="contact-optional">(optional)</span></span></label>
              <div className="contact-checkbox"><input id="contact-privacy" type="checkbox" name="privacy" required /><label htmlFor="contact-privacy">I have read and understood the <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">VTX Prime Privacy Policy</Link>. <span className="contact-required">*</span></label></div>
            </div>

            <button type="submit" className="contact-submit">Prepare Your Enquiry <Send size={17} aria-hidden="true" /></button>
            <p className="contact-form-note"><ShieldCheck size={14} aria-hidden="true" />Your details stay here until you choose to send the prepared email.</p>
          </form>

          {draft && <div ref={resultRef} className="contact-result" tabIndex={-1} role="status"><div className="contact-result-title"><CheckCircle2 size={20} /><h3>Your enquiry is ready</h3></div><p>Nothing has been sent yet. Open your email app to review and send your message to our team.</p><div className="contact-result-actions"><a href={draft.href}>Open Email Draft <ArrowUpRight size={16} /></a><button type="button" onClick={copyMessage}><Copy size={15} />Copy Message</button></div>{copyStatus && <p role="status">{copyStatus}</p>}<details><summary>Preview your message</summary><pre>{draft.body}</pre></details></div>}
        </div>

        <div className="contact-bottom">
          <section className="contact-info-card"><p className="contact-card-eyebrow">A DIRECT LINE</p><h2>Contact Information</h2><a className="contact-email" href="mailto:sales@vtxprime.com"><span className="contact-info-icon"><Mail size={21} aria-hidden="true" /></span><span><strong>Email Us</strong><span>sales@vtxprime.com</span></span><ArrowUpRight size={19} aria-hidden="true" /></a><div className="contact-info-caption"><Globe2 size={15} aria-hidden="true" /><span>Trading technology. Connected globally.</span></div></section>
          <section className="contact-next-card"><span className="contact-next-number" aria-hidden="true">↗</span><p className="contact-card-eyebrow">YOUR NEXT CHAPTER</p><h2>Big plans start with<br />a simple hello.</h2><p>Whether you’re launching, connecting systems or refining your platform, tell us where you want to go.</p></section>
        </div>
      </div>
    </section>
  );
}
