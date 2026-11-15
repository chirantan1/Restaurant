import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[#faf9f7] text-[#1e1b1a]">
      {/* Subtle grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* ===== HERO ===== */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 lg:py-24">
          <div className="max-w-xl">
            <span className="inline-block text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] bg-[#f0ece7] px-4 py-1.5 mb-7">
              Now delivering in your area
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-6">
              Order your favorite
              <br />
              <span className="italic font-normal text-[#8b7e72]">
                food,
              </span>{" "}
              delivered fresh.
            </h1>

            <p className="text-lg text-[#4a423c] font-light leading-relaxed max-w-md mb-10">
              Curated restaurants, seasonal ingredients, and lightning-fast
              delivery. Because great taste shouldn't wait.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                to="/restaurants"
                className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.12em] uppercase px-9 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
              >
                Browse Restaurants
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center text-xs font-medium tracking-[0.12em] uppercase px-9 py-4 border border-[#d9d2cb] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.02] transition-all duration-200"
              >
                How it works
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 flex-wrap">
              <div>
                <p className="font-serif text-2xl font-medium leading-none">
                  30<span className="text-[#8b7e72]">min</span>
                </p>
                <p className="text-xs text-[#8b7e72] tracking-wide uppercase mt-1">
                  Average delivery
                </p>
              </div>
              <div className="w-px h-10 bg-[#e8e2db]" />
              <div>
                <p className="font-serif text-2xl font-medium leading-none">
                  4.9<span className="text-[#8b7e72]">/5</span>
                </p>
                <p className="text-xs text-[#8b7e72] tracking-wide uppercase mt-1">
                  From 12k reviews
                </p>
              </div>
              <div className="w-px h-10 bg-[#e8e2db]" />
              <div>
                <p className="font-serif text-2xl font-medium leading-none">
                  200<span className="text-[#8b7e72]">+</span>
                </p>
                <p className="text-xs text-[#8b7e72] tracking-wide uppercase mt-1">
                  Local kitchens
                </p>
              </div>
            </div>
          </div>

          {/* Abstract food plate composition — pure CSS, no emoji */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-[460px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-[#f5f1ec] shadow-[inset_0_0_0_2px_#fff,inset_0_0_0_3px_#e8e2db,0_30px_40px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="absolute inset-[12%] rounded-full border border-white/90 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.02)]" />

                {/* Food shapes */}
                <div className="absolute top-[18%] left-[18%] w-[45%] h-[45%] bg-[radial-gradient(circle_at_35%_35%,#c49a6c,#8b5e3c)] rounded-[60%_40%_50%_50%/45%_55%_45%_55%] shadow-md" />
                <div className="absolute bottom-[18%] right-[18%] w-[32%] h-[32%] bg-[radial-gradient(circle_at_30%_30%,#b8d9b0,#6e9e5e)] rounded-[40%_60%_50%_50%/55%_45%_60%_40%] shadow" />
                <div className="absolute top-[30%] right-[20%] w-[22%] h-[22%] bg-[radial-gradient(circle_at_40%_30%,#f3d9a4,#d4a843)] rounded-full shadow-sm" />
                <div className="absolute bottom-[28%] left-[22%] w-[18%] h-[18%] bg-[#b03e2e] opacity-80 rounded-[50%_40%_60%_40%/40%_60%_40%_60%] shadow-sm" />
                <div className="absolute top-[55%] left-[40%] w-[14%] h-[14%] bg-[#6c8b4b] opacity-90 rounded-[60%_40%_30%_70%/50%_50%_50%_50%]" />
                <div className="absolute top-[15%] right-[25%] w-2 h-2 rounded-full bg-[#d9d2cb]" />
                <div className="absolute bottom-[18%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#b8a99c]" />
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-2 -left-4 bg-white px-6 py-5 shadow-[0_20px_30px_-15px_rgba(0,0,0,0.15)] border-l-[3px] border-[#1e1b1a] max-w-[210px]">
                <p className="text-[0.7rem] uppercase tracking-[0.1em] text-[#8b7e72] font-medium mb-1">
                  This week
                </p>
                <p className="font-serif text-3xl font-medium leading-tight">
                  2,400+
                </p>
                <p className="text-sm text-[#4a423c] font-light">
                  orders delivered
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST BAR ===== */}
        <section className="border-y border-[#e8e2db] py-8 flex flex-wrap items-center justify-between gap-6">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[#8b7e72]">
            Trusted by diners at
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-4 items-center">
            {[
              "The Times",
              "Bon Appétit",
              "Eater",
              "Food & Wine",
              "Condé Nast",
            ].map((name) => (
              <span
                key={name}
                className="font-serif italic text-lg text-[#4a423c]"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ===== FEATURES / HOW IT WORKS ===== */}
        <section className="py-20 lg:py-28">
          <div className="mb-16 max-w-2xl">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
              The Feast experience
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
              Thoughtfully built for{" "}
              <span className="italic text-[#8b7e72]">good taste.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[#e8e2db]">
            {[
              {
                num: "01",
                title: "Curated kitchens",
                desc: "Every restaurant is vetted by our culinary team for quality, freshness, and craft.",
              },
              {
                num: "02",
                title: "Real-time tracking",
                desc: "Follow your order from kitchen to doorstep with live, precise updates.",
              },
              {
                num: "03",
                title: "Freshness guaranteed",
                desc: "Insulated delivery and trained couriers ensure your food arrives at its best.",
              },
            ].map((f) => (
              <div
                key={f.num}
                className="bg-[#faf9f7] p-10 lg:p-12 hover:bg-white transition-colors duration-300"
              >
                <p className="font-serif italic text-[#8b7e72] text-xl mb-6">
                  {f.num}
                </p>
                <h3 className="font-serif text-2xl font-medium mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-[#4a423c] font-light leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section className="pb-20 lg:pb-28">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
                Explore
              </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
                What are you craving?
              </h2>
            </div>
            <Link
              to="/restaurants"
              className="text-xs font-medium tracking-[0.12em] uppercase border-b border-[#1e1b1a] pb-1 hover:opacity-60 transition-opacity"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Fine Dining", count: "48 kitchens", tint: "#e8ded3" },
              { name: "Street Food", count: "72 kitchens", tint: "#dfe6d5" },
              { name: "Bakery", count: "31 kitchens", tint: "#f0e2d6" },
              { name: "Plant-Based", count: "39 kitchens", tint: "#dde6dd" },
            ].map((cat) => (
              <Link
                key={cat.name}
                to="/restaurants"
                className="group relative aspect-[4/5] overflow-hidden border border-[#e8e2db] p-6 flex flex-col justify-end"
                style={{ backgroundColor: cat.tint }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/[0.03]" />
                <div className="relative">
                  <h3 className="font-serif text-xl md:text-2xl font-medium tracking-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#6b625a] tracking-wide uppercase">
                    {cat.count}
                  </p>
                </div>
                <span className="absolute top-6 right-6 text-[#1e1b1a] text-lg font-light group-hover:translate-x-1 transition-transform duration-300">
                  &#8599;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="border-t border-[#e8e2db] py-20 lg:py-28 text-center">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-6">
            Ready when you are
          </p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight max-w-3xl mx-auto mb-10">
            Your next great meal is{" "}
            <span className="italic text-[#8b7e72]">a few taps away.</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.12em] uppercase px-10 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
            >
              Browse Restaurants
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center text-xs font-medium tracking-[0.12em] uppercase px-10 py-4 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200"
            >
              Create an account
            </Link>
          </div>
        </section>

        {/* ===== FOOTER STRIP ===== */}
        <footer className="border-t border-[#e8e2db] py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8b7e72] tracking-wide uppercase">
          <span>© 2026 Feast — All rights reserved</span>
          <div className="flex gap-8">
            <Link
              to="/privacy"
              className="hover:text-[#1e1b1a] transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-[#1e1b1a] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#1e1b1a] transition-colors"
            >
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
