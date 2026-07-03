import React from "react";
import { Link } from "react-router-dom";
import { Sprout, Github, Twitter, ExternalLink } from "lucide-react";

const platformLinks = [
  { name: "Explore", to: "/search" },
  { name: "Use Cases", to: "/use-cases/mlips" },
  { name: "Benchmarks", to: "/benchmarks" },
  { name: "Almanac", href: "https://garden-ai.github.io/almanac/" },
  { name: "Rootstock", href: "https://garden-ai.github.io/rootstock/" },
];

const communityLinks = [
  { name: "Gardens", to: "/search" },
  { name: "GitHub Issues", href: "https://github.com/Garden-AI/garden/issues" },
  { name: "Discussions", href: "https://github.com/Garden-AI/garden/discussions" },
];

const companyLinks = [
  { name: "About", to: "/team" },
  { name: "Team", to: "/team" },
  { name: "Documentation", href: "https://garden-ai.readthedocs.io/en/latest/" },
];

const legalLinks = [
  { name: "Email Support", href: "mailto:support@thegardens.ai" },
  { name: "NSF Award #2209892", href: "https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892" },
];

type FooterLinkItem = { name: string; to?: string; href?: string };

const FooterLinkList = ({ title, links }: { title: string; links: FooterLinkItem[] }) => (
  <div>
    <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest font-inter">
      {title}
    </h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.name}>
          {l.to ? (
            <Link
              to={l.to}
              className="text-slate-400 hover:text-white text-sm transition-colors no-underline font-inter"
            >
              {l.name}
            </Link>
          ) : (
            <a
              href={l.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white text-sm transition-colors no-underline font-inter"
            >
              {l.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const ecosystemPartners = [
  {
    name: "Materials Data Facility",
    shortName: "MDF",
    logo: "img/extern-logos/mdf.png",
    href: "https://materialsdatafacility.org/",
    description: "Data publishing and discovery for materials science.",
  },
  {
    name: "Foundry",
    shortName: "Foundry",
    logo: "img/extern-logos/foundry.png",
    href: "https://foundry-ml.org/",
    description: "Open, accessible ML datasets and models for science.",
  },
  {
    name: "National Science Foundation",
    shortName: "NSF",
    logo: "img/extern-logos/nsf.jpeg",
    href: "https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892",
    description: "Supported by NSF Award #2209892.",
  },
];

const Footer = () => {
  return (
    <footer className="bg-darkSlate text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top grid: logo col + link cols */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 no-underline">
              <Sprout className="text-teal" size={22} />
              <span className="text-white text-lg font-bold font-grotesk">garden</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 font-inter leading-relaxed max-w-[180px]">
              An open platform for scientific AI models.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Garden-AI"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com/thegardens_ai"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <FooterLinkList title="Platform" links={platformLinks} />
          <FooterLinkList title="Community" links={communityLinks} />
          <FooterLinkList title="Company" links={companyLinks} />
          <FooterLinkList title="Legal" links={legalLinks} />
        </div>

        {/* Ecosystem Partners */}
        <div className="mt-12 pt-10 border-t border-slate-800">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-inter font-semibold mb-5">
            Part of the ecosystem
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ecosystemPartners.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-600 p-4 transition-all no-underline"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={p.logo}
                    alt={p.shortName}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-semibold font-inter group-hover:text-teal transition-colors">
                      {p.shortName}
                    </span>
                    <ExternalLink size={11} className="text-slate-500 group-hover:text-teal transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-slate-400 text-xs font-inter mt-0.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-inter">
            © 2026 Garden AI · The University of Chicago
          </p>
          <p className="text-xs text-slate-500 font-inter">
            Made possible by{" "}
            <a
              href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors no-underline"
            >
              NSF Award #2209892
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
