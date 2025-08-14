import { NewsletterSpheres } from "../svg/NewsletterSpheres";
import { Card } from "../components/Card";
import { Section } from "../components/Section";
import { WaitlistForm } from "../components/WaitlistForm";

// Built with Vivid (https://vivid.lol) âš¡ï¸

const Background = () => (
  <div
    className="absolute bottom-0 right-0 hidden pointer-events-none md:block"
    aria-hidden="true"
  >
    <NewsletterSpheres />
  </div>
);

export const Newsletter = () => {
  return (
    <Section className="px-4 dark sm:px-12">
      <Card className="w-full px-4 py-16 overflow-hidden sm:px-16">
        <Background />
        <div className="gap-6 text-center md:text-left col md:w-1/2 ">
          <h2 className="text-3xl font-bold text-gray-100">
            Ready to find your perfect policy?
          </h2>
          <p className="text-lg text-light">
            Join thousands who&apos;ve found better coverage in just 5 minutes. 
            Get started today with our free evaluation.
          </p>
          <WaitlistForm id="newsletter-waitlist" />
        </div>
      </Card>
    </Section>
  );
};