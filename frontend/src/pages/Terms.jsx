import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "Using the service",
    body: "By creating an account you agree to provide accurate information, keep your credentials secure, and use the service only for lawful purposes.",
  },
  {
    title: "Orders and payments",
    body: "All orders are subject to acceptance by the restaurant. Prices, availability, and delivery estimates are set by each kitchen and may change without notice.",
  },
  {
    title: "Cancellations and refunds",
    body: "Orders may be cancelled before preparation begins. Once a restaurant has begun preparing an order, cancellation may not be possible. Refunds are handled on a case-by-case basis.",
  },
  {
    title: "Vendor responsibilities",
    body: "Restaurants listing on the platform are independent businesses responsible for food safety, licensing, and the accuracy of their menu information.",
  },
  {
    title: "Delivery partners",
    body: "Delivery is performed by independent couriers. Delivery times are estimates, not guarantees, and may vary due to weather, traffic, or order volume.",
  },
  {
    title: "Limitation of liability",
    body: "The service is provided as-is. To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from use of the service.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised terms.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <nav className="mb-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link to="/" className="hover:text-[#1e1b1a] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a]">Terms</span>
        </nav>

        <header className="border-b border-[#e8e2db] pb-10 mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            Terms of{" "}
            <span className="italic font-normal text-[#8b7e72]">service.</span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light">
            Last updated: November 2026
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
