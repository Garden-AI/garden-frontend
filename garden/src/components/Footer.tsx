import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <nav>
      {/* Bottom section/credits */}

      <div className="flex flex-col items-center px-5 pt-5 sm:pt-10">
        <hr className="w-11/12 bg-black" />
      </div>

      {/* Bottom section/credits */}
      <div className="m-10 font-display text-black md:mx-20 md:my-10 md:flex md:columns-2">
        <div className="flex flex-col">
          <Link to="/home" className="hover:opacity-75">
            <img
              src="img/normalColorIcon_Garden.jpg"
              alt="Garden AI Logo"
              className="mb-6 max-w-[150px] object-contain"
            ></img>
          </Link>
          <div>
            <Link to="/terms" className="no-underline hover:underline">
              Terms & Policies
            </Link>
          </div>
          <Link to="/team" className="no-underline hover:underline">
            Team
          </Link>
          <div className="no-underline">Brand guidelines</div>
        </div>

        <div className="py-10 md:ml-10">
          <p className="sm:text-md pt-5 text-sm">Garden is made possible by:</p>
          <div className="grid grid-flow-col grid-rows-1 items-center gap-1">
            <section className="">
              <h1 className="sm:text-md text-sm font-bold md:pt-2">The National Science Foundation</h1>
              <p className="max-w-sm text-xs sm:text-sm">
                Award Abstract #2209892: “Frameworks: Garden: A FAIR Framework for Publishing and Applying AI Models for
                Translational Research in Science, Engineering, Education, and Industry”
              </p>
            </section>
            <section className="place-self-center">
              <a target="blank" href="https://www.nsf.gov/">
                <div className="grayscale">
                  <img
                    src="img/National-Science-Foundation-logo.jpeg"
                    className="max-w-[60px] hover:opacity-75"
                    alt="NSF logo"
                  />
                </div>
              </a>
            </section>
          </div>

          <div className="flex flex-col items-center px-5 pt-5 sm:pt-10">
            <hr className="w-11/12 bg-black" />
          </div>

          <p className="sm:text-md pt-8 text-sm">This project builds upon work including:</p>
          <div className="grid grid-flow-col grid-rows-3 items-center gap-1">
            <section className="">
              <h1 className="sm:text-md text-sm font-bold md:pt-2">The Materials Data Facility (MDF)</h1>
              <p className="max-w-sm text-xs sm:text-sm">
                NIST-supported effort to build data services to help material scientists publish and discover data.
              </p>
            </section>

            <section className="">
              <h1 className="sm:text-md text-sm font-bold md:pt-2">Foundry-ML</h1>
              <p className="max-w-sm text-xs sm:text-sm">An open source ML-ready data access tool for scientists.</p>
            </section>

            <section className="">
              <h1 className="sm:text-md text-sm font-bold md:pt-2">Globus</h1>
              <p className="max-w-sm text-xs sm:text-sm">
                Research cyberinfrastructure, developed and operated as a not-for-profit service by the University of
                Chicago to enable research data transfer, sharing, access, discovery, and automation.
              </p>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://materialsdatafacility.org/">
                <div className="grayscale">
                  <img src="img/MDF-logo.png" alt="MDF logo" className="max-w-[150px] hover:opacity-75" />
                </div>
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://foundry-ml.org/#/">
                <div className="grayscale">
                  <img src="img/foundry-logo.png" alt="Foundry logo" className="max-w-[150px] hover:opacity-75" />
                </div>
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://www.globus.org/">
                <div className="grayscale">
                  <img src="img/globus-logo.png" alt="Gloubs logo" className="max-w-[100px] hover:opacity-75" />
                </div>
              </a>
            </section>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
