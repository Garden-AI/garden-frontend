import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <>
      <div className="mt-28 flex flex-col items-center pb-64">
        <h1 className="pb-10 text-xl font-semibold sm:text-3xl lg:text-4xl">
          This page is under construction!
        </h1>

        <p className="text-md mx-12 text-center sm:text-lg">
          This page is still growing! Come back another time when this page is
          fully sprouted!
        </p>

        <div className="px-5 pt-5 font-display sm:pt-10">
          <Link
            to="/"
            className="mt-12 flex h-[48px] w-36 items-center justify-center rounded-xl bg-green text-center text-white hover:saturate-150"
          >
            Send Me Back
          </Link>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
