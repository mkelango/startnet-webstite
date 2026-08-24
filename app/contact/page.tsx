import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import FadeUp from "@/components/motion/FadeUp";
import ContactForm from "./ContactForm";
import { contactContent, contactMeta } from "@/lib/content/contact";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        lines={[contactContent.hero]}
        subhead={contactContent.subhead}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-16 px-6 md:grid-cols-[1.4fr_1fr] md:px-10">
          <FadeUp>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="glass rounded-2xl p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
                Already know where to go?
              </p>
              <ul className="mt-5 space-y-5">
                {contactContent.directRoutes.map((route) => (
                  <li key={route.href}>
                    <a
                      href={route.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between text-[0.95rem] text-ink"
                    >
                      <span>{route.label}</span>
                      <span className="text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-accent">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
