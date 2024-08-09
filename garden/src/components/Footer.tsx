import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <nav className="m-8 font-display text-black sm:mx-12 md:mx-20 lg:mx-24">
      {/* logo */}
      <Link to="/" className="flex py-10 hover:opacity-75">
        <img
          src="img/normalColorIcon_Garden.jpg"
          alt="Garden AI Logo"
          className="w-40 object-contain"
        ></img>
      </Link>

      {/* links */}
      <div className="flex columns-2">
        <div className="mr-8 md:mr-16">
          <p className="font-bold uppercase text-gray-600">Made Possible By:</p>
          <section className="">
            <h1 className="sm:text-md pt-4 text-sm font-bold">
              The National Science Foundation
            </h1>
            <p className="max-w-sm text-xs sm:text-sm">
              Award Abstract #2209892: “Frameworks: Garden: A FAIR Framework for
              Publishing and Applying AI Models for Translational Research in
              Science, Engineering, Education, and Industry”
            </p>
          </section>
        </div>
        <div className="mr-8 md:mr-16">
          <p className="font-bold uppercase text-gray-600">About</p>
          <div>
            <Link to="/terms" className="no-underline hover:underline">
              Terms
            </Link>
          </div>
          <div>
            <Link to="/team" className="no-underline hover:underline">
              Team
            </Link>
          </div>
        </div>
        <div>
          <p className="font-bold uppercase text-gray-600">Contact</p>
          <p>
            <a
              target="blank"
              href="https://github.com/Garden-AI/garden/issues"
              className="no-underline hover:underline"
            >
              Github
            </a>
          </p>
          <p>
            <a
              target="blank"
              href="mailto:thegardens@uchicago.edu"
              className="no-underline hover:underline"
            >
              Email Us!
            </a>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center px-5 pt-5 sm:pt-10 ">
        <hr className="w-11/12 bg-black" />
      </div>
      {/* credits */}
      <div className="max-w-2xl py-10">
        <p className="font-bold uppercase text-gray-600">
          This project builds upon work including:
        </p>
        <div className="grid grid-flow-col grid-rows-3 items-center gap-1">
          <section className="">
            <h1 className="sm:text-md text-sm font-bold md:pt-2">
              The Materials Data Facility (MDF)
            </h1>
            <p className="max-w-sm text-xs sm:text-sm">
              NIST-supported effort to build data services to help material
              scientists publish and discover data.
            </p>
          </section>

          <section className="">
            <h1 className="sm:text-md text-sm font-bold md:pt-2">Foundry-ML</h1>
            <p className="max-w-sm text-xs sm:text-sm">
              An open source ML-ready data access tool for scientists.
            </p>
          </section>

          <section className="">
            <h1 className="sm:text-md text-sm font-bold md:pt-2">Globus</h1>
            <p className="max-w-sm text-xs sm:text-sm">
              Research cyberinfrastructure, developed and operated as a
              not-for-profit service by the University of Chicago to enable
              research data transfer, sharing, access, discovery, and
              automation.
            </p>
          </section>

          <section className="place-self-center">
            <a target="blank" href="https://materialsdatafacility.org/">
              <div className="grayscale">
                <img
                  src="img/MDF-logo.png"
                  alt="MDF logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </div>
            </a>
          </section>

          <section className="place-self-center">
            <a target="blank" href="https://foundry-ml.org/#/">
              <div className="grayscale">
                <img
                  src="img/foundry-logo.png"
                  alt="Foundry logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </div>
            </a>
          </section>

          <section className="place-self-center">
            <a target="blank" href="https://www.globus.org/">
              <div className="grayscale">
                <img
                  src="img/globus-logo.png"
                  alt="Gloubs logo"
                  className="max-w-[100px] hover:opacity-75"
                />
              </div>
            </a>
          </section>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
