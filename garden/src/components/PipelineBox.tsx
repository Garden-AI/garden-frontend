import React from 'react'
import { useNavigate } from 'react-router-dom';

const PipelineBox = ({ doi }: { doi: string }) => {
    const navigate = useNavigate();
    const fakeData = {
        uuid: "a5f9f612-28ee-4ba7-a104-dc8a70613ea2",
        name: "Crystal Structure Predictor",
        doi: {doi},
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
        <div className='border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col h-56 justify-between hover:shadow-md hover:cursor-pointer' onClick={() => navigate(`/pipeline/${fakeData.uuid}`)}>
            <div className='flex flex-col gap-2'>
                <h2 className='text-xl'>{fakeData.name}</h2>
                <p className='text-gray-500'>{fakeData.steps.length} steps</p>
                <p className='text-gray-500'>{fakeData.description}</p>
            </div>
            <div className='text-gray-500 flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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
    )
}

export default PipelineBox