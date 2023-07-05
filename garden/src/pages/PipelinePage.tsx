import React from 'react';
import { useParams } from "react-router-dom";

const PipelinePage = () => {
    const { doi } = useParams();
    console.log(doi, 'DOI for pipeline page');
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
            <div className='h-full w-full flex flex-col gap-12 px-36 py-24'>
                {/* Place breadcrumbs here */}

                {/* Pipeline Header */}
                <div className='flex flex-col gap-1'>
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
                    <div className='text-gray-500 text-sm flex gap-1'>
                        <span>Version {fakeData.version}</span>
                        <span>|</span>
                        <span>{fakeData.year}</span>
                        <span>|</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                        <div>
                            { fakeData.tags
                            .map<React.ReactNode>(t => <span>{t}</span>)
                            .reduce((prev, curr) => [prev, ', ', curr])
                            }
                        </div>
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
                    <div>
                        <h2 className='font-semibold'>GitHub Repository</h2>
                        <a href={fakeData.repository} target="_blank" rel="noopener noreferrer">{fakeData.repository}</a>
                    </div>
                </div>

                {/* Run Pipeline */}
                <div className='flex flex-col gap-3'>
                    <h2 className='text-3xl text-center'>Run this pipeline</h2>
                    <div className='flex justify-evenly py-2'>
                        <a href='https://wholetale.org/' target="_blank" rel="noopener noreferrer" className='border border-gray-200 shadow-sm rounded-lg hover:shadow-md flex flex-col gap-4 p-5 items-center justify-between hover:no-underline'>
                            <img src='img/whole_tale_logo.svg' alt='Whole Tale logo' className='w-40 max-w-xs max-h-32 object-contain'></img>
                            <span className='text-center text-xl text-gray-600'>Open in<br></br>Whole Tale</span>
                        </a>
                        <a href='https://huggingface.co/' target="_blank" rel="noopener noreferrer" className='border border-gray-200 shadow-sm rounded-lg hover:shadow-md flex flex-col gap-4 p-5 items-center justify-between hover:no-underline'>
                            <img src='img/hf-logo.png' alt='HuggingFace logo' className='w-40 max-h-32 object-contain'></img>
                            <span className='text-center text-xl text-gray-600'>Open in<br></br>HuggingFace</span>
                        </a>
                        <a href='https://colab.research.google.com/' target="_blank" rel="noopener noreferrer" className='border border-gray-200 shadow-sm rounded-lg hover:shadow-md flex flex-col gap-4 p-5 items-center justify-between hover:no-underline'>
                            <img src='img/gcolab-logo.png' alt='Google Colab logo' className='w-40 max-w-xs max-h-32 object-contain'></img>
                            <span className='text-center text-xl text-gray-600'>Open in<br></br>Google Colab</span>
                        </a>
                    </div>
                    {/* For inserting code blocks, consider: https://github.com/rajinwonderland/react-code-blocks#-demo */}
                </div>

                {/* Steps */}
                <div>
                    {/* Considering https://szhsin.github.io/react-accordion/ for the accordion tabs */}
                    {/* <h2 className='text-3xl text-center'>Explore its steps</h2> */}
                </div>
            </div>
        </>
    )
}

export default PipelinePage