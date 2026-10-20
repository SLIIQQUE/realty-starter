import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";

export default function NotFound() {
  return (
    <main>
      <section className="nf">
        <div className="container">
          <Reveal as="p" className="nf__code">
            404
          </Reveal>
          <SplitHeading as="h2">
            A page that <em>isn&apos;t here.</em>
          </SplitHeading>
          <Reveal as="p">The page you were looking for has been moved or no longer exists.</Reveal>
          <RollButton href="/" variant="forest">
            Back to home
          </RollButton>
        </div>
      </section>
    </main>
  );
}
