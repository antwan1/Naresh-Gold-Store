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

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions — Naresh Jewellers</title>
        <meta name="description" content="Terms and Conditions for Naresh Jewellers. Please read before purchasing from our online jewellery store." />
      </Helmet>
      <main className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1
              className="text-3xl sm:text-4xl font-normal mb-3"
              style={{ color: '#1A1F3A', fontFamily: 'var(--font-heading)' }}
            >
              Terms &amp; Conditions
            </h1>
            <div className="w-16 h-0.5 mx-auto mb-4" style={{ backgroundColor: '#C9A84C' }} />
            <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-body)' }}>
              Last updated: January 2025
            </p>
          </div>

          <div className="mb-8 p-4 rounded-lg text-sm" style={{ backgroundColor: '#FFFBF0', border: '1px solid #E8D5A3', color: '#4B5563', fontFamily: 'var(--font-body)' }}>
            Please read these Terms &amp; Conditions carefully before placing an order or using our website. By purchasing from Naresh Jewellers, you agree to be bound by these terms.
          </div>

          <Section title="About Us">
            <p>
              Naresh Jewellers is a jewellery retailer operating from 4 High St, Smethwick B66 1DX, United Kingdom. You can contact us at{' '}
              <a href="mailto:nareshkumari100@yahoo.com" style={{ color: '#C9A84C' }}>nareshkumari100@yahoo.com</a>{' '}
              or by phone on <a href="tel:01215586966" style={{ color: '#C9A84C' }}>0121 558 6966</a>.
            </p>
          </Section>

          <Section title="Products &amp; Pricing">
            <p>
              All prices displayed on our website are in pounds sterling (GBP) and include VAT at the applicable rate. Prices are subject to change without notice. In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.
            </p>
            <p>
              Gold and precious metal jewellery prices may reflect live spot prices and can fluctuate. Where a price is shown as "Price on Request", please contact us directly for a quotation.
            </p>
            <p>
              Product images are for illustrative purposes only. Actual items may vary slightly in colour, texture, or size due to the handcrafted nature of our jewellery and differences in screen calibration.
            </p>
            <p>
              All weights, purity, and dimensions are approximate and provided in good faith.
            </p>
          </Section>

          <Section title="Orders &amp; Payment">
            <p>
              Placing an order on our website constitutes an offer to purchase. We reserve the right to accept or decline any order. Your order is confirmed when you receive an email confirmation from us.
            </p>
            <p>
              We accept payment via Stripe's secure payment platform, which supports major credit and debit cards. Payment is taken at the time of order. We do not store your card details.
            </p>
            <p>
              For bespoke and custom orders, a deposit may be required before work commences. Deposit amounts and terms will be agreed in writing before any work begins.
            </p>
          </Section>

          <Section title="Returns &amp; Refunds">
            <p>
              Under the Consumer Contracts Regulations 2013, you have a <strong>14-day right to cancel</strong> your order from the day you receive the goods, without giving a reason.
            </p>
            <p>
              To exercise your right to cancel, please contact us at{' '}
              <a href="mailto:nareshkumari100@yahoo.com" style={{ color: '#C9A84C' }}>nareshkumari100@yahoo.com</a>{' '}
              within 14 days of receipt. You must return the item(s) to us within 14 days of notifying us of your cancellation.
            </p>
            <p>
              Items must be returned in their original, unworn condition with all original packaging, tags, and certificates. We reserve the right to refuse a return or deduct the cost of any damage from the refund.
            </p>
            <p>
              Refunds will be issued to the original payment method within 14 days of receiving the returned goods. We will not refund original postage costs unless the item is faulty or we made an error.
            </p>
            <p>
              The following items are <strong>excluded from the right to return</strong> unless faulty:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Bespoke or personalised items made to your specification</li>
              <li>Earrings (for hygiene reasons, once unwrapped)</li>
              <li>Items that have been engraved or resized at your request</li>
            </ul>
            <p>
              If you receive a faulty or incorrect item, please contact us within 48 hours of receipt and we will arrange a replacement or full refund at no cost to you.
            </p>
          </Section>

          <Section title="Delivery">
            <p>
              We aim to dispatch in-stock items within 2–5 working days. Delivery timescales are estimates only and we cannot be held responsible for delays caused by couriers or circumstances beyond our control.
            </p>
            <p>
              Risk in the goods passes to you upon delivery. Title passes to you upon receipt of full payment.
            </p>
            <p>
              We currently deliver within the United Kingdom. For international enquiries, please contact us directly.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              All content on this website — including but not limited to images, text, logos, and design — is the property of Naresh Jewellers and is protected by copyright. You may not reproduce, distribute, or use any content without our prior written permission.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Naresh Jewellers shall not be liable for any indirect, incidental, or consequential loss arising from the use of our website or products. Our total liability for any claim shall not exceed the amount paid by you for the relevant goods.
            </p>
            <p>
              Nothing in these terms limits our liability for death or personal injury caused by negligence, or for fraud or fraudulent misrepresentation.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </Section>

          <Section title="Changes to These Terms">
            <p>
              We reserve the right to update these Terms &amp; Conditions at any time. Changes will be posted on this page with an updated date. Continued use of our website or services after changes are posted constitutes your acceptance of the revised terms.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>If you have any questions about these Terms &amp; Conditions, please contact us:</p>
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
