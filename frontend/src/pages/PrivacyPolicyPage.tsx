import { Helmet } from 'react-helmet-async';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold mb-3"
        style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <div className="w-10 h-0.5 mb-4" style={{ backgroundColor: '#C9A84C' }} />
      <div
        className="text-sm leading-relaxed space-y-3"
        style={{ color: '#4B5563', fontFamily: 'var(--font-body)' }}
      >
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Naresh Jewellers</title>
        <meta name="description" content="Privacy Policy for Naresh Jewellers. Learn how we collect, use and protect your personal data in compliance with UK GDPR." />
      </Helmet>
      <main className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1
              className="text-3xl sm:text-4xl font-normal mb-3"
              style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}
            >
              Privacy Policy
            </h1>
            <div className="w-16 h-0.5 mx-auto mb-4" style={{ backgroundColor: '#C9A84C' }} />
            <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Last updated: January 2025
            </p>
          </div>

          <Section title="Who We Are">
            <p>
              Naresh Jewellers is a jewellery retailer based at 4 High St, Smethwick B66 1DX, United Kingdom. We operate the website at nareshjewellers.co.uk and can be contacted at{' '}
              <a href="mailto:nareshkumari100@yahoo.com" style={{ color: '#C9A84C' }}>nareshkumari100@yahoo.com</a>.
            </p>
            <p>
              We are committed to protecting your personal data and processing it fairly and transparently in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </Section>

          <Section title="What Data We Collect">
            <p>We may collect and process the following personal information:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Identity data:</strong> first name, last name</li>
              <li><strong>Contact data:</strong> email address, phone number, postal address</li>
              <li><strong>Transaction data:</strong> details of purchases and payments</li>
              <li><strong>Technical data:</strong> IP address, browser type, pages visited, and time spent on our site</li>
              <li><strong>Communications:</strong> messages you send us via our contact or enquiry forms</li>
              <li><strong>Appointment data:</strong> date, time, and purpose of any appointment you book</li>
            </ul>
          </Section>

          <Section title="How We Use Your Data">
            <p>We use your personal data to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Process and fulfil your orders</li>
              <li>Manage your account and provide customer support</li>
              <li>Send order confirmations and service-related communications</li>
              <li>Schedule and manage in-store appointments</li>
              <li>Respond to your enquiries</li>
              <li>Improve our website and services through analytics</li>
              <li>Comply with our legal obligations</li>
            </ul>
            <p>
              We will only send you marketing communications if you have consented to receive them. You may withdraw consent at any time by contacting us.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device. We use:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Essential cookies:</strong> required for the website to function (e.g. shopping cart, login session)</li>
              <li><strong>Analytics cookies:</strong> help us understand how visitors use our site (e.g. Google Analytics)</li>
              <li><strong>Preference cookies:</strong> remember your settings and language preferences</li>
            </ul>
            <p>
              You can manage cookie preferences in your browser settings. Disabling cookies may affect the functionality of certain features.
            </p>
          </Section>

          <Section title="Third Parties">
            <p>We share your data with trusted third parties only where necessary:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong>Stripe:</strong> We use Stripe to process card payments securely. Your payment card details are processed directly by Stripe and are never stored on our servers. Stripe's privacy policy is available at{' '}
                <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>stripe.com/gb/privacy</a>.
              </li>
              <li>
                <strong>Delivery couriers:</strong> We share your delivery address with our courier partners to fulfil your order.
              </li>
              <li>
                <strong>Email providers:</strong> We use email services to send order confirmations and customer communications.
              </li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>
          </Section>

          <Section title="Data Retention">
            <p>
              We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements. Order records are typically retained for 7 years in accordance with HMRC requirements.
            </p>
          </Section>

          <Section title="Your Rights (GDPR)">
            <p>Under UK GDPR, you have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Right to access:</strong> request a copy of the personal data we hold about you</li>
              <li><strong>Right to rectification:</strong> ask us to correct inaccurate or incomplete data</li>
              <li><strong>Right to erasure:</strong> request deletion of your personal data in certain circumstances</li>
              <li><strong>Right to restrict processing:</strong> ask us to limit how we use your data</li>
              <li><strong>Right to data portability:</strong> receive your data in a structured, machine-readable format</li>
              <li><strong>Right to object:</strong> object to processing based on our legitimate interests</li>
              <li><strong>Right to withdraw consent:</strong> where processing is based on consent, you may withdraw it at any time</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:nareshkumari100@yahoo.com" style={{ color: '#C9A84C' }}>nareshkumari100@yahoo.com</a>. We will respond within one month.
            </p>
            <p>
              If you believe your data has been mishandled, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>ico.org.uk</a>.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against accidental loss, unauthorised access, alteration, or disclosure. All payment data is handled via Stripe's PCI-DSS compliant infrastructure.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>Address:</strong> Naresh Jewellers, 4 High St, Smethwick B66 1DX, United Kingdom</li>
              <li><strong>Email:</strong> <a href="mailto:nareshkumari100@yahoo.com" style={{ color: '#C9A84C' }}>nareshkumari100@yahoo.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:01215586966" style={{ color: '#C9A84C' }}>0121 558 6966</a></li>
            </ul>
          </Section>
        </div>
      </main>
    </>
  );
}
