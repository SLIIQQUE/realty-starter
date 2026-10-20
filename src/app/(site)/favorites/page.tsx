import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import FavoritesList from "./FavoritesList";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Saved Properties";
const DESCRIPTION = "Properties you've saved, stored in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/favorites"),
  robots: { index: false, follow: true },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/favorites" }),
};

export default function FavoritesPage() {
  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Saved for later
            </Reveal>
            <SplitHeading as="h1">Your saved properties.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 560 }}>
              Saved in this browser only: no account needed, nothing sent to a server.
            </Reveal>
          </div>
          <FavoritesList />
        </div>
      </section>
    </main>
  );
}
