import React from 'react'
import { Link } from "react-router-dom";


const TermsPage = () => {
  return (
    <>
      <div className='flex flex-col items-center mt-28 pb-64'>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold pb-10">
          This page is under construction!
        </h1>

        <p className="text-md mx-12 text-center sm:text-lg">
          This page is still growing! Come back another time when this page is fully sprouted!
        </p>

        <div className="font-display pt-5 sm:pt-10 px-5">
          <Link
            to="/home"
            className="mt-12 bg-green w-36 h-[48px] rounded-xl text-white text-center flex justify-center items-center hover:saturate-150"
          >
            Send Me Back
          </Link>
        </div>
      </div>
    </>
  )
}

export default TermsPage