import { Link } from "react-router-dom";

const STEPS = [
  {
    num: "01",
    title: "Choose a kitchen",
    desc: "Browse curated restaurants near you. Each is vetted for quality, freshness, and craft.",
  },
  {
    num: "02",
    title: "Build your order",
    desc: "Add dishes to your cart, adjust quantities, and review before checkout.",
  },
  {
    num: "03",
    title: "Track in real time",
    desc: "Follow your order from kitchen to doorstep with live, precise updates.",
  },
  {
    num: "04",
    title: "Enjoy your meal",
    desc: "Insulated delivery and trained couriers ensure your food arrives at its best.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <nav className="mb-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link to="/" className="hover:text-[#1e1b1a] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a]">How it works</span>
        </nav>

        <header className="border-b border-[#e8e2db] pb-10 mb-16">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            The experience
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            From craving to{" "}
            <span className="italic font-normal text-[#8b7e72]">doorstep.</span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-md">
            Four steps, zero friction. Here's how ordering works on Feast.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-px bg-[#e8e2db] mb-16">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className="bg-[#faf9f7] p-10 lg:p-12 hover:bg-white transition-colors duration-300"
            >
              <p className="font-serif italic text-[#8b7e72] text-xl mb-6">
                {s.num}
              </p>
              <h2 className="font-serif text-2xl font-medium mb-3 tracking-tight">
                {s.title}
              </h2>
              <p className="text-[#4a423c] font-light leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e8e2db] pt-10 flex flex-wrap gap-4">
          <Link
            to="/restaurants"
            className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.12em] uppercase px-9 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
          >
            Browse restaurants
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center text-xs font-medium tracking-[0.12em] uppercase px-9 py-4 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
