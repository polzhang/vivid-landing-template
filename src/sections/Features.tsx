import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { Demo } from "../components/Demo";
import { Details } from "../components/Details";
import { GradientText } from "../components/GradientText";
import { Section } from "../components/Section";
import { Title } from "../components/Title";

// Built with Vivid (https://vivid.lol) âš¡ï¸

const FeatureSection = ({
  children,
  grayer,
  right,
  center,
}: {
  children: ReactNode;
  grayer?: boolean;
  right?: boolean;
  center?: boolean;
}) => (
  <Section
    grayer={grayer}
    fullWidth
    className={`col items-center ${
      center ? "" : right ? "md:flex-row-reverse" : "md:flex-row"
    }`}
  >
    {children}
  </Section>
);

const FeatureDemo = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    webmSrc: string;
    mp4Src: string;
    bumpLeft?: boolean;
    center?: boolean;
    className: string;
    alt: string;
  }
) => {
  const { webmSrc, mp4Src, bumpLeft, center, alt, className, ...divProps } =
    props;
  return (
    <div
      {...divProps}
      className={twMerge(
        `w-5/6 md:w-1/2 p-4 md:p-12 bg-gradient-to-br rounded-xl ${
          center ? "" : bumpLeft ? "md:-translate-x-14" : "md:translate-x-14"
        }`,
        className
      )}
    >
      <Demo
        data-aos={`${
          center ? "zoom-y-out" : bumpLeft ? "fade-right" : "fade-left"
        }`}
        data-aos-delay="300"
        webmSrc={webmSrc}
        mp4Src={mp4Src}
        alt={alt}
      />
    </div>
  );
};

const Text = ({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) => (
  <div
    className={`w-5/6 col gap-4 text-center mb-8 mx-auto ${
      center ? "md:w-2/3" : "md:w-2/5 md:text-left md:my-auto"
    }`}
  >
    {children}
  </div>
);

const KeyMessageSection = () => (
  <Section grayer className="gap-8 text-center">
    <div className="max-w-4xl mx-auto">
      <Title size="md">
        <GradientText className="amber-red">Five minutes</GradientText> is all it takes
      </Title>
      <div className="mt-8 p-8 bg-white/50 rounded-xl">
        <Details className="mb-6">
          We are not affiliated with any insurer, we do not profit from your decisions, and we are not paid by any insurance company. 
          We take care of everything and give you smart advice without any upselling or commission-driven pressure. 
          Our goal is to help you do what is best for your needs.
        </Details>
        
        <div className="mb-6">
          <p className="text-lg font-semibold mb-4 text-strong">Whether you:</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="text-medium">Are starting from zero and don't know what "term" or "whole life" means</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <p className="text-medium">Just want help fine-tuning your coverage</p>
            </div>
          </div>
        </div>
        
        <Details>
          We guide you every step of the way from your first click to your perfect policy match.
        </Details>
      </div>
    </div>
  </Section>
);

export const Features = () => {
  return (
    <>
      {/* Key Message Section */}
      <KeyMessageSection />
      
      {/* Feature 1 */}
      <FeatureSection center>
        <Text center>
          <Title size="md">
            <GradientText className="amber-red">
              &quot;Unbiased analysis&quot;
            </GradientText>{" "}
            in seconds.
          </Title>
          <Details>Get objective recommendations with no hidden agendas or commissions.</Details>
        </Text>
        <FeatureDemo
          webmSrc="/videos/palette.webm"
          mp4Src="/videos/palette.mp4"
          center
          className="amber-red"
          alt="A video showing ClearCover's unbiased analysis functionality"
        />
      </FeatureSection>
      
      {/* Feature 2 */}
      <FeatureSection grayer right>
        <Text>
          <Title size="md">
            <GradientText className="pink-blue">Compare</GradientText>
            <br /> with confidence.
          </Title>
          <Details>See clear comparisons between policies and coverage options.</Details>
        </Text>
        <FeatureDemo
          webmSrc="/videos/resize.webm"
          mp4Src="/videos/resize.mp4"
          bumpLeft
          className="pink-blue"
          alt="A video showing ClearCover's policy comparison functionality"
        />
      </FeatureSection>
      
      {/* Feature 3 */}
      <FeatureSection>
        <Text>
          <Title size="md">
            <GradientText className="green-sky">Smart recommendations</GradientText>
            <br /> cut the guesswork.
          </Title>
          <Details>
            ClearCover's AI applies the right analysis every time.
          </Details>
        </Text>
        <FeatureDemo
          webmSrc="/videos/center.webm"
          mp4Src="/videos/center.mp4"
          className="green-sky"
          alt="A video showing ClearCover's smart recommendation functionality"
        />
      </FeatureSection>
    </>
  );
};