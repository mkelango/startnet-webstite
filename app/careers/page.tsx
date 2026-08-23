import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CareersList from "./CareersList";
import { careersMeta } from "@/lib/content/careers";

export const metadata: Metadata = {
  title: careersMeta.title,
  description: careersMeta.description,
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        lines={["Build the infrastructure,", "not just a product."]}
        subhead="Openings across every part of the StartNet ecosystem, listed in one place."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <CareersList />
        </div>
      </section>
    </>
  );
}
