import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect information you provide directly — name, email, phone number, delivery address — and information generated when you use the service, such as order history and device data.",
  },
  {
    title: "How we use it",
    body: "To process orders, coordinate delivery with couriers, improve the service, and communicate order updates. We never sell your personal data.",
  },
  {
    title: "Sharing with kitchens",
    body: "Restaurants receive only the details necessary to prepare and fulfil your order — your name, items, and delivery instructions. They do not receive your payment details.",
  },
  {
    title: "Data retention",
    body: "Order records are retained for accounting and support purposes. You can request deletion of your account and personal data at any time by contacting us.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies for authentication and a small number of analytics cookies to understand how the service is used. You can disable analytics via your browser settings.",
  },
  {
    title: "Your rights",
    body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below and we will respond within 30 days.",
  },
];

const CONTACT_EMAIL = "chirantanjana43@gmail.com";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <nav className="mb-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link to="/" className="hover:text-[#1e1b1a] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a]">Privacy</span>
        </nav>

        <header className="border-b border-[#e8e2db] pb-10 mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            Privacy{" "}
            <span className="italic font-normal text-[#8b7e72]">policy.</span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light">
            Last updated: January 2026
          </p>
        </header>

        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-serif italic text-[#8b7e72] text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-2xl tracking-tight">
                  {s.title}
                </h2>
              </div>
              <p className="text-[#4a423c] font-light leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}

          <section>
            <div className="flex items-baseline gap-4 mb-3">
              <span className="font-serif italic text-[#8b7e72] text-lg">
                07
              </span>
              <h2 className="font-serif text-2xl tracking-tight">Contact</h2>
            </div>
            <p className="text-[#4a423c] font-light leading-relaxed mb-3">
              Questions about this policy can be sent to:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-serif text-lg text-[#1e1b1a] hover:text-[#8b7e72] transition-colors break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </section>
        </div>

        <div className="border-t border-[#e8e2db] mt-16 pt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
