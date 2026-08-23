import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NewsroomList from "./NewsroomList";
import { newsroomMeta } from "@/lib/content/newsroom";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: newsroomMeta.title,
  description: newsroomMeta.description,
};

export default function NewsroomPage() {
  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        lines={["One newsroom.", "Every property."]}
        subhead="Announcements, results, and press coverage from across the StartNet ecosystem — filter by property or browse everything."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <NewsroomList />

          <div className="mt-16 border-t border-paper-line pt-10">
            <p className="text-[0.95rem] text-ink-soft">
              For interviews, data requests, or media partnerships:{" "}
              <a
                href={`mailto:${site.pressEmail}`}
                className="font-medium text-ink underline underline-offset-4 hover:text-accent"
              >
                {site.pressEmail}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
