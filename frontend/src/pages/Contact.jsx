// src/pages/Contact.jsx
import { Link } from "react-router-dom";

const CONTACT_EMAIL = "chirantanjana43@gmail.com";
const CONTACT_PHONE = "6294505905";
const ADDRESS_LINE = "Rajbalhat,Hooghly,Westbengal,India";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <nav className="mb-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link to="/" className="hover:text-[#1e1b1a] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a]">Contact</span>
        </nav>

        <header className="border-b border-[#e8e2db] pb-10 mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Get in touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            We'd love to{" "}
            <span className="italic font-normal text-[#8b7e72]">
              hear from you.
            </span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-md">
            Questions, partnerships, or feedback — reach out anytime.
          </p>
        </header>

        <section className="grid sm:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#b8a99c] mb-2">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-serif text-xl text-[#1e1b1a] hover:text-[#8b7e72] transition-colors break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#b8a99c] mb-2">
              Phone
            </p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
              className="font-serif text-xl text-[#1e1b1a] hover:text-[#8b7e72] transition-colors"
            >
              {CONTACT_PHONE}
            </a>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#b8a99c] mb-2">
              Address
            </p>
            <p className="font-serif text-xl text-[#1e1b1a] leading-snug">
              {ADDRESS_LINE}
            </p>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#b8a99c] mb-2">
              Hours
            </p>
            <p className="text-sm text-[#4a423c] font-light">
              Mon–Sun · 10:00 – 23:00
            </p>
          </div>
        </section>

        <div className="border-t border-[#e8e2db] pt-8">
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
