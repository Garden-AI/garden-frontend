import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <nav>
      {/* Bottom section/credits */}

      <div className="flex flex-col items-center pt-5 sm:pt-10 px-5">
        <hr className="w-11/12 bg-black" />
      </div>

      {/* Bottom section/credits */}
      <div className="m-10 md:mx-20 md:my-10 md:flex md:columns-2 font-display text-black">
        <div className="flex flex-col">

          <Link to="/home" className="hover:opacity-75">
            <img
              src="img/normalColorIcon_Garden.jpg"
              alt="Garden AI Logo"
              className="max-w-[150px] object-contain mb-6">
            </img>
          </Link>
          <div><Link to="/terms" className="no-underline hover:underline">Terms & Policies</Link></div>
          <a href="https://labs.globus.org/group-website/team.html" className="no-underline hover:underline">Team</a>
          <div className="no-underline">Brand guidelines</div>
        </div>

        <div className="py-10 md:ml-10">
          <p className="text-sm pt-5 sm:text-md">
            Garden is funded by:
          </p>
          <div className="grid grid-rows-1 grid-flow-col gap-1 items-center">
            <section className="">
              <h1 className="font-bold text-sm sm:text-md md:pt-2">
                National Science Foundation
              </h1>
              <p className="text-xs max-w-sm sm:text-sm">
                Award Abstract #2209892: “Frameworks: Garden: A FAIR Framework for
                Publishing and Applying AI Models for Translational Research in
                Science, Engineering, Education, and Industry”
              </p>
            </section>
            <section className="place-self-center">
              <a target="blank" href="https://www.nsf.gov/">
                <img
                  src="img/National-Science-Foundation-logo.jpeg"
                  className="max-w-[60px] hover:opacity-75"
                  alt="NSF logo"
                />
              </a>
            </section>
          </div>

          <div className="flex flex-col items-center pt-5 sm:pt-10 px-5">
            <hr className="w-11/12 bg-black" />
          </div>

          <p className="text-sm pt-8 sm:text-md">
            This project builds upon work including:
          </p>
          <div className="grid grid-rows-3 grid-flow-col gap-1 items-center">
            <section className="">
              <h1 className="font-bold text-sm sm:text-md md:pt-2">
                The Materials Data Facility (MDF)
              </h1>
              <p className="text-xs max-w-sm sm:text-sm">
                NIST-supported effort to build data services to help material scientists publish and discover data

              </p>
            </section>

            <section className="">
              <h1 className="font-bold text-sm sm:text-md md:pt-2">
                Foundry
              </h1>
              <p className="text-xs max-w-sm sm:text-sm">
                An open source machine learning platform for scientists
              </p>
            </section>

            <section className="">
              <h1 className="font-bold text-sm sm:text-md md:pt-2">
                Globus
              </h1>
              <p className="text-xs max-w-sm sm:text-sm">
                Research cyberinfrastructure, developed and operated as a
                not-for-profit service by the University of Chicago
              </p>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://materialsdatafacility.org/">
                <img
                  src="img/MDF-logo.png"
                  alt="MDF logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://foundry-ml.org/#/">
                <img
                  src="img/foundry-logo.png"
                  alt="Foundry logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://www.globus.org/">
                <img
                  src="img/globus-logo.png"
                  alt="Gloubs logo"
                  className="max-w-[100px] hover:opacity-75"
                />
              </a>
            </section>

          </div>
        </div>
      </div>
    </nav >
  );
};

export default Footer;