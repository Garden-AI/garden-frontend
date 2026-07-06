import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, Github } from "lucide-react";

const platformLinks = [
  { name: "Explore", to: "/search" },
  { name: "Documentation", href: "https://garden-ai.readthedocs.io/en/latest/" },
  { name: "Almanac", href: "https://garden-ai.github.io/almanac/" },
  { name: "Rootstock", href: "https://garden-ai.github.io/rootstock/" },
];

const communityLinks = [
  { name: "Gardens", to: "/search" },
  { name: "GitHub Issues", href: "https://github.com/Garden-AI/garden/issues" },
  { name: "Email Support", href: "mailto:support@thegardens.ai" },
];

const teamLinks = [{ name: "About", to: "/team" }];

type FooterLinkItem = { name: string; to?: string; href?: string };

const FooterLinkList = ({ title, links }: { title: string; links: FooterLinkItem[] }) => (
  <div>
    <h4 className="mb-4 font-inter text-xs font-semibold uppercase tracking-widest text-white">
      {title}
    </h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.name}>
          {l.to ? (
            <Link
              to={l.to}
              className="font-inter text-sm text-slate-400 no-underline transition-colors hover:text-white"
            >
              {l.name}
            </Link>
          ) : (
            <a
              href={l.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="font-inter text-sm text-slate-400 no-underline transition-colors hover:text-white"
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
    name: "Garden",
    to: "/",
  },
  {
    name: "Materials Data Facility",
    href: "https://materialsdatafacility.org/",
  },
  {
    name: "Foundry",
    href: "https://foundry-ml.org/",
  },
  {
    name: "National Science Foundation",
    href: "https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892",
  },
];

const Footer = () => {
  return (
    <footer className="bg-darkSlate text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top grid: logo col + link cols */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-3 flex items-center gap-2 no-underline">
              <Sprout className="text-teal" size={22} />
              <span className="font-grotesk text-lg font-bold text-white">garden</span>
            </Link>
            <p className="mb-6 max-w-[180px] font-inter text-sm leading-relaxed text-slate-400">
              An open platform for scientific AI models.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Garden-AI"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <FooterLinkList title="Platform" links={platformLinks} />
          <FooterLinkList title="Community" links={communityLinks} />
          <FooterLinkList title="Team" links={teamLinks} />
        </div>

        {/* Ecosystem Partners */}
        <div className="mt-12 border-t border-slate-800 pt-10">
          <p className="mb-5 font-inter text-xs font-semibold uppercase tracking-widest text-slate-500">
            Part of the ecosystem
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {ecosystemPartners.map((p) =>
              p.to ? (
                <Link
                  key={p.name}
                  to={p.to}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 no-underline transition-colors hover:text-white"
                >
                  {p.name}
                  <ArrowRight
                    size={13}
                    className="text-slate-500 transition-colors group-hover:text-teal"
                  />
                </Link>
              ) : (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 no-underline transition-colors hover:text-white"
                >
                  {p.name}
                  <ArrowRight
                    size={13}
                    className="text-slate-500 transition-colors group-hover:text-teal"
                  />
                </a>
              ),
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 md:flex-row">
          <p className="font-inter text-xs text-slate-500">
            © 2026 Garden AI · The University of Chicago
          </p>
          <p className="max-w-2xl font-inter text-xs leading-relaxed text-slate-500 md:text-right">
            This material is based upon work supported by the National Science Foundation under
            Grant Number{" "}
            <a
              href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 no-underline transition-colors hover:text-white"
            >
              2209892
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
