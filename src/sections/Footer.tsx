import Image from "next/image";
import { LinkButton } from "../components/LinkButton";

// Built with Vivid (https://vivid.lol) ⚡️

export const Footer = () => {
  return (
    <footer className="bg-extra-strong">
      <div className="items-center justify-between px-10 py-4 mx-auto sm:px-6 row max-w-7xl">
        <div className="items-center gap-4 row">
          <Image
            src="/images/logo.png"
            alt="ClearCover Logo"
            height="40"
            width="40"
          />
          <div className="text-sm text-light">&copy; ClearCover, Inc. 2025</div>
        </div>
        
        <LinkButton
          href="https://www.linkedin.com/in/jun-wei-ng-2b06b6251/?originalSubdomain=sg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Jun Wei Ng LinkedIn Profile"
        >
          Contact
        </LinkButton>
      </div>
    </footer>
  );
};