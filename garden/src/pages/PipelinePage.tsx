import React from 'react';
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar';

const PipelinePage = () => {
    const { uuid } = useParams();
    const fakeData = {
        uuid: "a5f9f612-28ee-4ba7-a104-dc8a70613ea2",
        name: "Crystal Structure Predictor",
        doi: "10.3792.1234",
        funcxID: "abcdefg",
        description: "This is a pipeline for predicting crystal structure!",
        authors: ["KJ Schmidt, Ben B"],
        repository: "https://github.com/",
        steps: ["pre-process", "predict"],
        version: "0.0.1",
        year: 2023,
        tags: ["fun", "cool", "pipeline"]
    };

    return (
        <>
            <Navbar />
            <div className='h-full w-full flex flex-col gap-10 px-36 py-24'>
                {/* Place breadcrumbs here */}

                {/* Pipeline Header */}
                <div className='flex gap-8'>
                    <h1 className='text-3xl font-serif'>{fakeData.name}</h1>
                    <div className='flex gap-3 items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </div>
                </div>

                {/* Pipeline Overview */}
                <div className='border-0 rounded-lg bg-gray-100 flex flex-col gap-5 p-4 text-sm text-gray-700'>
                    <div>
                        <h2 className='font-semibold'>Contributors</h2>
                        <p>{fakeData.authors}</p>
                    </div>
                    <div>
                        <h2 className='font-semibold'>DOI</h2>
                        <p>{fakeData.doi}</p>
                    </div>
                    <div>
                        <h2 className='font-semibold'>Description</h2>
                        <p>{fakeData.description}</p>
                    </div>
                </div>


            </div>
        </>
    )
}

export default PipelinePage